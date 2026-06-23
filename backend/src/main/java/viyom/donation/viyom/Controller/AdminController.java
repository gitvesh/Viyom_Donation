package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.Service.AdminService;
import viyom.donation.viyom.dto.AdminResponse;
import viyom.donation.viyom.dto.CreateAdminRequest;

@RestController
@RequestMapping("/api/admin/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> createAdmin(@RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(adminService.createAdmin(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminResponse>> getAllAdmins(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAdmins(pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> updateAdmin(
            @PathVariable Long id,
            @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(adminService.updateAdmin(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
