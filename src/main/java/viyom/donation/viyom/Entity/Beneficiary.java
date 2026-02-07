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
    
    // Explicit getters for Lombok compatibility
    public Long getBeneficiaryId() { return beneficiaryId; }
    public String getName() { return name; }
    public String getBeneficiaryType() { return beneficiaryType; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Explicit setters for Lombok compatibility
    public void setBeneficiaryId(Long beneficiaryId) { this.beneficiaryId = beneficiaryId; }
    public void setName(String name) { this.name = name; }
    public void setBeneficiaryType(String beneficiaryType) { this.beneficiaryType = beneficiaryType; }
    public void setDescription(String description) { this.description = description; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public void setActive(Boolean active) { this.active = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /* ===================== RELATIONSHIPS ===================== */

    // One Beneficiary → Many Fund Allocations
    @OneToMany(mappedBy = "beneficiary")
    private List<FundAllocation> fundAllocations;
}

