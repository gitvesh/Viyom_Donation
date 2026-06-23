package viyom.donation.viyom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationHistoryResponse {
    private Long donationId;
    private BigDecimal amount;
    private LocalDateTime donatedAt;
    private Boolean anonymous;
    private String blockchainTxnHash;
    private String blockchainStatus;
    private String status; // Payment status
    private String razorpayOrderId;
    private String razorpayPaymentId;
    
    // Donor information
    private String donorName;
    private String donorEmail;
    
    // Pool information
    private Long poolId;
    private String poolName;
    
    // Sector information
    private Long sectorId;
    private String sectorName;
}
