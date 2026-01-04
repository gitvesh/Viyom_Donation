package viyom.donation.viyom.Exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ErrorResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String exception;
    private Map<String, Object> details = new HashMap<>();
    private String[] trace;

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public void addDetail(String key, Object value) {
        if (value != null) {
            this.details.put(key, value);
        }
    }
    
    public void setTrace(StackTraceElement[] stackTrace) {
        if (stackTrace != null) {
            this.trace = Arrays.stream(stackTrace)
                .map(StackTraceElement::toString)
                .toArray(String[]::new);
        }
    }

    public static ErrorResponse createDefaultErrorResponse(String message, String path) {
        return new ErrorResponse(
            LocalDateTime.now(),
            500,
            "Internal Server Error",
            message,
            path
        );
    }
}
