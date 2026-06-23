package viyom.donation.viyom.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private List<String> roles;
}

