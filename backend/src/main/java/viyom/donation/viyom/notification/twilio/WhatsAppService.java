package viyom.donation.viyom.notification.twilio;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Collections;

@Service
@Slf4j
public class WhatsAppService {

    @Value("${twilio.whatsapp.from}")
    private String fromNumber;

    /**
     * Sends a rich free-form WhatsApp message, optionally with media (PDF/Images).
     * 
     * @param toPhone Donor's phone number (+91...)
     * @param messageBody The full text of the message (Marathi/English)
     * @param mediaUrl Optional public URL to a PDF/Image (e.g. ngrok or S3)
     * @return Message SID or null if error occur
     */
    public String sendWhatsApp(String toPhone, String messageBody, String mediaUrl) {
        try {
            if (fromNumber == null || fromNumber.isEmpty()) {
                log.error("❌ Twilio 'from' number is not configured");
                return null;
            }

            // Standardize phone format
            String cleanTo = toPhone.trim();
            if (cleanTo.length() == 10) cleanTo = "+91" + cleanTo;
            else if (!cleanTo.startsWith("+")) cleanTo = "+" + cleanTo;

            String formattedTo = "whatsapp:" + cleanTo;
            String formattedFrom = "whatsapp:" + (fromNumber.startsWith("whatsapp:") ? fromNumber.split(":")[1] : fromNumber);

            log.info("📧 Sending WhatsApp Message to: {}", formattedTo);

            com.twilio.rest.api.v2010.account.MessageCreator creator = Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(formattedFrom),
                    messageBody
            );

            // Attach media if URL provided
            if (mediaUrl != null && !mediaUrl.trim().isEmpty()) {
                creator.setMediaUrl(Collections.singletonList(URI.create(mediaUrl)));
            }

            Message message = creator.create();
            String sid = message.getSid();
            log.info("✅ WhatsApp message sent! SID: {} | To: {}", sid, toPhone);
            return sid;

        } catch (com.twilio.exception.ApiException e) {
            log.error("❌ Twilio API Error [{}]: {} | Donor Phone: {}", e.getCode(), e.getMessage(), toPhone);
            return null;
        } catch (Exception e) {
            log.error("❌ General failure in WhatsApp Service for {}: {}", toPhone, e.getMessage());
            return null;
        }
    }
}
