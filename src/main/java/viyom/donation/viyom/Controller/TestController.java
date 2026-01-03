package viyom.donation.viyom.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secure")
@RequiredArgsConstructor
@Tag(name = "Test", description = "Test endpoints for authentication")
public class TestController {

    @GetMapping("/test")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    @Operation(
        summary = "Test secured endpoint",
        description = "This endpoint is protected and requires a valid JWT token with either ADMIN or DONOR role"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> testSecuredEndpoint() {
        return ResponseEntity.ok("This is a secured endpoint. Your JWT token is valid!");
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Admin only endpoint",
        description = "This endpoint is only accessible to users with ADMIN role"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> adminOnlyEndpoint() {
        return ResponseEntity.ok("This is an admin-only endpoint.");
    }
}
