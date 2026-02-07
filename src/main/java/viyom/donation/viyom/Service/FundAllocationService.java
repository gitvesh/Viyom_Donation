package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.*;
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

        // Create fund allocation with default blockchain values
        FundAllocation allocation = FundAllocation.builder()
                .allocatedAmount(request.getAmount())
                .purpose(request.getPurpose())
                .allocatedAt(LocalDateTime.now())
                .blockchainTxHash("PENDING_" + System.currentTimeMillis()) // Unique pending identifier
                .blockchainStatus("PENDING")
                .donationPool(pool)
                .beneficiary(beneficiary)
                .allocatedBy(currentAdmin)
                .build();
                
        log.debug("Created fund allocation with pending blockchain status for pool: {}, beneficiary: {}", 
                pool.getPoolId(), beneficiary.getBeneficiaryId());

        FundAllocation savedAllocation = fundAllocationRepository.save(allocation);
        donationPoolRepository.save(pool);

        // Create audit log
        auditLogService.logFundAllocation(currentAdmin.getAdminId(), request.getAmount(), 
                beneficiary.getBeneficiaryId(), pool.getPoolId());

        log.info("Fund allocation completed successfully: allocationId={}, amount={}", 
                savedAllocation.getFundAllocationId(), request.getAmount());

        return savedAllocation;
    }

    @Transactional(readOnly = true)
    public List<FundAllocation> getAllAllocations() {
        return fundAllocationRepository.findAll();
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

