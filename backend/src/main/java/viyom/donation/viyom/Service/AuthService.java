package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
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
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Exception.EmailAlreadyExistsException;
import viyom.donation.viyom.Exception.InvalidCredentialsException;
import viyom.donation.viyom.Exception.UserNotEnabledException;
import viyom.donation.viyom.Repository.AuthUserRepository;
import viyom.donation.viyom.Repository.AdminRepository;
import viyom.donation.viyom.Repository.DonorRepository;
import viyom.donation.viyom.Repository.OrganizationRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ROLE_PREFIX = "ROLE_";

    private final AuthUserRepository userRepository;
    private final AdminRepository adminRepository;
    private final DonorRepository donorRepository;
    private final OrganizationRepository organizationRepository;
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
            AuthUser savedUser = userRepository.save(user);

            // 6️⃣ Create role-specific entity
            switch (role) {
                case "ADMIN":
                    createAdminProfile(savedUser, email);
                    break;
                case "DONOR":
                    createDonorProfile(savedUser, email);
                    break;
                default:
                    createDonorProfile(savedUser, email);
                    break;
            }

            log.info("User registered successfully: {} with role: {}", email, role);

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
            // Normalize email
            String email = request.getEmail().toLowerCase().trim();
            
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            // Get user details
            AuthUser user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new InvalidCredentialsException("User not found"));

            if (!user.isEnabled()) {
                throw new UserNotEnabledException("Account is not enabled");
            }

            // Get user roles from the user's authorities (already properly prefixed in AuthUser)
            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            
            if (roles.isEmpty()) {
                log.warn("No roles found for user: {}", email);
                throw new InvalidCredentialsException("No roles assigned to user");
            }
            
            // Get the first role (should be only one in this implementation)
            String userRole = roles.get(0);
            
            // Generate JWT token with the role
            String jwt = jwtService.generateToken(user.getEmail(), userRole);

            log.info("User logged in successfully: {} with role: {}", user.getEmail(), userRole);
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
    public Admin findAdminByAuthUser(AuthUser authUser) {
        if (authUser == null) {
            throw new IllegalArgumentException("AuthUser cannot be null.");
        }
        return adminRepository.findByAuthUser(authUser)
                .orElseThrow(() -> new RuntimeException("Admin profile not found for user: " + authUser.getEmail()));
    }

    @Transactional(readOnly = true)
    public AuthUser getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void createAdminProfile(AuthUser savedUser, String email) {
        // Check if Admin profile already exists
        if (adminRepository.findByAuthUser(savedUser).isPresent()) {
            log.warn("Admin profile already exists for user: {}", email);
            return;
        }

        // Create or find default organization
        Organization defaultOrg = organizationRepository.findById(1L)
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setName("Default Organization");
                    return organizationRepository.save(org);
                });

        Admin admin = new Admin();
        admin.setAuthUser(savedUser);                     // 🔥 mandatory FK
        admin.setFullName(email);                         // temp default
        admin.setEmail(email);
        admin.setPhoneNumber("NA");
        admin.setPasswordHash("MANAGED_BY_AUTH_USER");      // password managed by AuthUser
        admin.setRole("ROLE_ADMIN");                      // Ensure ROLE_ prefix for consistency
        admin.setActive(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setOrganization(defaultOrg);                // set default org

        adminRepository.save(admin);
        log.info("Admin profile created for user: {}", email);
    }

    private void createDonorProfile(AuthUser savedUser, String email) {
        // Check if Donor profile already exists
        if (donorRepository.findByAuthUser(savedUser).isPresent()) {
            log.warn("Donor profile already exists for user: {}", email);
            return;
        }

        Donor donor = new Donor();
        donor.setAuthUser(savedUser);                     // 🔥 mandatory FK
        donor.setFullName(email);                         // temp default
        donor.setEmail(email);
        donor.setPhoneNumber("NA");
        donor.setPanNumber("TEMP-PAN-" + savedUser.getId());
        donor.setAnonymous(false);
        donor.setActive(true);
        donor.setCreatedAt(LocalDateTime.now());

        donorRepository.save(donor);
        log.info("Donor profile created for user: {}", email);
    }
}
