package viyom.donation.viyom.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AllocationResponse {
    private Long allocationId;
    private String beneficiary;
    private BigDecimal amount;
    private LocalDateTime allocationDate;
    private String purpose;
    private String allocationTxnHash;
    private String blockchainStatus;
    private String poolCode;
}
