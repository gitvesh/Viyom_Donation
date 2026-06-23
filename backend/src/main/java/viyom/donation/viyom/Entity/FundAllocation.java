package viyom.donation.viyom.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "fund_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fundAllocationId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false)
    private String purpose; // short explanation

    @Column(nullable = false)
    private LocalDateTime allocatedAt;

    @Column(name = "allocation_txn_hash")
    private String allocationTxnHash; // To be used for blockchain integration

    @Column(name = "blockchain_status")
    private String blockchainStatus; // e.g., PENDING, CONFIRMED, FAILED
    
    // Explicit getters for Lombok compatibility
    public Long getFundAllocationId() { return fundAllocationId; }
    public BigDecimal getAllocatedAmount() { return allocatedAmount; }
    public String getPurpose() { return purpose; }
    public String getAllocationTxnHash() { return allocationTxnHash; }
    public String getBlockchainStatus() { return blockchainStatus; }
    public Beneficiary getBeneficiary() { return beneficiary; }
    public DonationPool getDonationPool() { return donationPool; }
    public Admin getAllocatedBy() { return allocatedBy; }
    public LocalDateTime getAllocatedAt() { return allocatedAt; }
    
    // Expose IDs for API responses
    @JsonProperty("poolId")
    public Long getPoolId() {
        return donationPool != null ? donationPool.getPoolId() : null;
    }
    
    @JsonProperty("beneficiaryId")
    public Long getBeneficiaryId() {
        return beneficiary != null ? beneficiary.getBeneficiaryId() : null;
    }

    /* ===================== RELATIONSHIPS ===================== */

    // Many Allocations → One Donation Pool
    @ManyToOne
    @JoinColumn(name = "pool_id", nullable = false)
    @JsonIgnore
    private DonationPool donationPool;

    // Many Allocations → One Beneficiary
    @ManyToOne
    @JoinColumn(name = "beneficiary_id", nullable = false)
    @JsonIgnore
    private Beneficiary beneficiary;

    // Many Allocations → One Admin
    @ManyToOne
    @JoinColumn(name = "allocated_by_admin_id", nullable = false)
    @JsonIgnore
    private Admin allocatedBy;
}
