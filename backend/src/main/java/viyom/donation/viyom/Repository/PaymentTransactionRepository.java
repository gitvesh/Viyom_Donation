package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.PaymentTransaction;

import viyom.donation.viyom.Entity.PaymentOrder;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByPaymentOrder(PaymentOrder paymentOrder);
}
