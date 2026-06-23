package viyom.donation.viyom.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Entity.Sector;
import viyom.donation.viyom.Exception.ResourceNotFoundException;
import viyom.donation.viyom.Repository.OrganizationRepository;
import viyom.donation.viyom.Repository.SectorRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SectorServiceTest {

    @Mock
    private SectorRepository sectorRepository;
    
    @Mock
    private OrganizationRepository organizationRepository;
    
    @InjectMocks
    private SectorService sectorService;
    
    private Organization defaultOrganization;
    private Organization testOrganization;
    
    @BeforeEach
    void setUp() {
        defaultOrganization = new Organization();
        defaultOrganization.setOrganizationId(1L);
        defaultOrganization.setName("Default Organization");
        
        testOrganization = new Organization();
        testOrganization.setOrganizationId(2L);
        testOrganization.setName("Test Organization");
    }
    
    @Test
    void addSector_WithNullOrganization_ShouldUseDefaultOrganization() {
        // Given
        Sector sector = new Sector();
        sector.setName("Education");
        sector.setOrganization(null);
        
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(defaultOrganization));
        when(sectorRepository.save(any(Sector.class))).thenAnswer(invocation -> {
            Sector saved = invocation.getArgument(0);
            saved.setSectorId(1L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });
        
        // When
        Sector result = sectorService.addSector(sector);
        
        // Then
        assertNotNull(result);
        assertEquals("Education", result.getName());
        assertEquals(defaultOrganization, result.getOrganization());
        assertEquals(1L, result.getOrganization().getOrganizationId());
        verify(organizationRepository).findById(1L);
        verify(sectorRepository).save(sector);
    }
    
    @Test
    void addSector_WithValidOrganization_ShouldUseProvidedOrganization() {
        // Given
        Sector sector = new Sector();
        sector.setName("Healthcare");
        sector.setOrganization(testOrganization);
        
        when(organizationRepository.findById(2L)).thenReturn(Optional.of(testOrganization));
        when(sectorRepository.save(any(Sector.class))).thenAnswer(invocation -> {
            Sector saved = invocation.getArgument(0);
            saved.setSectorId(2L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });
        
        // When
        Sector result = sectorService.addSector(sector);
        
        // Then
        assertNotNull(result);
        assertEquals("Healthcare", result.getName());
        assertEquals(testOrganization, result.getOrganization());
        assertEquals(2L, result.getOrganization().getOrganizationId());
        verify(organizationRepository).findById(2L);
        verify(sectorRepository).save(sector);
    }
    
    @Test
    void addSector_WithNonExistentOrganization_ShouldThrowException() {
        // Given
        Sector sector = new Sector();
        sector.setName("Invalid Sector");
        sector.setOrganization(testOrganization);
        
        when(organizationRepository.findById(2L)).thenReturn(Optional.empty());
        
        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> sectorService.addSector(sector)
        );
        
        assertEquals("Organization not found with ID: 2", exception.getMessage());
        verify(organizationRepository).findById(2L);
        verify(sectorRepository, never()).save(any(Sector.class));
    }
    
    @Test
    void addSector_WithDefaultOrganizationNotFound_ShouldThrowException() {
        // Given
        Sector sector = new Sector();
        sector.setName("Test Sector");
        sector.setOrganization(null);
        
        when(organizationRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> sectorService.addSector(sector)
        );
        
        assertEquals("Default organization (ID=1) not found. Please ensure an organization with ID 1 exists.", 
                     exception.getMessage());
        verify(organizationRepository).findById(1L);
        verify(sectorRepository, never()).save(any(Sector.class));
    }
}
