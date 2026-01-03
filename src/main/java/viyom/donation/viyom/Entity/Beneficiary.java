package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long beneficiaryId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String beneficiaryType; 
    // INDIVIDUAL / ORGANIZATION / EVENT / ACTIVITY

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String contactDetails;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONSHIPS ===================== */

    // One Beneficiary → Many Fund Allocations
    @OneToMany(mappedBy = "beneficiary")
    private List<FundAllocation> fundAllocations;
}

