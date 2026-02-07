package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Sector;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Repository.SectorRepository;
import viyom.donation.viyom.Repository.OrganizationRepository;
import viyom.donation.viyom.Exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SectorService {

    private final SectorRepository sectorRepository;
    private final OrganizationRepository organizationRepository;

    // Add sector
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Sector addSector(Sector sector) {
        log.info("Adding new sector: {}", sector.getName());
        
        // Ensure organization is properly attached
        Organization organization = resolveOrganization(sector.getOrganization());
        sector.setOrganization(organization);
        
        sector.setCreatedAt(LocalDateTime.now());
        return sectorRepository.save(sector);
    }

    /**
     * Resolves the Organization for a Sector.
     * If organization is provided with ID → validates and uses it
     * If organization is null → attaches default organization (ID = 1)
     * 
     * @param organization the organization from the request (may be null)
     * @return the managed Organization entity
     * @throws ResourceNotFoundException if specified organization doesn't exist
     */
    private Organization resolveOrganization(Organization organization) {
        // If no organization provided, use default (ID = 1)
        if (organization == null || organization.getOrganizationId() == null) {
            log.debug("No organization provided, using default organization ID = 1");
            return organizationRepository.findById(1L)
                    .orElseThrow(() -> new ResourceNotFoundException("Default organization (ID=1) not found. Please ensure an organization with ID 1 exists."));
        }
        
        // Validate that the specified organization exists
        Long organizationId = organization.getOrganizationId();
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + organizationId));
    }

    // Get all sectors
    public Page<Sector> getAllSectors(Pageable pageable) {
        return sectorRepository.findAll(pageable);
    }

    // Get sector by ID
    public Sector getSectorById(Long id) {
        return sectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sector not found with id: " + id));
    }

    // Get sectors by organization
    public List<Sector> getSectorsByOrganization(Long organizationId) {
        return sectorRepository.findByOrganizationId(organizationId);
    }

    // Deactivate sector
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public void deactivateSector(Long id) {
        Sector sector = getSectorById(id);
        sector.setActive(false);
        sectorRepository.save(sector);
        log.info("Deactivated sector: {}", id);
    }
}
