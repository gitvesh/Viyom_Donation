package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Service.DonationService;
import viyom.donation.viyom.Service.AuthService;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.dto.VerifyPaymentRequest;
import viyom.donation.viyom.dto.VerifyPaymentResponse;
import viyom.donation.viyom.Entity.Donation;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;
    private final AuthService authService;

    @PostMapping("/create-order")
    public ResponseEntity<CreatePaymentOrderResponse> createOrder(
            @RequestBody CreatePaymentOrderRequest request,
            @AuthenticationPrincipal AuthUser authUser
    ) throws Exception {
        Donor donor = authService.findDonorByAuthUser(authUser);
        CreatePaymentOrderResponse response = donationService.createOrder(request, donor);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(@RequestBody VerifyPaymentRequest request) throws Exception {
        VerifyPaymentResponse response = donationService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-donations")
    public ResponseEntity<List<Donation>> getMyDonations(@AuthenticationPrincipal AuthUser authUser) {
        Donor donor = authService.findDonorByAuthUser(authUser);
        List<Donation> donations = donationService.getDonationsForDonor(donor);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/admin/donations")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Donation>> getAllDonations() {
        List<Donation> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }
}

