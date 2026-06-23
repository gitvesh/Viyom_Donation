package viyom.donation.viyom.dto;


import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FundAllocationRequest {
    private Long poolId;
    private Long beneficiaryId;
    private BigDecimal amount;
    private String purpose;
}

