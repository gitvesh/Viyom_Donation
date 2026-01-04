package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import viyom.donation.viyom.Repository.DonorRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.dto.JwtResponse;
import viyom.donation.viyom.dto.LoginRequest;
import viyom.donation.viyom.dto.RegisterRequest;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Exception.EmailAlreadyExistsException;
import viyom.donation.viyom.Exception.InvalidCredentialsException;
import viyom.donation.viyom.Exception.UserNotEnabledException;
import viyom.donation.viyom.Repository.AuthUserRepository;
import viyom.donation.viyom.Entity.Donor;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ROLE_PREFIX = "ROLE_";

    private final AuthUserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public void register(RegisterRequest request) {

        // 1️⃣ Validate request
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Registration request cannot be null");
        }

        String email = request.getEmail().toLowerCase().trim();

        // 2️⃣ Check if user already exists
        if (userRepository.existsByEmail(email)) {
            log.warn("Registration attempt with existing email: {}", email);
            throw new EmailAlreadyExistsException("Email already in use");
        }

        // 3️⃣ Normalize and validate role
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "DONOR";
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }
        if (!role.equals("ADMIN") && !role.equals("DONOR")) {
            role = "DONOR";
        }

        // 4️⃣ Create AuthUser
        AuthUser user = new AuthUser();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_" + role);
        user.setEnabled(true);

        try {
            // 5️⃣ Save AuthUser
            userRepository.save(user);

            // 6️⃣ Auto-create Donor for DONOR role
            if ("DONOR".equals(role)) {

                Donor donor = new Donor();
                donor.setAuthUser(user);                     // 🔥 mandatory FK
                donor.setFullName(email);                    // temp default
                donor.setEmail(email);
                donor.setPhoneNumber("NA");
                donor.setPanNumber("TEMP-PAN-" + user.getId());
                donor.setAnonymous(false);
                donor.setActive(true);
                donor.setCreatedAt(LocalDateTime.now());

                donorRepository.save(donor);
            }

            log.info("User registered successfully: {}", email);

        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage(), e);
            throw new RuntimeException("Error registering user", e);
        }
    }


    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new InvalidCredentialsException("Email and password are required");
        }

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            // Get user details
            AuthUser user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

            if (!user.isEnabled()) {
                throw new UserNotEnabledException("Account is not enabled");
            }

            // Get user roles
            List<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            
            // Get the first role (or a default role if empty)
            String userRole = !roles.isEmpty() ? roles.get(0) : "ROLE_USER";
            
            // Generate JWT token
            String jwt = jwtService.generateToken(user.getEmail(), userRole);

            log.info("User logged in successfully: {}", user.getEmail());
            return new JwtResponse(jwt, user.getId(), user.getEmail(), roles);

        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            log.warn("Login failed for user: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        } catch (Exception e) {
            log.error("Login error for user {}: {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("Login failed. Please try again later.");
        }
    }

    @Transactional(readOnly = true)
    public Donor findDonorByAuthUser(AuthUser authUser) {
        if (authUser == null) {
            throw new IllegalArgumentException("AuthUser cannot be null.");
        }
        return donorRepository.findByAuthUser(authUser)
                .orElseThrow(() -> new RuntimeException("Donor profile not found for user: " + authUser.getEmail()));
    }

    @Transactional(readOnly = true)
    public AuthUser getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
