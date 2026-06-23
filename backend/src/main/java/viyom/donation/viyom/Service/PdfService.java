package viyom.donation.viyom.Service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class PdfService {

    private static final String STORAGE_DIR = "storage/pdfs";

    /**
     * Converts HTML content into a PDF document and saves it locally.
     * 
     * @param htmlContent The HTML string to convert
     * @return The absolute file path to the generated PDF
     */
    public String generateInvoicePdf(String htmlContent) {
        String fileName = "donation_invoice_" + UUID.randomUUID().toString() + ".pdf";
        File storagePath = new File(STORAGE_DIR);
        
        if (!storagePath.exists()) {
            storagePath.mkdirs();
        }

        File pdfFile = new File(storagePath, fileName);
        String absolutePath = pdfFile.getAbsolutePath();

        try (OutputStream os = new FileOutputStream(pdfFile)) {
            log.info("📄 Generating PDF from HTML at: {}", absolutePath);

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(os);
            builder.run();

            log.info("✅ PDF successfully generated and saved to: {}", absolutePath);
            return absolutePath;

        } catch (Exception e) {
            log.error("❌ Failed to generate PDF: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Generates a PDF and returns it as a byte array for immediate use (e.g. email attachments).
     * 
     * @param htmlContent The HTML string to convert
     * @return Byte array of the PDF content
     */
    public byte[] generatePdfBytes(String htmlContent) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(os);
            builder.run();

            return os.toByteArray();
        } catch (Exception e) {
            log.error("❌ Failed to generate PDF bytes: {}", e.getMessage());
            return null;
        }
    }
}
