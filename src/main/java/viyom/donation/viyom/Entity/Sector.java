package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sectors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectorId;

    @Column(nullable = false)
    private String name;   // Education, Food, Medical, etc.

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Explicit getters for Lombok compatibility
    public Long getSectorId() { return sectorId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Explicit setters for Lombok compatibility
    public void setSectorId(Long sectorId) { this.sectorId = sectorId; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setActive(Boolean active) { this.active = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /* ===================== RELATIONSHIPS ===================== */

    // Many Sectors → One Organization
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // One Sector → One Donation Pool
    @OneToOne(mappedBy = "sector")
    private DonationPool donationPool;
}

