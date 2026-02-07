package viyom.donation.viyom.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "milestones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long milestoneId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String category; // EDUCATION, HEALTHCARE, FOOD, etc.

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false)
    private Integer targetDonorCount;

    @Column(nullable = false)
    private Boolean achieved;

    @Column(nullable = false)
    private LocalDateTime achievedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Explicit getters for Lombok compatibility
    public Long getMilestoneId() { return milestoneId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public BigDecimal getTargetAmount() { return targetAmount; }
    public Integer getTargetDonorCount() { return targetDonorCount; }
    public Boolean getAchieved() { return achieved; }
    public LocalDateTime getAchievedAt() { return achievedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Explicit setters for Lombok compatibility
    public void setMilestoneId(Long milestoneId) { this.milestoneId = milestoneId; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    public void setTargetDonorCount(Integer targetDonorCount) { this.targetDonorCount = targetDonorCount; }
    public void setAchieved(Boolean achieved) { this.achieved = achieved; }
    public void setAchievedAt(LocalDateTime achievedAt) { this.achievedAt = achievedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    /* ===================== RELATIONSHIPS ===================== */

    // Many Milestones → One Organization
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
}
