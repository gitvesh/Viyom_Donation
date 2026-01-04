package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import viyom.donation.viyom.Entity.DonationPool;

import java.util.Optional;

public interface DonationPoolRepository extends JpaRepository<DonationPool, Long> {

    Optional<DonationPool> findBySector_SectorIdAndActiveTrue(Long sectorId);
}
