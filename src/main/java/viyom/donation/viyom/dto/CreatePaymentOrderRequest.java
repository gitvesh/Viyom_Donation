package viyom.donation.viyom.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
public class CreatePaymentOrderRequest {
    private Long sectorId;
    private BigDecimal amount;
}
