package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Notification;
import viyom.donation.viyom.Service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Get notifications for current donor
    @GetMapping("/my-notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal AuthUser authUser
    ) {
        List<Notification> notifications = notificationService.getNotificationsForDonor(authUser.getDonor());
        return ResponseEntity.ok(notifications);
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}
