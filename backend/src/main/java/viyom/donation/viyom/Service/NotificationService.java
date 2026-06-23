package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.Milestone;
import viyom.donation.viyom.Entity.Notification;
import viyom.donation.viyom.Repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Send milestone achievement notifications to all donors in the category
     * This method is asynchronous and won't block the main donation flow
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sendMilestoneNotifications(List<Milestone> achievedMilestones, List<Donor> donorsInCategory) {
        log.info("Sending milestone notifications for {} milestones to {} donors", 
                 achievedMilestones.size(), donorsInCategory.size());
        
        for (Milestone milestone : achievedMilestones) {
            String message = buildMilestoneMessage(milestone);
            
            for (Donor donor : donorsInCategory) {
                try {
                    Notification notification = Notification.builder()
                            .channel("EMAIL")
                            .message(message)
                            .status("SENT")
                            .sentAt(LocalDateTime.now())
                            .donor(donor)
                            .build();
                    
                    notificationRepository.save(notification);
                    log.debug("Sent milestone notification to donor: {} for milestone: {}", 
                             donor.getEmail(), milestone.getTitle());
                    
                } catch (Exception e) {
                    log.error("Failed to send notification to donor: {} for milestone: {}", 
                              donor.getEmail(), milestone.getTitle(), e);
                    
                    // Log failed notification
                    Notification failedNotification = Notification.builder()
                            .channel("EMAIL")
                            .message(message)
                            .status("FAILED")
                            .sentAt(LocalDateTime.now())
                            .donor(donor)
                            .build();
                    
                    notificationRepository.save(failedNotification);
                }
            }
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Build personalized milestone notification message
     */
    private String buildMilestoneMessage(Milestone milestone) {
        return String.format(
                "🎉 Exciting News! We've achieved a major milestone together!\n\n" +
                "Milestone: %s\n" +
                "Category: %s\n" +
                "Achieved on: %s\n\n" +
                "Thank you for being part of this incredible journey. Your contribution has helped us reach " +
                "this important goal. Together, we're making a real difference!\n\n" +
                "Stay tuned for more updates on our collective impact.\n\n" +
                "With gratitude,\n" +
                "The Viyom Team",
                milestone.getTitle(),
                milestone.getCategory(),
                milestone.getAchievedAt().toLocalDate()
        );
    }

    /**
     * Get notification history for a donor
     */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForDonor(Donor donor) {
        return notificationRepository.findByDonorOrderBySentAtDesc(donor);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        
        // In a real implementation, you might add a 'read' field to the entity
        // For now, we'll just log it
        log.info("Notification marked as read: {}", notificationId);
    }
}
