package viyom.donation.viyom.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.Beneficiary;
import viyom.donation.viyom.Service.BeneficiaryService;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    // Add beneficiary (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Beneficiary> addBeneficiary(@Valid @RequestBody Beneficiary beneficiary) {
        Beneficiary saved = beneficiaryService.addBeneficiary(beneficiary, getCurrentAdminId());
        return ResponseEntity.ok(saved);
    }

    // Get all beneficiaries
    @GetMapping
    public ResponseEntity<Page<Beneficiary>> getAllBeneficiaries(Pageable pageable) {
        Page<Beneficiary> beneficiaries = beneficiaryService.getAllBeneficiaries(pageable);
        return ResponseEntity.ok(beneficiaries);
    }

    // Get beneficiary by ID
    @GetMapping("/{id}")
    public ResponseEntity<Beneficiary> getBeneficiaryById(@PathVariable Long id) {
        Beneficiary beneficiary = beneficiaryService.getBeneficiaryById(id);
        return ResponseEntity.ok(beneficiary);
    }

    // Deactivate beneficiary (admin only)
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deactivateBeneficiary(@PathVariable Long id) {
        beneficiaryService.deactivateBeneficiary(id);
        return ResponseEntity.ok().build();
    }

    // Helper method to get current admin ID (simplified)
    private Long getCurrentAdminId() {
        // In a real implementation, this would extract from SecurityContext
        // For now, returning a placeholder
        return 1L;
    }
}
