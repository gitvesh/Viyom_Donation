package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.*;
import viyom.donation.viyom.Exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllocationService {

    private final FundAllocationRepository fundAllocationRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final DonationPoolRepository donationPoolRepository;
    private final AdminRepository adminRepository;
    private final AuditLogService auditLogService;

    // Get all allocations
    public Page<FundAllocation> getAllAllocations(Pageable pageable) {
        return fundAllocationRepository.findAll(pageable);
    }

    // Get allocation by ID
    public FundAllocation getAllocationById(Long id) {
        return fundAllocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + id));
    }

    // Get allocations by beneficiary ID
    public List<FundAllocation> getAllocationsByBeneficiaryId(Long beneficiaryId) {
        return fundAllocationRepository.findByBeneficiaryIdOrderByTimestampDesc(beneficiaryId);
    }

    // Get allocations by pool ID
    public List<FundAllocation> getAllocationsByPoolId(Long poolId) {
        return fundAllocationRepository.findByPoolIdOrderByTimestampDesc(poolId);
    }

    // Get allocation summary by beneficiary
    public BigDecimal getTotalAllocatedToBeneficiary(Long beneficiaryId) {
        List<FundAllocation> allocations = fundAllocationRepository.findByBeneficiaryIdOrderByTimestampDesc(beneficiaryId);
        return allocations.stream()
                .map(FundAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
