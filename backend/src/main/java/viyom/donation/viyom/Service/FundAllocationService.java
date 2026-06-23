package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.*;
import viyom.donation.viyom.blockchain.service.AllocationBlockchainAsyncService;
import viyom.donation.viyom.blockchain.service.BlockchainService;
import viyom.donation.viyom.dto.AllocationResponse;
import viyom.donation.viyom.dto.FundAllocationRequest;
import viyom.donation.viyom.Exception.OrganizationNotFoundException;
import viyom.donation.viyom.Exception.BeneficiaryNotFoundException;
import viyom.donation.viyom.Exception.InsufficientFundsException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FundAllocationService {

    private final DonationPoolRepository donationPoolRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final FundAllocationRepository fundAllocationRepository;
    private final AdminRepository adminRepository;
    private final AuditLogService auditLogService;
    private final AllocationBlockchainAsyncService allocationBlockchainAsyncService;

    @Transactional
    public FundAllocation createFundAllocation(FundAllocationRequest request, Admin admin) {
        log.info("Starting fund allocation: adminId={}, beneficiaryId={}, poolId={}, amount={}",
                admin.getAdminId(), request.getBeneficiaryId(), request.getPoolId(), request.getAmount());

        // Validate admin has organization
        if (admin.getOrganization() == null) {
            throw new OrganizationNotFoundException("Admin is not associated with any organization");
        }

        Admin currentAdmin = adminRepository.findById(admin.getAdminId())
                .orElseThrow(() -> new SecurityException("Admin not found with ID: " + admin.getAdminId()));

        Beneficiary beneficiary = beneficiaryRepository.findById(request.getBeneficiaryId())
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found with ID: " + request.getBeneficiaryId()));

        DonationPool pool = donationPoolRepository.findWithLockingByPoolId(request.getPoolId())
                .orElseThrow(() -> new OrganizationNotFoundException("Donation Pool not found with ID: " + request.getPoolId()));

        // Validate admin is active
        if (!currentAdmin.getActive()) {
            throw new SecurityException("Admin is not active: " + currentAdmin.getAdminId());
        }

        // Validate beneficiary is active
        if (!beneficiary.getActive()) {
            throw new BeneficiaryNotFoundException("Beneficiary is not active: " + request.getBeneficiaryId());
        }

        // Validate pool is active
        if (!pool.getActive()) {
            throw new OrganizationNotFoundException("Donation pool is not active: " + request.getPoolId());
        }

        // Validate sufficient balance
        if (pool.getAvailableBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds in Donation Pool. Available: " +
                    pool.getAvailableBalance() + ", Requested: " + request.getAmount());
        }

        // Validate amount is positive
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Allocation amount must be positive");
        }

        // Update pool balances atomically
        pool.setAvailableBalance(pool.getAvailableBalance().subtract(request.getAmount()));
        pool.setTotalAllocatedAmount(pool.getTotalAllocatedAmount().add(request.getAmount()));

        // Create fund allocation with PENDING blockchain status
        FundAllocation allocation = FundAllocation.builder()
                .allocatedAmount(request.getAmount())
                .purpose(request.getPurpose())
                .allocatedAt(LocalDateTime.now())
                .allocationTxnHash(null)          // will be set by async blockchain call
                .blockchainStatus("PENDING")      // starts as PENDING
                .donationPool(pool)
                .beneficiary(beneficiary)
                .allocatedBy(currentAdmin)
                .build();

        log.debug("Saving fund allocation with PENDING blockchain status – pool: {}, beneficiary: {}",
                pool.getPoolId(), beneficiary.getBeneficiaryId());

        FundAllocation savedAllocation = fundAllocationRepository.save(allocation);
        donationPoolRepository.save(pool);

        // Snapshot the values needed for the async blockchain call (avoid entity detachment issues)
        Long allocationId             = savedAllocation.getFundAllocationId();
        BigDecimal allocationAmount   = savedAllocation.getAllocatedAmount();
        String beneficiaryName        = beneficiary.getName() != null 
                                        ? beneficiary.getName() : "unknown";
        Long timestamp                = System.currentTimeMillis() / 1000;

        // Fire-and-forget: record on blockchain asynchronously via dedicated service
        allocationBlockchainAsyncService.recordAllocationOnBlockchainAsync(allocationId, beneficiaryName, allocationAmount, timestamp);

        // Audit log (synchronous)
        auditLogService.logFundAllocation(currentAdmin.getAdminId(), request.getAmount(),
                beneficiary.getBeneficiaryId(), pool.getPoolId());

        log.info("Fund allocation saved: allocationId={}, amount={}, blockchainStatus=PENDING",
                allocationId, request.getAmount());

        return savedAllocation;
    }

    /**
     * Asynchronously records a fund allocation on the blockchain and updates the DB
     * with the returned transaction hash.
     *
     * IMPORTANT: This method receives only primitive/scalar snapshots of the saved entity
     * (IDs and amounts) rather than a JPA entity, to avoid Hibernate DetachedEntityException
     * when the callback runs in a separate thread after the parent @Transactional has committed.
     */
    // Async logic moved to AllocationBlockchainAsyncService for proxy compatibility

    /**
     * Opens a fresh transaction to update the FundAllocation with the blockchain result.
     * Called from the async callback – uses allocationId (not entity reference) to load
     * a fresh entity within a new Hibernate session.
     */
    @Transactional
    public void updateAllocationBlockchainStatus(Long allocationId, BlockchainService.BlockchainResult result) {
        try {
            FundAllocation allocation = fundAllocationRepository.findById(allocationId).orElse(null);
            if (allocation == null) {
                log.error("Allocation not found for status update: {}", allocationId);
                return;
            }

            if (result != null && result.getTransactionHash() != null) {
                allocation.setAllocationTxnHash(result.getTransactionHash());
                
                if (result.isSuccess()) {
                    allocation.setBlockchainStatus("CONFIRMED");
                    log.info("✅ Allocation {} – blockchain status set to CONFIRMED. TxHash: {}",
                            allocationId, result.getTransactionHash());
                } else {
                    allocation.setBlockchainStatus("FAILED");
                    log.warn("⚠️  Allocation {} – blockchain transaction REVERTED. Status set to FAILED. TxHash: {}", 
                            allocationId, result.getTransactionHash());
                }
                
                fundAllocationRepository.save(allocation);
            } else {
                allocation.setAllocationTxnHash(null);
                allocation.setBlockchainStatus("FAILED");
                fundAllocationRepository.save(allocation);
                log.warn("⚠️  Allocation {} – blockchain recording failed (no hash). Status set to FAILED.", allocationId);
            }
        } catch (Exception e) {
            log.error("Error updating blockchain status for allocation {}: {}", allocationId, e.getMessage(), e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Query methods
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AllocationResponse> getAllAllocationsResponse() {
        return fundAllocationRepository.findAll().stream()
                .map(this::mapToAllocationResponse)
                .toList();
    }

    private AllocationResponse mapToAllocationResponse(FundAllocation allocation) {
        return AllocationResponse.builder()
                .allocationId(allocation.getFundAllocationId())
                .beneficiary(allocation.getBeneficiary() != null ? allocation.getBeneficiary().getName() : "unknown")
                .amount(allocation.getAllocatedAmount())
                .allocationDate(allocation.getAllocatedAt())
                .purpose(allocation.getPurpose())
                .allocationTxnHash(allocation.getAllocationTxnHash())
                .blockchainStatus(allocation.getBlockchainStatus())
                .poolCode(allocation.getDonationPool() != null ? allocation.getDonationPool().getPoolCode() : "N/A")
                .build();
    }

    @Transactional(readOnly = true)
    public List<FundAllocation> getAllocationsByBeneficiary(Long beneficiaryId) {
        return fundAllocationRepository.findByBeneficiary_BeneficiaryId(beneficiaryId);
    }

    @Transactional(readOnly = true)
    public List<FundAllocation> getAllocationsByDonationPool(Long poolId) {
        return fundAllocationRepository.findByDonationPool_PoolId(poolId);
    }

    @Transactional(readOnly = true)
    public List<FundAllocation> getAllocationsByAdmin(Long adminId) {
        return fundAllocationRepository.findByAllocatedBy_AdminId(adminId);
    }

    @Transactional(readOnly = true)
    public BigDecimal getPoolAvailableBalance(Long poolId) {
        DonationPool pool = donationPoolRepository.findById(poolId)
                .orElseThrow(() -> new IllegalArgumentException("Donation pool not found with ID: " + poolId));
        return pool.getAvailableBalance();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalAllocatedToBeneficiary(Long beneficiaryId) {
        return fundAllocationRepository.findByBeneficiary_BeneficiaryId(beneficiaryId)
                .stream()
                .map(FundAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalAllocatedFromPool(Long poolId) {
        return fundAllocationRepository.findByDonationPool_PoolId(poolId)
                .stream()
                .map(FundAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
