package viyom.donation.viyom.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final AuthUserRepository authUserRepository;
    private final AdminRepository adminRepository;
    private final OrganizationRepository organizationRepository;
    private final DonorRepository donorRepository;
    private final SectorRepository sectorRepository;
    private final DonationPoolRepository donationPoolRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData() {
        return args -> {
            try {
                initDefaultOrganization();
                initDefaultAdmin();
                initDefaultDonor();
                initDefaultSectorsAndPools();
                ensureAllDonorsHaveProfiles();
                log.info("Data initialization completed successfully!");
            } catch (Exception e) {
                log.error("Error during data initialization: {}", e.getMessage(), e);
            }
        };
    }

    @Transactional
    void initDefaultOrganization() {
        if (organizationRepository.count() == 0) {
            Organization org = new Organization();
            org.setName("Viyom NGO");
            org.setDescription("Transparent Donation Platform");
            org.setRegistrationNumber("VYM-2024-001");
            org.setAddress("Mumbai, India");
            org.setContactPhone("+91-1234567890");
            org.setContactEmail("contact@viyom.org");
            org.setActive(true);
            org.setCreatedAt(LocalDateTime.now());
            organizationRepository.save(org);
            log.info("Created default organization: Viyom NGO");
        }
    }

    @Transactional
    void initDefaultAdmin() {
        String adminEmail = "admin@viyom.com";
        String adminPassword = "Admin@123";
        
        AuthUser adminUser = authUserRepository.findByEmail(adminEmail)
            .orElse(new AuthUser());
        
        // Create or update admin user
        adminUser.setEmail(adminEmail);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setRole("ROLE_ADMIN");
        adminUser.setEnabled(true);
        AuthUser savedUser = authUserRepository.save(adminUser);

        // Get or create default organization
        Organization org;
        if (organizationRepository.count() > 0) {
            org = organizationRepository.findAll().get(0);
        } else {
            org = new Organization();
            org.setName("Viyom NGO");
            org.setDescription("Transparent Donation Platform");
            org.setRegistrationNumber("VYM-2024-001");
            org.setAddress("Mumbai, India");
            org.setContactPhone("+91-1234567890");
            org.setContactEmail("contact@viyom.org");
            org.setActive(true);
            org.setCreatedAt(LocalDateTime.now());
            org = organizationRepository.save(org);
        }

        // Create or update admin profile
        Admin admin = adminRepository.findByAuthUser(savedUser)
            .orElse(new Admin());
        admin.setAuthUser(savedUser);
        admin.setFullName("System Administrator");
        admin.setEmail(adminEmail);
        admin.setPhoneNumber("+91-9876543210");
        admin.setPasswordHash("MANAGED_BY_AUTH_USER");
        admin.setRole("ROLE_ADMIN");
        admin.setActive(true);
        if (admin.getCreatedAt() == null) {
            admin.setCreatedAt(LocalDateTime.now());
        }
        admin.setOrganization(org);
        adminRepository.save(admin);

        log.info("Admin ready: {} / password: {}", adminEmail, adminPassword);
    }

    @Transactional
    void initDefaultDonor() {
        String donorEmail = "donor@viyom.com";
        if (!authUserRepository.existsByEmail(donorEmail)) {
            // Create AuthUser
            AuthUser donorUser = new AuthUser();
            donorUser.setEmail(donorEmail);
            donorUser.setPassword(passwordEncoder.encode("donor123"));
            donorUser.setRole("ROLE_DONOR");
            donorUser.setEnabled(true);
            AuthUser savedUser = authUserRepository.save(donorUser);

            // Create Donor profile
            Donor donor = new Donor();
            donor.setAuthUser(savedUser);
            donor.setFullName("Test Donor");
            donor.setEmail(donorEmail);
            donor.setPhoneNumber("+91-9999999999");
            donor.setPanNumber("ABCDE1234F");
            donor.setAnonymous(false);
            donor.setActive(true);
            donor.setCreatedAt(LocalDateTime.now());
            donorRepository.save(donor);

            log.info("Created default donor: {} / password: donor123", donorEmail);
        }
    }

    @Transactional
    void initDefaultSectorsAndPools() {
        Organization org = organizationRepository.findAll().get(0);

        // Create sectors if none exist
        if (sectorRepository.count() == 0) {
            String[][] sectorData = {
                {"Education", "Supporting education for underprivileged children"},
                {"Healthcare", "Medical aid and health services"},
                {"Food & Nutrition", "Food security and nutrition programs"},
                {"Disaster Relief", "Emergency relief and rehabilitation"}
            };

            for (String[] data : sectorData) {
                Sector sector = new Sector();
                sector.setName(data[0]);
                sector.setDescription(data[1]);
                sector.setActive(true);
                sector.setCreatedAt(LocalDateTime.now());
                sector.setOrganization(org);
                Sector savedSector = sectorRepository.save(sector);

                // Create a pool for each sector
                DonationPool pool = new DonationPool();
                pool.setPoolCode(data[0].toUpperCase().replace(" ", "_") + "_POOL_2025");
                pool.setTotalCollectedAmount(BigDecimal.ZERO);
                pool.setTotalAllocatedAmount(BigDecimal.ZERO);
                pool.setAvailableBalance(BigDecimal.ZERO);
                pool.setActive(true);
                pool.setCreatedAt(LocalDateTime.now());
                pool.setOrganization(org);
                pool.setSector(savedSector);
                donationPoolRepository.save(pool);

                log.info("Created sector: {} with pool", data[0]);
            }
        }
    }

    @Transactional
    void ensureAllDonorsHaveProfiles() {
        // Find all users with DONOR role who don't have a donor profile
        List<AuthUser> donorUsers = authUserRepository.findAll().stream()
            .filter(user -> "ROLE_DONOR".equals(user.getRole()))
            .filter(user -> !donorRepository.existsByAuthUser(user))
            .toList();

        for (AuthUser user : donorUsers) {
            Donor donor = new Donor();
            donor.setAuthUser(user);
            donor.setFullName(user.getEmail().split("@")[0]); // Use part of email as name
            donor.setEmail(user.getEmail());
            donor.setPhoneNumber("+91-0000000000"); // Placeholder
            donor.setPanNumber("PAN" + user.getId()); // Generate placeholder PAN
            donor.setAnonymous(false);
            donor.setActive(true);
            donor.setCreatedAt(LocalDateTime.now());
            donorRepository.save(donor);
            log.info("Created donor profile for user: {}", user.getEmail());
        }

        if (!donorUsers.isEmpty()) {
            log.info("Created {} donor profiles for existing users", donorUsers.size());
        }
    }
}
