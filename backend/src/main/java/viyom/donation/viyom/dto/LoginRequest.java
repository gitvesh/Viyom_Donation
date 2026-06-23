package viyom.donation.viyom.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class LoginRequest {
    private String email;
    private String password;
}

