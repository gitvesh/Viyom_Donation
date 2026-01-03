package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "donor_allocation_shares")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorAllocationShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donorAllocationShareId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal donorContributionAmount; 
    // donor's original contribution in pool

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal allocatedShareAmount; 
    // how much of allocation used from this donor

    /* ===================== RELATIONSHIPS ===================== */

    // Many Shares → One Donor
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    // Many Shares → One Fund Allocation
    @ManyToOne
    @JoinColumn(name = "fund_allocation_id", nullable = false)
    private FundAllocation fundAllocation;
}

