package viyom.donation.viyom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundAllocateRequest {
    @NotNull(message = "Pool ID is required")
    private Long poolId;
    
    @NotNull(message = "Beneficiary ID is required")
    private Long beneficiaryId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    private String purpose;
}
