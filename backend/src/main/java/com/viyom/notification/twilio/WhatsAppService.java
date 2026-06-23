package com.viyom.notification.twilio;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class WhatsAppService {

    @Value("${twilio.whatsapp.from}")
    private String fromNumber;

    private static final String DONATION_TEMPLATE_SID = "HXb5b62575e6e4ff6129ad7c8efe1f983e";

    /**
     * Sends a template-based WhatsApp message using Twilio Content SID.
     * 
     * @param donorPhone Receiver's phone number
     * @param donorName Placeholder {{1}} for the template
     * @param amount Placeholder {{2}} for the template
     * @return Message SID or null if error occur
     */
    public String sendDonationMessage(String donorPhone, String donorName, String amount) {
        try {
            if (fromNumber == null || fromNumber.isEmpty()) {
                log.error("❌ Twilio 'from' number is not configured");
                return null;
            }

            // Phone formatting
            String cleanPhone = donorPhone.trim();
            if (cleanPhone.length() == 10 && !cleanPhone.startsWith("+")) {
                cleanPhone = "+91" + cleanPhone;
            } else if (!cleanPhone.startsWith("+")) {
                cleanPhone = "+" + cleanPhone;
            }

            String formattedTo = "whatsapp:" + cleanPhone;
            String formattedFrom = "whatsapp:" + (fromNumber.startsWith("whatsapp:") ? fromNumber.split(":")[1] : fromNumber);

            log.info("📧 Sending WhatsApp Template to: {} | SID: {}", formattedTo, DONATION_TEMPLATE_SID);

            // Correct JSON for Template variables as per Twilio spec: {"1":"Value1","2":"Value2"}
            String contentVariables = String.format("{\"1\":\"%s\",\"2\":\"%s\"}", donorName, amount);

            Message message = Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(formattedFrom),
                    "" // Body must be empty when using contentSid
            )
            .setContentSid(DONATION_TEMPLATE_SID)
            .setContentVariables(contentVariables)
            .create();

            String sid = message.getSid();
            log.info("✅ WhatsApp Template message sent successfully! SID: {} | To: {}", sid, donorPhone);
            return sid;

        } catch (com.twilio.exception.ApiException e) {
            log.error("❌ Twilio API Error [{}]: {} | Donor Phone: {}", e.getCode(), e.getMessage(), donorPhone);
            return null;
        } catch (Exception e) {
            log.error("❌ General failure in WhatsApp Service for {}: {}", donorPhone, e.getMessage());
            return null;
        }
    }
}
