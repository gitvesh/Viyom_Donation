package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.Entity.AuthUser;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByAuthUser(AuthUser authUser);
    Optional<Admin> findByAuthUser_Id(Long authUserId);
    Optional<Admin> findByEmail(String email);
}
