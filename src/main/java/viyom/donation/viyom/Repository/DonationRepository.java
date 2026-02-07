package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Donation;
import viyom.donation.viyom.Entity.Donor;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(Donor donor);

    Optional<Donation> findByPaymentOrder_RazorpayOrderId(String razorpayOrderId);
    
    // Find donations by category (via sector name)
    @Query("SELECT d FROM Donation d WHERE d.donationPool.sector.name = :category")
    List<Donation> findByDonationPool_Sector_Name(@Param("category") String category);
}
