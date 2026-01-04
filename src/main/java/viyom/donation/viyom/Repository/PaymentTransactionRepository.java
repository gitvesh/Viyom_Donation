package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import viyom.donation.viyom.Entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
}
