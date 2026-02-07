package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Repository.AdminRepository;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Service.FundAllocationService;
import viyom.donation.viyom.Service.AuthService;
import viyom.donation.viyom.Repository.OrganizationRepository;
import viyom.donation.viyom.dto.FundAllocationRequest;
import viyom.donation.viyom.Exception.OrganizationNotFoundException;
import viyom.donation.viyom.Exception.BeneficiaryNotFoundException;
import viyom.donation.viyom.Exception.InsufficientFundsException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class FundAllocationController {

    private final FundAllocationService fundAllocationService;
    private final AuthService authService;
    private final OrganizationRepository organizationRepository;
    private final AdminRepository adminRepository;

    @PostMapping("/fund-allocate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> allocateFunds(@RequestBody FundAllocationRequest request) {
        // Get authenticated user's email from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Fetch admin by email
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Admin not found for email: {}", email);
                    return new RuntimeException("Admin account not found. Please ensure you have proper admin access.");
                });
        
        // Log the admin performing the action
        log.info("Processing fund allocation by admin: {} (ID: {})", admin.getEmail(), admin.getAdminId());

        // Validate admin has organization
        if (admin.getOrganization() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Admin not associated with organization",
                "message", "Admin profile must be linked to an organization to allocate funds"
            ));
        }

        log.info("Fund allocation request by admin {}: poolId={}, beneficiaryId={}, amount={}", 
                admin.getAdminId(), request.getPoolId(), request.getBeneficiaryId(), request.getAmount());
        
        try {
            FundAllocation allocation = fundAllocationService.createFundAllocation(request, admin);
            return ResponseEntity.ok(allocation);
        } catch (OrganizationNotFoundException e) {
            log.error("Organization not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Organization not found",
                "message", e.getMessage()
            ));
        } catch (BeneficiaryNotFoundException e) {
            log.error("Beneficiary not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Beneficiary not found",
                "message", e.getMessage()
            ));
        } catch (InsufficientFundsException e) {
            log.error("Insufficient funds: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Insufficient funds",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Unexpected error during fund allocation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Internal server error",
                "message", "An unexpected error occurred during fund allocation"
            ));
        }
    }

    @GetMapping("/fund-allocations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FundAllocation>> getAllAllocations() {
        List<FundAllocation> allocations = fundAllocationService.getAllAllocations();
        return ResponseEntity.ok(allocations);
    }

    @GetMapping("/beneficiary/{beneficiaryId}/allocations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FundAllocation>> getAllocationsByBeneficiary(
            @PathVariable Long beneficiaryId) {
        List<FundAllocation> allocations = fundAllocationService.getAllocationsByBeneficiary(beneficiaryId);
        return ResponseEntity.ok(allocations);
    }

    @GetMapping("/pool/{poolId}/allocations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FundAllocation>> getAllocationsByPool(
            @PathVariable Long poolId) {
        List<FundAllocation> allocations = fundAllocationService.getAllocationsByDonationPool(poolId);
        return ResponseEntity.ok(allocations);
    }

    @GetMapping("/admin/{adminId}/allocations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FundAllocation>> getAllocationsByAdmin(
            @PathVariable Long adminId) {
        List<FundAllocation> allocations = fundAllocationService.getAllocationsByAdmin(adminId);
        return ResponseEntity.ok(allocations);
    }

    @GetMapping("/pool/{poolId}/balance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPoolBalance(@PathVariable Long poolId) {
        BigDecimal availableBalance = fundAllocationService.getPoolAvailableBalance(poolId);
        BigDecimal totalAllocated = fundAllocationService.getTotalAllocatedFromPool(poolId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("poolId", poolId);
        response.put("availableBalance", availableBalance);
        response.put("totalAllocatedAmount", totalAllocated);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/beneficiary/{beneficiaryId}/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getBeneficiarySummary(@PathVariable Long beneficiaryId) {
        BigDecimal totalReceived = fundAllocationService.getTotalAllocatedToBeneficiary(beneficiaryId);
        List<FundAllocation> allocations = fundAllocationService.getAllocationsByBeneficiary(beneficiaryId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("beneficiaryId", beneficiaryId);
        response.put("totalReceived", totalReceived);
        response.put("allocationCount", allocations.size());
        response.put("allocations", allocations);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ledger/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLedgerSummary() {
        List<FundAllocation> allAllocations = fundAllocationService.getAllAllocations();
        
        BigDecimal totalAllocated = allAllocations.stream()
                .map(FundAllocation::getAllocatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalAllocations", allAllocations.size());
        response.put("totalAmountAllocated", totalAllocated);
        response.put("allocations", allAllocations);
        
        return ResponseEntity.ok(response);
    }
}
