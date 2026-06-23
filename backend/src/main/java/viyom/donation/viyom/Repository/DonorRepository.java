package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Donor;

import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByAuthUser(AuthUser authUser);
    Optional<Donor> findByAuthUser_Id(Long authUserId);
    boolean existsByAuthUser(AuthUser authUser);
}
