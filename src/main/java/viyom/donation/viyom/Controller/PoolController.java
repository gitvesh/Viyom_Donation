package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Service.PoolService;

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
}
