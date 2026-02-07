package viyom.donation.viyom.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;   // ✅ as requested

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;  // SUPER_ADMIN / FINANCE_ADMIN / REPORT_ADMIN

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONSHIPS ===================== */

    // Many Admins → One Organization
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    // One Admin → Many Fund Allocations
    @OneToMany(mappedBy = "allocatedBy")
    private List<FundAllocation> fundAllocations;

    // One Admin → Many Reports
    @OneToMany(mappedBy = "generatedBy")
    private List<Report> reports;

    // One Admin → One AuthUser
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_user_id", nullable = false, unique = true)
    private AuthUser authUser;
}
