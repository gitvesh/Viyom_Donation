package viyom.donation.viyom.Service;

import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Repository.DonorRepository;

@Service
public class DonarService {

    private final DonorRepository donorRepository;

    public DonarService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor findByAuthUser(AuthUser authUser) {
        return donorRepository.findByAuthUser(authUser).orElseThrow(() -> new RuntimeException("Donor not found"));
    }
}
