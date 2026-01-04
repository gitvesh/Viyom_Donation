package viyom.donation.viyom.Service;

import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.Donation;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.PaymentOrder;
import viyom.donation.viyom.Repository.DonationRepository;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.dto.VerifyPaymentRequest;
import viyom.donation.viyom.dto.VerifyPaymentResponse;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final PaymentService paymentService;
    private final AuthService authService;

    public CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, Donor donor) throws RazorpayException {
        PaymentOrder order = paymentService.createOrder(request.getAmount(), "INR", "receipt_" + System.currentTimeMillis(), authService.getCurrentUser(), request.getSectorId());

        return CreatePaymentOrderResponse.builder()
                .razorpayOrderId(order.getRazorpayOrderId())
                .currency(order.getCurrency())
                .amount(order.getAmount().toPlainString())
                .build();
    }

    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) throws RazorpayException, NoSuchAlgorithmException, InvalidKeyException {
        boolean isValid = paymentService.verifyPaymentSignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        if (isValid) {
            Donation donation = donationRepository.findByPaymentOrder_RazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Donation not found for this order"));

            return VerifyPaymentResponse.builder()
                    .status("SUCCESS")
                    .donationId(donation.getDonationId())
                    .build();
        }

        return VerifyPaymentResponse.builder().status("FAILED").build();
    }

    public List<Donation> getDonationsForDonor(Donor donor) {
        return donationRepository.findByDonor(donor);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}
