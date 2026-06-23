package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentTransactionId;

    @Column(nullable = false, unique = true)
    private String razorpayPaymentId;

    @Column(nullable = false)
    private String razorpaySignature;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal paidAmount;

    @Column(nullable = false)
    private String status; // SUCCESS / FAILED

    @Column(nullable = false)
    private LocalDateTime paymentTime;

    /* ===================== RELATIONSHIPS ===================== */

    // One Transaction → One PaymentOrder
    @OneToOne
    @JoinColumn(name = "payment_order_id", nullable = false)
    private PaymentOrder paymentOrder;
}

