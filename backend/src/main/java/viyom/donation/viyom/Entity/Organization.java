package viyom.donation.viyom.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long organizationId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String contactPhone;
    
    @Column(nullable = false)
    private String contactEmail;
    
    // Explicit getters for Lombok compatibility
    public Long getOrganizationId() { return organizationId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getAddress() { return address; }
    public String getContactEmail() { return contactEmail; }
    public String getContactPhone() { return contactPhone; }

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /* ===================== RELATIONSHIPS ===================== */

    // One Organization → Many Admins
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Admin> admins;

    // One Organization → Many Sectors
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Sector> sectors;

    // One Organization → Many Donation Pools
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DonationPool> donationPools;
}

