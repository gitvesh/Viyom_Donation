package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Sector;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    @Query("SELECT s FROM Sector s WHERE s.organization.organizationId = :organizationId")
    List<Sector> findByOrganizationId(@Param("organizationId") Long organizationId);
    
    Optional<Sector> findById(Long id);
}
