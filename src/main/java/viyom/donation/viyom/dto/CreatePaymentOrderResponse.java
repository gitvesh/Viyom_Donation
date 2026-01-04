package viyom.donation.viyom.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class CreatePaymentOrderResponse {
    private String razorpayOrderId;
    private String currency;
    private String amount;
}
