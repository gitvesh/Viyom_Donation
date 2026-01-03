package viyom.donation.viyom.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import viyom.donation.viyom.Entity.AuthUser;

import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {

    Optional<AuthUser> findByEmail(String email);

    boolean existsByEmail(String email);
}

