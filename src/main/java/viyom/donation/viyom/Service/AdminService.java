package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Organization;
import viyom.donation.viyom.Entity.Role;
import viyom.donation.viyom.Exception.ResourceNotFoundException;
import viyom.donation.viyom.Repository.AdminRepository;
import viyom.donation.viyom.Repository.AuthUserRepository;
import viyom.donation.viyom.Repository.OrganizationRepository;
import viyom.donation.viyom.dto.AdminResponse;
import viyom.donation.viyom.dto.CreateAdminRequest;
import viyom.donation.viyom.mapper.AdminMapper;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final AuthUserRepository authUserRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminMapper adminMapper;

    @Transactional
    public AdminResponse createAdmin(CreateAdminRequest request) {
        // Check if email already exists
        if (authUserRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already in use");
        }

        // Create AuthUser
        AuthUser authUser = new AuthUser();
        authUser.setEmail(request.getEmail());
        authUser.setPassword(passwordEncoder.encode(request.getPassword()));
        authUser.setRole(Role.ROLE_ADMIN.name());
        authUser.setEnabled(true);
        authUser = authUserRepository.save(authUser);

        // Get or create default organization
        Organization organization = organizationRepository.findById(1L)
                .orElseGet(() -> organizationRepository.save(Organization.builder()
                        .name("Default Organization")
                        .build()));

        // Create Admin
        Admin admin = new Admin();
        admin.setFullName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhoneNumber(request.getPhone());
        admin.setOrganization(organization);
        admin.setAuthUser(authUser);
        admin = adminRepository.save(admin);

        return adminMapper.toDto(admin);
    }

    public AdminResponse getAdminById(Long id) {
        return adminRepository.findById(id)
                .map(adminMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
    }

    public Page<AdminResponse> getAllAdmins(Pageable pageable) {
        return adminRepository.findAll(pageable)
                .map(adminMapper::toDto);
    }

    @Transactional
    public AdminResponse updateAdmin(Long id, CreateAdminRequest request) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        admin.setFullName(request.getName());
        admin.setPhoneNumber(request.getPhone());
        
        // Update email in both Admin and AuthUser if changed
        if (!admin.getEmail().equals(request.getEmail())) {
            if (authUserRepository.existsByEmail(request.getEmail())) {
                throw new IllegalStateException("Email already in use");
            }
            admin.setEmail(request.getEmail());
            
            AuthUser authUser = admin.getAuthUser();
            authUser.setEmail(request.getEmail());
            authUserRepository.save(authUser);
        }
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            AuthUser authUser = admin.getAuthUser();
            authUser.setPassword(passwordEncoder.encode(request.getPassword()));
            authUserRepository.save(authUser);
        }

        return adminMapper.toDto(adminRepository.save(admin));
    }

    @Transactional
    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
        
        // Soft delete by deactivating the auth user
        AuthUser authUser = admin.getAuthUser();
        authUser.setEnabled(false);
        authUserRepository.save(authUser);
        
        // Optionally, you can also deactivate the admin
        admin.setActive(false);
        adminRepository.save(admin);
    }
}
