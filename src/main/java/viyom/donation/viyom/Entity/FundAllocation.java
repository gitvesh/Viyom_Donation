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

    @Column(nullable = false)
    private String blockchainTxHash; // allocation recorded on blockchain

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

    // One Allocation → Many Donor Shares
    @OneToMany(mappedBy = "fundAllocation", cascade = CascadeType.ALL)
    private List<DonorAllocationShare> donorShares;
}
