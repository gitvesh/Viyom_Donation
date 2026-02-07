package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash; // To be used for blockchain integration

    @Column(name = "blockchain_status")
    private String blockchainStatus; // e.g., PENDING, CONFIRMED, FAILED
    
    // Explicit getters for Lombok compatibility
    public Long getFundAllocationId() { return fundAllocationId; }
    public BigDecimal getAllocatedAmount() { return allocatedAmount; }
    public String getPurpose() { return purpose; }
    public String getBlockchainTxHash() { return blockchainTxHash; }
    public String getBlockchainStatus() { return blockchainStatus; }
    public Beneficiary getBeneficiary() { return beneficiary; }
    public DonationPool getDonationPool() { return donationPool; }
    public Admin getAllocatedBy() { return allocatedBy; }
    public LocalDateTime getAllocatedAt() { return allocatedAt; }

    /* ===================== RELATIONSHIPS ===================== */

    // Many Allocations → One Donation Pool
    @ManyToOne
    @JoinColumn(name = "pool_id", nullable = false)
    private DonationPool donationPool;

    // Many Allocations → One Beneficiary
    @ManyToOne
    @JoinColumn(name = "beneficiary_id", nullable = false)
    private Beneficiary beneficiary;

    // Many Allocations → One Admin
    @ManyToOne
    @JoinColumn(name = "allocated_by_admin_id", nullable = false)
    private Admin allocatedBy;
}
