package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(nullable = false)
    private String channel; 
    // SMS / EMAIL / IN_APP

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String status; 
    // SENT / FAILED / PENDING

    @Column(nullable = false)
    private LocalDateTime sentAt;

    /* ===================== RELATIONSHIPS ===================== */

    // Many Notifications → One Donor
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    // Optional link to Fund Allocation
    @ManyToOne
    @JoinColumn(name = "fund_allocation_id")
    private FundAllocation fundAllocation;
}

