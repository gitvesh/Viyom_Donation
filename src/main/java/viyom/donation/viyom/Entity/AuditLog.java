package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

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
    private Long auditLogId;

    @Column(nullable = false)
    private String action; 
    // CREATE_POOL / ALLOCATE_FUNDS / GENERATE_REPORT

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime actionTime;

    /* ===================== RELATIONSHIPS ===================== */

    // Many Audit Logs → One Admin
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;
}

