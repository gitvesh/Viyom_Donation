package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.Milestone;

import java.util.List;
import java.util.Optional;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    
    // Find active (not achieved) milestones by category
    @Query("SELECT m FROM Milestone m WHERE m.category = :category AND m.achieved = false ORDER BY m.targetAmount ASC")
    List<Milestone> findActiveMilestonesByCategory(@Param("category") String category);
    
    // Find all milestones by organization
    List<Milestone> findByOrganizationOrganizationId(Long organizationId);
    
    // Find next milestone for a category
    @Query("SELECT m FROM Milestone m WHERE m.category = :category AND m.achieved = false ORDER BY m.targetAmount ASC LIMIT 1")
    Optional<Milestone> findNextMilestoneByCategory(@Param("category") String category);
    
    // Find achieved milestones
    List<Milestone> findByAchievedTrue();
}
