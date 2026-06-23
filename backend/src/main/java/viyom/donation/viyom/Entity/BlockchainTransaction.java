package viyom.donation.viyom.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blockchainTransactionId;

    @Column(nullable = false, unique = true)
    private String transactionHash;

    @Column(nullable = false)
    private String transactionType; 
    // DONATION / FUND_ALLOCATION

    @Column(nullable = false)
    private String referenceEntity; 
    // Donation / FundAllocation

    @Column(nullable = false)
    private Long referenceEntityId;

    @Column(nullable = false)
    private String blockchainNetwork; 
    // Ethereum / Hyperledger / Testnet

    @Column(nullable = false)
    private LocalDateTime recordedAt;
}

