package viyom.donation.viyom.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    /**
     * Root endpoint - required for Render's default health check (probes '/')
     * Full URL with context-path: GET /viyom/
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Viyom Donation Backend");
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }

    /**
     * Detailed health check endpoint.
     * Full URL with context-path: GET /viyom/api/health
     */
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Viyom Donation Backend");
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }

    /**
     * Simple ping endpoint.
     * Full URL with context-path: GET /viyom/api/ping
     */
    @GetMapping("/api/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
