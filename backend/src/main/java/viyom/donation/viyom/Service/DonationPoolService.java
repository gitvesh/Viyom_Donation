package viyom.donation.viyom.Service;

import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Repository.DonationPoolRepository;

@Service
public class DonationPoolService {

    private final DonationPoolRepository donationPoolRepository;

    public DonationPoolService(DonationPoolRepository donationPoolRepository) {
        this.donationPoolRepository = donationPoolRepository;
    }

    public DonationPool findById(Long id) {
        return donationPoolRepository.findById(id).orElseThrow(() -> new RuntimeException("DonationPool not found"));
    }
}
