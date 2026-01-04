package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import viyom.donation.viyom.Entity.PaymentOrder;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByRazorpayOrderId(String razorpayOrderId);
}
