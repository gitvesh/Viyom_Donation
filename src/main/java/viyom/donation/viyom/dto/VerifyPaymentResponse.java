package viyom.donation.viyom.dto;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyPaymentResponse {
    private String status;
    private Long donationId;
}
