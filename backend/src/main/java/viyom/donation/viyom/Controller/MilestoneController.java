package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.Milestone;
import viyom.donation.viyom.Service.MilestoneService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    // Create new milestone (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Milestone> createMilestone(@Valid @RequestBody Milestone milestone) {
        Milestone created = milestoneService.createMilestone(milestone);
        return ResponseEntity.ok(created);
    }

    // Get all active milestones for an organization
    @GetMapping("/active/{organizationId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Milestone>> getActiveMilestones(@PathVariable Long organizationId) {
        List<Milestone> milestones = milestoneService.getActiveMilestones(organizationId);
        return ResponseEntity.ok(milestones);
    }

    // Get next milestone for a category
    @GetMapping("/next/{category}")
    public ResponseEntity<MilestoneService.MilestoneProgress> getNextMilestone(@PathVariable String category) {
        // Get current metrics (this would typically come from a service)
        // For now, we'll return the next milestone without progress
        Optional<Milestone> nextMilestone = milestoneService.getNextMilestone(category);
        
        if (nextMilestone.isEmpty()) {
            return ResponseEntity.ok(
                MilestoneService.MilestoneProgress.builder()
                        .hasNextMilestone(false)
                        .build()
            );
        }
        
        // In a real implementation, you'd calculate actual progress
        return ResponseEntity.ok(
            MilestoneService.MilestoneProgress.builder()
                    .hasNextMilestone(true)
                    .nextMilestone(nextMilestone.get())
                    .amountProgress(java.math.BigDecimal.ZERO) // Placeholder
                    .donorProgress(0.0) // Placeholder
                    .build()
        );
    }

    // Get milestone progress for a category
    @GetMapping("/progress/{category}")
    public ResponseEntity<MilestoneService.MilestoneProgress> getMilestoneProgress(
            @PathVariable String category,
            @RequestParam(required = false) java.math.BigDecimal currentAmount,
            @RequestParam(required = false) Integer currentDonorCount) {
        
        // Use provided values or defaults
        java.math.BigDecimal amount = currentAmount != null ? currentAmount : java.math.BigDecimal.ZERO;
        Integer donorCount = currentDonorCount != null ? currentDonorCount : 0;
        
        MilestoneService.MilestoneProgress progress = milestoneService.getMilestoneProgress(category, amount, donorCount);
        return ResponseEntity.ok(progress);
    }
}
