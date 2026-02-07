package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Repository.DonationPoolRepository;
import viyom.donation.viyom.Exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PoolService {

    private final DonationPoolRepository donationPoolRepository;

    // Get all donation pools
    public Page<DonationPool> getAllPools(Pageable pageable) {
        return donationPoolRepository.findAll(pageable);
    }

    // Get pool by ID
    public DonationPool getPoolById(Long id) {
        return donationPoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pool not found with id: " + id));
    }

    // Get active pools
    public List<DonationPool> getActivePools() {
        return donationPoolRepository.findByActiveTrue();
    }

    // Update pool balance (internal use)
    @Transactional
    public DonationPool updatePoolBalance(Long poolId, java.math.BigDecimal newBalance) {
        DonationPool pool = getPoolById(poolId);
        pool.setAvailableBalance(newBalance);
        return donationPoolRepository.save(pool);
    }
}
