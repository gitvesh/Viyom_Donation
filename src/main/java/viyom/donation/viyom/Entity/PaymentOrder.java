package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentOrderId;

    @Column(nullable = false, unique = true)
    private String razorpayOrderId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String status; // CREATED / PAID / FAILED / CANCELLED

    @Column(nullable = false)
    private String receiptReference;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONSHIPS ===================== */

    // Many PaymentOrders → One Donor
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    // Many PaymentOrders → One DonationPool
    @ManyToOne
    @JoinColumn(name = "pool_id", nullable = false)
    private DonationPool donationPool;

    // One PaymentOrder → One Donation
    @OneToOne(mappedBy = "paymentOrder")
    private Donation donation;
}
