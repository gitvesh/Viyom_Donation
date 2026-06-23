package viyom.donation.viyom.blockchain.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Service.FundAllocationService;

import java.math.BigDecimal;

/**
 * Dedicated service for asynchronous blockchain operations related to fund allocation.
 * This ensures that @Async proxying works correctly (avoiding self-invocation issues).
 */
@Service
@Slf4j
public class AllocationBlockchainAsyncService {

    private final BlockchainService blockchainService;
    private final FundAllocationService fundAllocationService;

    public AllocationBlockchainAsyncService(BlockchainService blockchainService, @Lazy FundAllocationService fundAllocationService) {
        this.blockchainService = blockchainService;
        this.fundAllocationService = fundAllocationService;
    }

    /**
     * Records the allocation on the blockchain and updates the database status.
     */
    @Async
    public void recordAllocationOnBlockchainAsync(Long allocationId, String beneficiary, BigDecimal amount, Long timestamp) {
        log.info("🌐 [ASYNC] Initiating blockchain recording for allocation {}", allocationId);

        blockchainService.recordAllocationOnBlockchain(allocationId, beneficiary, amount, timestamp)
            .thenAccept(result -> {
                if (result != null && result.getTransactionHash() != null) {
                    if (result.isSuccess()) {
                        log.info("✅ [ASYNC] Blockchain recording SUCCESS for allocation {}. TxHash: {}", allocationId, result.getTransactionHash());
                    } else {
                        log.warn("⚠️ [ASYNC] Blockchain recording REVERTED for allocation {}. TxHash: {}", allocationId, result.getTransactionHash());
                    }
                    fundAllocationService.updateAllocationBlockchainStatus(allocationId, result);
                } else {
                    log.error("❌ [ASYNC] Blockchain recording FAILED (no hash) for allocation {}", allocationId);
                    fundAllocationService.updateAllocationBlockchainStatus(allocationId, result);
                }
            })
            .exceptionally(throwable -> {
                log.error("💥 [ASYNC] CRITICAL EXCEPTION during blockchain recording for allocation {}: {}", 
                        allocationId, throwable.getMessage(), throwable);
                fundAllocationService.updateAllocationBlockchainStatus(allocationId, (BlockchainService.BlockchainResult) null);
                return null;
            });
    }
}
