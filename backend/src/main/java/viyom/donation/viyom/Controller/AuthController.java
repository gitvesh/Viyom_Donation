package viyom.donation.viyom.Controller;



import org.springframework.web.bind.annotation.*;

import viyom.donation.viyom.Service.AuthService;
import viyom.donation.viyom.dto.JwtResponse;
import viyom.donation.viyom.dto.LoginRequest;
import viyom.donation.viyom.dto.RegisterRequest;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

     @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }
}
