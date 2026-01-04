package viyom.donation.viyom.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donorId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;     // ✅ added

    @Column(nullable = false, unique = true)
    private String panNumber;       // ✅ added

    @Column(nullable = false)
    private Boolean anonymous;      // controls public visibility

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONSHIPS ===================== */

    // One Donor → Many Donations
    @OneToMany(mappedBy = "donor")
    private List<Donation> donations;

    // One Donor → Many Notifications
    @OneToMany(mappedBy = "donor")
    private List<Notification> notifications;

    // One Donor → Allocation usage tracking
    @OneToMany(mappedBy = "donor")
    private List<DonorAllocationShare> allocationShares;

     @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_user_id", nullable = false, unique = true)
    private AuthUser authUser;

     
}
