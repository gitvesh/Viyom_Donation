package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime donatedAt;

    @Column(nullable = false)
    private Boolean anonymous;

    @Column(nullable = false)
    private String blockchainTxHash; // donation recorded on blockchain

    /* ===================== RELATIONSHIPS ===================== */

    // Many Donations → One Donor
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    // Many Donations → One Donation Pool
    @ManyToOne
    @JoinColumn(name = "pool_id", nullable = false)
    private DonationPool donationPool;

    // One Donation → One PaymentOrder
    @OneToOne
    @JoinColumn(name = "payment_order_id", nullable = false)
    private PaymentOrder paymentOrder;
}

