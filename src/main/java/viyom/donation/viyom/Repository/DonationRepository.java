package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import viyom.donation.viyom.Entity.Donation;
import viyom.donation.viyom.Entity.Donor;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(Donor donor);



    Optional<Donation> findByPaymentOrder_RazorpayOrderId(String razorpayOrderId);
}
