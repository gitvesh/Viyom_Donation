package com.viyom.notification.twilio;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class TwilioConfig {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @PostConstruct
    public void setupTwilio() {
        if (accountSid != null && !accountSid.trim().isEmpty() && authToken != null && !authToken.trim().isEmpty()) {
            Twilio.init(accountSid, authToken);
            log.info("✅ Twilio SDK successfully globally initialized");
        } else {
            log.warn("⚠️ Twilio credentials missing in application.properties. Twilio SDK not initialized.");
        }
    }
}
