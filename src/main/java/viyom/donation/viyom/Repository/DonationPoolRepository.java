package viyom.donation.viyom.Repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.DonationPool;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationPoolRepository extends JpaRepository<DonationPool, Long> {

    Optional<DonationPool> findBySector_SectorIdAndActiveTrue(Long sectorId);

    Optional<DonationPool> findByPoolCode(String poolCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<DonationPool> findWithLockingByPoolId(Long poolId);

    List<DonationPool> findByActiveTrue();
}
