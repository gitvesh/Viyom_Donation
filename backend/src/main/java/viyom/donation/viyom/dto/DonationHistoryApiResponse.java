package viyom.donation.viyom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Clean API response for donation history
 * Includes blockchain verification URLs
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationHistoryApiResponse {
    private Long donationId;
    private BigDecimal amount;
    private String category;
    private LocalDateTime timestamp;
    private String blockchainTxnHash;
    private BlockchainVerification blockchainVerification;
    
    /**
     * Blockchain verification information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockchainVerification {
        private boolean verified;
        private String explorerUrl;
        private String verificationApi;
        private String status;
        
        /**
         * Get verification status text
         */
        public String getStatusText() {
            if (!verified) {
                return "Not Recorded";
            }
            return "Verified on Blockchain";
        }
        
        /**
         * Get explorer display text
         */
        public String getExplorerText() {
            if (!verified || explorerUrl == null) {
                return "Not Available";
            }
            return "View on PolygonScan";
        }
    }
}
