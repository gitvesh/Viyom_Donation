package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Entity.Sector;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Repository.DonationPoolRepository;
import viyom.donation.viyom.Repository.SectorRepository;
import viyom.donation.viyom.Repository.OrganizationRepository;
import viyom.donation.viyom.Exception.ResourceNotFoundException;
import viyom.donation.viyom.dto.CreatePoolRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PoolService {

    private final DonationPoolRepository donationPoolRepository;
    private final SectorRepository sectorRepository;
    private final OrganizationRepository organizationRepository;

    // Get all donation pools
    public Page<DonationPool> getAllPools(Pageable pageable) {
        return donationPoolRepository.findAll(pageable);
    }

    // Get pool by ID
    public DonationPool getPoolById(Long id) {
        return donationPoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pool not found with id: " + id));
    }

    // Get active pools
    public List<DonationPool> getActivePools() {
        return donationPoolRepository.findByActiveTrue();
    }

    // Update pool balance (internal use)
    @Transactional
    public DonationPool updatePoolBalance(Long poolId, java.math.BigDecimal newBalance) {
        DonationPool pool = getPoolById(poolId);
        pool.setAvailableBalance(newBalance);
        return donationPoolRepository.save(pool);
    }

    // Get pools by sector
    public DonationPool getPoolBySector(Long sectorId) {
        return donationPoolRepository.findBySector_SectorIdAndActiveTrue(sectorId)
                .orElseThrow(() -> new ResourceNotFoundException("No active pool found for sector id: " + sectorId));
    }

    // Create new donation pool
    @Transactional
    public DonationPool createPool(CreatePoolRequest request) {
        log.info("Creating new pool for sector: {}, organization: {}", request.getSectorId(), request.getOrganizationId());
        
        // Validate sector exists
        Sector sector = sectorRepository.findById(request.getSectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector not found with id: " + request.getSectorId()));
        
        // Validate organization exists
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));
        
        // Check if pool already exists for this sector
        if (donationPoolRepository.findBySector_SectorIdAndActiveTrue(request.getSectorId()).isPresent()) {
            throw new IllegalStateException("Active pool already exists for sector: " + sector.getName());
        }
        
        // Generate pool code
        String poolCode = generatePoolCode(sector.getName());
        
        // Create pool
        DonationPool pool = DonationPool.builder()
                .poolCode(poolCode)
                .sector(sector)
                .organization(organization)
                .totalCollectedAmount(BigDecimal.ZERO)
                .totalAllocatedAmount(BigDecimal.ZERO)
                .availableBalance(BigDecimal.ZERO)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
        
        DonationPool savedPool = donationPoolRepository.save(pool);
        log.info("Pool created successfully: {}", savedPool.getPoolCode());
        return savedPool;
    }

    // Deactivate pool
    @Transactional
    public DonationPool deactivatePool(Long poolId) {
        DonationPool pool = getPoolById(poolId);
        pool.setActive(false);
        return donationPoolRepository.save(pool);
    }

    // Helper method to generate pool code
    private String generatePoolCode(String sectorName) {
        String sanitized = sectorName.toUpperCase().replaceAll("[^A-Z0-9]", "_");
        int year = LocalDateTime.now().getYear();
        return sanitized + "_POOL_" + year;
    }

    // Auto-create pools for sectors without pools
    @Transactional
    public int createMissingPools() {
        log.info("Starting auto-creation of missing pools...");
        int created = 0;
        
        // Get all active sectors
        List<Sector> activeSectors = sectorRepository.findByActiveTrue();
        log.info("Found {} active sectors", activeSectors.size());
        
        for (Sector sector : activeSectors) {
            try {
                // Check if pool already exists for this sector
                boolean poolExists = donationPoolRepository.findBySector_SectorIdAndActiveTrue(sector.getSectorId()).isPresent();
                
                if (!poolExists) {
                    log.info("Creating missing pool for sector: {}", sector.getName());
                    
                    // Get default organization
                    Organization organization = organizationRepository.findById(1L)
                            .orElseThrow(() -> new ResourceNotFoundException("Default organization not found"));
                    
                    // Generate pool code
                    String poolCode = generatePoolCode(sector.getName());
                    
                    // Create pool
                    DonationPool pool = DonationPool.builder()
                            .poolCode(poolCode)
                            .sector(sector)
                            .organization(organization)
                            .totalCollectedAmount(BigDecimal.ZERO)
                            .totalAllocatedAmount(BigDecimal.ZERO)
                            .availableBalance(BigDecimal.ZERO)
                            .active(true)
                            .createdAt(LocalDateTime.now())
                            .build();
                    
                    donationPoolRepository.save(pool);
                    created++;
                    log.info("Successfully created pool '{}' for sector '{}'", poolCode, sector.getName());
                } else {
                    log.debug("Pool already exists for sector: {}", sector.getName());
                }
            } catch (Exception e) {
                log.error("Failed to create pool for sector '{}': {}", sector.getName(), e.getMessage(), e);
                // Continue with next sector
            }
        }
        
        log.info("Auto-creation completed. Created {} missing pool(s)", created);
        return created;
    }
}
