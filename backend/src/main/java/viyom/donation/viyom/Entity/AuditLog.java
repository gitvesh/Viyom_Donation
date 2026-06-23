package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(nullable = false)
    private String action; // e.g., FUND_ALLOCATED

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    private Long beneficiaryId;

    private Long poolId;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

