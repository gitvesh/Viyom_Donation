package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Beneficiary;
import viyom.donation.viyom.Entity.Role;
import viyom.donation.viyom.Repository.BeneficiaryRepository;
import viyom.donation.viyom.Repository.AuthUserRepository;
import viyom.donation.viyom.Exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AuthUserRepository authUserRepository;

    // Add beneficiary (admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public Beneficiary addBeneficiary(Beneficiary beneficiary, Long adminId) {
        log.info("Adding new beneficiary: {}", beneficiary.getName());
        beneficiary.setCreatedAt(LocalDateTime.now());
        beneficiary.setActive(true);
        return beneficiaryRepository.save(beneficiary);
    }

    // Get all beneficiaries
    public Page<Beneficiary> getAllBeneficiaries(Pageable pageable) {
        return beneficiaryRepository.findAll(pageable);
    }

    // Get beneficiary by ID
    public Beneficiary getBeneficiaryById(Long id) {
        return beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
    }

    // Deactivate beneficiary (admin only)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public void deactivateBeneficiary(Long id) {
        Beneficiary beneficiary = getBeneficiaryById(id);
        beneficiary.setActive(false);
        beneficiaryRepository.save(beneficiary);
        log.info("Deactivated beneficiary: {}", id);
    }
}
