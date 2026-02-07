package viyom.donation.viyom.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.Sector;
import viyom.donation.viyom.Service.SectorService;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SectorController {

    private final SectorService sectorService;

    // Add sector
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Sector> addSector(@Valid @RequestBody Sector sector) {
        Sector saved = sectorService.addSector(sector);
        return ResponseEntity.ok(saved);
    }

    // Get all sectors
    @GetMapping
    public ResponseEntity<Page<Sector>> getAllSectors(Pageable pageable) {
        Page<Sector> sectors = sectorService.getAllSectors(pageable);
        return ResponseEntity.ok(sectors);
    }

    // Get sector by ID
    @GetMapping("/{id}")
    public ResponseEntity<Sector> getSectorById(@PathVariable Long id) {
        Sector sector = sectorService.getSectorById(id);
        return ResponseEntity.ok(sector);
    }

    // Get sectors by organization
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<Sector>> getSectorsByOrganization(@PathVariable Long organizationId) {
        List<Sector> sectors = sectorService.getSectorsByOrganization(organizationId);
        return ResponseEntity.ok(sectors);
    }

    // Deactivate sector
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deactivateSector(@PathVariable Long id) {
        sectorService.deactivateSector(id);
        return ResponseEntity.ok().build();
    }
}
