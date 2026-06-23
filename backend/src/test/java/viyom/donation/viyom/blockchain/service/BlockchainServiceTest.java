package viyom.donation.viyom.blockchain.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.test.util.ReflectionTestUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import viyom.donation.viyom.blockchain.contract.DonationTransparency;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BlockchainServiceTest {

    @Mock
    private Web3j web3j;
    @Mock
    private DonationTransparency contract;

    private BlockchainService blockchainService;

    @BeforeEach
    void setUp() {
        // Use a valid 40-char hex address to satisfy BlockchainService's parameter contract
        blockchainService = new BlockchainService(
                web3j,
                null,
                null,
                "0x1234567890123456789012345678901234567890",
                true,
                contract
        );
    }

    @Test
    @SuppressWarnings("unchecked")
    void recordDonationOnBlockchain_Success() throws Exception {
        // Given
        String donorEmail = "test@example.com";
        BigDecimal amount = new BigDecimal("0.1");
        String category = "Education";
        String orderId = "ORDER_123";
        Long timestamp = 1710000000L;

        TransactionReceipt receipt = new TransactionReceipt();
        receipt.setStatus("0x1");
        receipt.setTransactionHash("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890");

        // Suppress unchecked conversion – Mockito raw type limitation with generic RemoteFunctionCall
        RemoteFunctionCall<TransactionReceipt> remoteCall = mock(RemoteFunctionCall.class);
        when(remoteCall.send()).thenReturn(receipt);

        when(contract.recordDonation(any(), any(BigInteger.class), anyString(), anyString(), any(BigInteger.class)))
                .thenReturn(remoteCall);

        // When
        // When
        CompletableFuture<BlockchainService.BlockchainResult> future = blockchainService.recordDonationOnBlockchain(
                donorEmail, amount, category, orderId, timestamp
        );

        // Then
        BlockchainService.BlockchainResult result = future.get();
        assertNotNull(result, "Transaction result should not be null.");
        assertTrue(result.isSuccess(), "Transaction should be marked successful.");
        assertEquals("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", result.getTransactionHash());
        verify(contract, atLeastOnce()).recordDonation(
                any(), any(BigInteger.class), eq(category), eq(orderId), any(BigInteger.class));
    }

    @Test
    @SuppressWarnings("unchecked")
    void recordDonationOnBlockchain_Failure_ReceiptStatus() throws Exception {
        // Given – contract reverted (status 0x0)
        TransactionReceipt receipt = new TransactionReceipt();
        receipt.setStatus("0x0");

        RemoteFunctionCall<TransactionReceipt> remoteCall = mock(RemoteFunctionCall.class);
        when(remoteCall.send()).thenReturn(receipt);

        when(contract.recordDonation(any(), any(BigInteger.class), any(), any(), any(BigInteger.class)))
                .thenReturn(remoteCall);

        // When
        CompletableFuture<BlockchainService.BlockchainResult> future = blockchainService.recordDonationOnBlockchain(
                "test@test.com", BigDecimal.ONE, "Cat", "ORD", 123456L
        );

        // Then 
        BlockchainService.BlockchainResult result = future.get();
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }

    @Test
    void recordDonationOnBlockchain_Disabled() throws Exception {
        // Given – force-disable transactions via reflection
        ReflectionTestUtils.setField(blockchainService, "transactionEnabled", false);

        // When
        CompletableFuture<BlockchainService.BlockchainResult> future = blockchainService.recordDonationOnBlockchain(
                "test@test.com", BigDecimal.ONE, "Cat", "ORD", 123456L
        );

        // Then – should return exception result immediately without calling the contract at all
        BlockchainService.BlockchainResult result = future.get();
        assertNotNull(result);
        assertFalse(result.isSuccess());
        verify(contract, never()).recordDonation(any(), any(), any(), any(), any());
    }
}
