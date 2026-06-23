package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Donation;
import viyom.donation.viyom.Entity.Donor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(Donor donor);

    Optional<Donation> findByPaymentOrder_RazorpayOrderId(String razorpayOrderId);
    
    // Find donations by category (via sector name)
    @Query("SELECT d FROM Donation d WHERE d.donationPool.sector.name = :category")
    List<Donation> findByDonationPool_Sector_Name(@Param("category") String category);
    
    // Find donations with NULL blockchainTxnHash (failed blockchain transactions)
    List<Donation> findByBlockchainTxnHashNull();
    
    // Find donations with NULL blockchainTxnHash before specified time
    List<Donation> findByBlockchainTxnHashNullAndDonatedAtBefore(LocalDateTime dateTime);
    
    // Find donations with NULL blockchainTxnHash after specified time
    List<Donation> findByBlockchainTxnHashNullAndDonatedAtAfter(LocalDateTime dateTime);
    
    // Count donations with NULL blockchainTxnHash
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.blockchainTxnHash IS NULL")
    long countByBlockchainTxnHashNull();
    
    // Count donations with NULL blockchainTxnHash after specified time
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.blockchainTxnHash IS NULL AND d.donatedAt >= :dateTime")
    long countByBlockchainTxnHashNullAndDonatedAtAfter(@Param("dateTime") LocalDateTime dateTime);
}
