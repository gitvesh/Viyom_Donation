package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    // Beneficiary allocation summary
    @GetMapping("/beneficiary-summary")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReportService.BeneficiaryAllocationSummary>> getBeneficiaryAllocationSummary() {
        List<ReportService.BeneficiaryAllocationSummary> summary = reportService.getBeneficiaryAllocationSummary();
        return ResponseEntity.ok(summary);
    }

    // Ledger summary - allocation history grouped logically
    @GetMapping("/allocation-ledger")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReportService.AllocationLedgerEntry>> getAllocationLedgerSummary() {
        List<ReportService.AllocationLedgerEntry> ledger = reportService.getAllocationLedgerSummary();
        return ResponseEntity.ok(ledger);
    }

    // Pool summary
    @GetMapping("/pool-summary")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReportService.PoolSummary>> getPoolSummary() {
        List<ReportService.PoolSummary> summary = reportService.getPoolSummary();
        return ResponseEntity.ok(summary);
    }
}
