package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.FundAllocation;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface FundAllocationRepository extends JpaRepository<FundAllocation, Long> {
    List<FundAllocation> findByDonationPool_PoolId(Long poolId);
    List<FundAllocation> findByBeneficiary_BeneficiaryId(Long beneficiaryId);
    List<FundAllocation> findByAllocatedBy_AdminId(Long adminId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<FundAllocation> findWithLockingByFundAllocationId(Long fundAllocationId);

    // Additional methods for new services - using explicit JPQL
    @Query("SELECT fa FROM FundAllocation fa WHERE fa.donationPool.poolId = :poolId ORDER BY fa.allocatedAt DESC")
    List<FundAllocation> findByPoolIdOrderByTimestampDesc(@Param("poolId") Long poolId);
    
    @Query("SELECT fa FROM FundAllocation fa WHERE fa.beneficiary.beneficiaryId = :beneficiaryId ORDER BY fa.allocatedAt DESC")
    List<FundAllocation> findByBeneficiaryIdOrderByTimestampDesc(@Param("beneficiaryId") Long beneficiaryId);
}
