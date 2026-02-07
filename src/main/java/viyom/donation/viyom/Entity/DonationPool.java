package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "donation_pools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationPool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long poolId;

    @Column(nullable = false, unique = true)
    private String poolCode; // e.g. FOOD_POOL_2025

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCollectedAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAllocatedAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal availableBalance;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Explicit getters for Lombok compatibility
    public Long getPoolId() { return poolId; }
    public String getPoolCode() { return poolCode; }
    public BigDecimal getTotalCollectedAmount() { return totalCollectedAmount; }
    public BigDecimal getTotalAllocatedAmount() { return totalAllocatedAmount; }
    public BigDecimal getAvailableBalance() { return availableBalance; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Explicit setters for Lombok compatibility
    public void setPoolId(Long poolId) { this.poolId = poolId; }
    public void setPoolCode(String poolCode) { this.poolCode = poolCode; }
    public void setTotalCollectedAmount(BigDecimal totalCollectedAmount) { this.totalCollectedAmount = totalCollectedAmount; }
    public void setTotalAllocatedAmount(BigDecimal totalAllocatedAmount) { this.totalAllocatedAmount = totalAllocatedAmount; }
    public void setAvailableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; }
    public void setActive(Boolean active) { this.active = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /* ===================== RELATIONSHIPS ===================== */

    // Many Pools → One Organization
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // One Pool → One Sector
    @OneToOne
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    // One Pool → Many Donations
    @OneToMany(mappedBy = "donationPool")
    private List<Donation> donations;

    // One Pool → Many Fund Allocations
    @OneToMany(mappedBy = "donationPool")
    private List<FundAllocation> fundAllocations;
}

