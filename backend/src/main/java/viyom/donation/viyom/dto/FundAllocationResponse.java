package viyom.donation.viyom.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FundAllocationResponse {
    private Long allocationId;
    private String poolCode;
    private String beneficiaryName;
    private BigDecimal allocatedAmount;
    private BigDecimal remainingBalance;
    private LocalDateTime allocatedAt;
}
