package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.PaymentOrder;
import viyom.donation.viyom.Service.PaymentService;
import viyom.donation.viyom.Service.AuthService;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    @PostMapping("/create-order")
    public CreatePaymentOrderResponse createOrder(
            @RequestBody CreatePaymentOrderRequest request,
            @AuthenticationPrincipal AuthUser authUser
    ) throws Exception {
        authService.findDonorByAuthUser(authUser);
        PaymentOrder order = paymentService.createOrder(
            request.getAmount(),
            "INR",
            "receipt_" + System.currentTimeMillis(),
            authUser,
            request.getPoolId(),
            request.getAnonymous()
        );
        
        return CreatePaymentOrderResponse.builder()
                .razorpayOrderId(order.getRazorpayOrderId())
                .currency(order.getCurrency())
                .amount(order.getAmount().toPlainString())
                .build();
    }
}
