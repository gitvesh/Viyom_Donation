package viyom.donation.viyom.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Column(nullable = false)
    private String reportType; 
    // DONATION_SUMMARY / FUND_USAGE / SECTOR_WISE

    @Column(nullable = false)
    private String filePath; 
    // stored PDF/Excel location

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    /* ===================== RELATIONSHIPS ===================== */

    // Many Reports → One Admin
    @ManyToOne
    @JoinColumn(name = "generated_by_admin_id", nullable = false)
    private Admin generatedBy;
}
