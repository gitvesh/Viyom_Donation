package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final FundAllocationRepository fundAllocationRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final DonationPoolRepository donationPoolRepository;

    // Beneficiary allocation summary
    public List<BeneficiaryAllocationSummary> getBeneficiaryAllocationSummary() {
        List<Beneficiary> beneficiaries = beneficiaryRepository.findByActiveTrue();
        
        return beneficiaries.stream()
                .map(beneficiary -> {
                    BigDecimal totalAllocated = getTotalAllocatedToBeneficiary(beneficiary.getBeneficiaryId());
                    return new BeneficiaryAllocationSummary(
                            beneficiary.getBeneficiaryId(),
                            beneficiary.getName(),
                            totalAllocated,
                            beneficiary.getActive()
                    );
                })
                .collect(Collectors.toList());
    }

    // Ledger summary - allocation history grouped logically
    public List<AllocationLedgerEntry> getAllocationLedgerSummary() {
        List<FundAllocation> allocations = fundAllocationRepository.findAll();
        
        return allocations.stream()
                .map(allocation -> new AllocationLedgerEntry(
                        allocation.getFundAllocationId(),
                        allocation.getAllocatedAmount(),
                        allocation.getPurpose(),
                        allocation.getBeneficiary().getName(),
                        allocation.getDonationPool().getPoolCode() != null ? allocation.getDonationPool().getPoolCode() : "Pool " + allocation.getDonationPool().getPoolId(),
                        allocation.getAllocatedAt()
                ))
                .collect(Collectors.toList());
    }

    // Pool summary
    public List<PoolSummary> getPoolSummary() {
        List<DonationPool> pools = donationPoolRepository.findByActiveTrue();
        
        return pools.stream()
                .map(pool -> new PoolSummary(
                        pool.getPoolId(),
                        pool.getPoolCode() != null ? pool.getPoolCode() : "Pool " + pool.getPoolId(),
                        pool.getAvailableBalance(),
                        pool.getTotalAllocatedAmount(),
                        pool.getActive()
                ))
                .collect(Collectors.toList());
    }

    // Helper method to get total allocated to beneficiary
    private BigDecimal getTotalAllocatedToBeneficiary(Long beneficiaryId) {
        List<FundAllocation> allocations = fundAllocationRepository.findByBeneficiaryIdOrderByTimestampDesc(beneficiaryId);
        return allocations.stream()
                .map(FundAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // DTOs for summary responses
    public static class BeneficiaryAllocationSummary {
        public BeneficiaryAllocationSummary(Long beneficiaryId, String beneficiaryName, 
                                     BigDecimal totalAllocated, Boolean isActive) {
            this.beneficiaryId = beneficiaryId;
            this.beneficiaryName = beneficiaryName;
            this.totalAllocated = totalAllocated;
            this.isActive = isActive;
        }
        
        private final Long beneficiaryId;
        private final String beneficiaryName;
        private final BigDecimal totalAllocated;
        private final Boolean isActive;
        
        // Getters
        public Long getBeneficiaryId() { return beneficiaryId; }
        public String getBeneficiaryName() { return beneficiaryName; }
        public BigDecimal getTotalAllocated() { return totalAllocated; }
        public Boolean getIsActive() { return isActive; }
    }

    public static class AllocationLedgerEntry {
        public AllocationLedgerEntry(Long allocationId, BigDecimal amount, String purpose,
                                  String beneficiaryName, String poolName, 
                                  java.time.LocalDateTime createdAt) {
            this.allocationId = allocationId;
            this.amount = amount;
            this.purpose = purpose;
            this.beneficiaryName = beneficiaryName;
            this.poolName = poolName;
            this.createdAt = createdAt;
        }
        
        private final Long allocationId;
        private final BigDecimal amount;
        private final String purpose;
        private final String beneficiaryName;
        private final String poolName;
        private final java.time.LocalDateTime createdAt;
        
        // Getters
        public Long getAllocationId() { return allocationId; }
        public BigDecimal getAmount() { return amount; }
        public String getPurpose() { return purpose; }
        public String getBeneficiaryName() { return beneficiaryName; }
        public String getPoolName() { return poolName; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    }

    public static class PoolSummary {
        public PoolSummary(Long poolId, String poolName, 
                        BigDecimal availableBalance, BigDecimal totalAllocated, 
                        Boolean isActive) {
            this.poolId = poolId;
            this.poolName = poolName;
            this.availableBalance = availableBalance;
            this.totalAllocated = totalAllocated;
            this.isActive = isActive;
        }
        
        private final Long poolId;
        private final String poolName;
        private final BigDecimal availableBalance;
        private final BigDecimal totalAllocated;
        private final Boolean isActive;
        
        // Getters
        public Long getPoolId() { return poolId; }
        public String getPoolName() { return poolName; }
        public BigDecimal getAvailableBalance() { return availableBalance; }
        public BigDecimal getTotalAllocated() { return totalAllocated; }
        public Boolean getIsActive() { return isActive; }
    }
}
