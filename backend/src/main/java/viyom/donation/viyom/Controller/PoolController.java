package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Service.PoolService;
import viyom.donation.viyom.dto.CreatePoolRequest;

import java.util.List;

@RestController
@RequestMapping("/api/pools")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PoolController {

    private final PoolService poolService;

    // Get all donation pools
    @GetMapping
    public ResponseEntity<Page<DonationPool>> getAllPools(Pageable pageable) {
        Page<DonationPool> pools = poolService.getAllPools(pageable);
        return ResponseEntity.ok(pools);
    }

    // Get pool by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonationPool> getPoolById(@PathVariable Long id) {
        DonationPool pool = poolService.getPoolById(id);
        return ResponseEntity.ok(pool);
    }

    // Get active pools
    @GetMapping("/active")
    public ResponseEntity<List<DonationPool>> getActivePools() {
        List<DonationPool> pools = poolService.getActivePools();
        return ResponseEntity.ok(pools);
    }

    // Get pool by sector
    @GetMapping("/sector/{sectorId}")
    public ResponseEntity<DonationPool> getPoolBySector(@PathVariable Long sectorId) {
        DonationPool pool = poolService.getPoolBySector(sectorId);
        return ResponseEntity.ok(pool);
    }

    // Create new pool
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DonationPool> createPool(@RequestBody CreatePoolRequest request) {
        DonationPool pool = poolService.createPool(request);
        return ResponseEntity.ok(pool);
    }

    // Deactivate pool
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DonationPool> deactivatePool(@PathVariable Long id) {
        DonationPool pool = poolService.deactivatePool(id);
        return ResponseEntity.ok(pool);
    }

    // Auto-create pools for sectors without pools
    @PostMapping("/auto-create-missing")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> autoCreateMissingPools() {
        int created = poolService.createMissingPools();
        return ResponseEntity.ok(new AutoCreateResponse(created, "Successfully created " + created + " missing pool(s)"));
    }

    // Response class for auto-create endpoint
    public static class AutoCreateResponse {
        private final int poolsCreated;
        private final String message;

        public AutoCreateResponse(int poolsCreated, String message) {
            this.poolsCreated = poolsCreated;
            this.message = message;
        }

        public int getPoolsCreated() {
            return poolsCreated;
        }

        public String getMessage() {
            return message;
        }
    }
}
