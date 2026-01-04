package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Service.PaymentService;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public CreatePaymentOrderResponse createOrder(
            @RequestBody CreatePaymentOrderRequest request,
            @AuthenticationPrincipal Donor donor
    ) throws Exception {
        return paymentService.createOrder(request, donor);
    }
}
