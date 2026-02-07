package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find notifications for a donor ordered by sent date (newest first)
    List<Notification> findByDonorOrderBySentAtDesc(Donor donor);
    
    // Find notifications by status
    List<Notification> findByStatus(String status);
    
    // Find notifications by channel
    List<Notification> findByChannel(String channel);
}
