package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Service.AllocationService;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AllocationController {

    private final AllocationService allocationService;

    // Get all allocations
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<FundAllocation>> getAllAllocations(Pageable pageable) {
        Page<FundAllocation> allocations = allocationService.getAllAllocations(pageable);
        return ResponseEntity.ok(allocations);
    }

    // Get allocation by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<FundAllocation> getAllocationById(@PathVariable Long id) {
        FundAllocation allocation = allocationService.getAllocationById(id);
        return ResponseEntity.ok(allocation);
    }

    // Get allocations by beneficiary ID
    @GetMapping("/beneficiary/{beneficiaryId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<java.util.List<FundAllocation>> getAllocationsByBeneficiaryId(
            @PathVariable Long beneficiaryId) {
        java.util.List<FundAllocation> allocations = allocationService.getAllocationsByBeneficiaryId(beneficiaryId);
        return ResponseEntity.ok(allocations);
    }

    // Get allocations by pool ID
    @GetMapping("/pool/{poolId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<java.util.List<FundAllocation>> getAllocationsByPoolId(
            @PathVariable Long poolId) {
        java.util.List<FundAllocation> allocations = allocationService.getAllocationsByPoolId(poolId);
        return ResponseEntity.ok(allocations);
    }
}
