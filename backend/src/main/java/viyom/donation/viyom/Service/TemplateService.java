package viyom.donation.viyom.Service;

import viyom.donation.viyom.Entity.Donation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class TemplateService {

    private static final String TEMPLATE_PATH = "templates/donation-template.html";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    /**
     * Loads the donation template, replaces placeholders with actual donation data,
     * and returns the final HTML string.
     * 
     * @param donation The donation entity containing the data
     * @return Formatted HTML content
     */
    public String generateDonationTemplate(Donation donation) {
        try {
            log.info("📄 Generating HTML template for donation ID: {}", donation.getDonationId());

            // 1. Load HTML template from resources/templates/
            ClassPathResource resource = new ClassPathResource(TEMPLATE_PATH);
            String template;
            try (InputStream inputStream = resource.getInputStream()) {
                template = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            }

            // 2. Prepare dynamic values
            String donorName = donation.getAnonymous() ? "Anonymous Donor" : donation.getDonor().getFullName();
            String amount = donation.getAmount().toString();
            String date = donation.getDonatedAt().format(DATE_FORMATTER);
            String orderId = (donation.getPaymentOrder() != null) ? 
                             donation.getPaymentOrder().getRazorpayOrderId() : "N/A";

            // 3. Replace dynamic values and Generate final HTML string
            String finalHtml = template
                    .replace("[[donorName]]", donorName)
                    .replace("[[amount]]", amount)
                    .replace("[[date]]", date)
                    .replace("[[orderId]]", orderId);

            log.info("✅ Successfully generated HTML template for order: {}", orderId);
            return finalHtml;

        } catch (Exception e) {
            log.error("❌ Failed to generate donation template: {}", e.getMessage());
            return "Error generating template: " + e.getMessage();
        }
    }
}
