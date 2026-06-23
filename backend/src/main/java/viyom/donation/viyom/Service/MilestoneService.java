package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Milestone;
import viyom.donation.viyom.Repository.MilestoneRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    /**
     * Check and update milestones for a given category based on current metrics
     * 
     * @param category The category to check (e.g., EDUCATION, HEALTHCARE)
     * @param currentAmount Current total amount for the category
     * @param currentDonorCount Current donor count for the category
     * @return List of newly achieved milestones
     */
    @Transactional
    public List<Milestone> checkAndUpdateMilestones(String category, BigDecimal currentAmount, Integer currentDonorCount) {
        log.debug("Checking milestones for category: {}, amount: {}, donors: {}", category, currentAmount, currentDonorCount);
        
        List<Milestone> activeMilestones = milestoneRepository.findActiveMilestonesByCategory(category);
        List<Milestone> newlyAchievedMilestones = new java.util.ArrayList<>();
        
        for (Milestone milestone : activeMilestones) {
            if (isMilestoneAchieved(milestone, currentAmount, currentDonorCount)) {
                // Mark milestone as achieved
                milestone.setAchieved(true);
                milestone.setAchievedAt(LocalDateTime.now());
                milestone.setUpdatedAt(LocalDateTime.now());
                
                milestoneRepository.save(milestone);
                newlyAchievedMilestones.add(milestone);
                
                log.info("Milestone achieved: {} in category {}", milestone.getTitle(), category);
            }
        }
        
        return newlyAchievedMilestones;
    }

    /**
     * Check if a milestone is achieved based on amount and donor count criteria
     * Both criteria must be met for milestone to be considered achieved
     */
    private boolean isMilestoneAchieved(Milestone milestone, BigDecimal currentAmount, Integer currentDonorCount) {
        boolean amountAchieved = currentAmount.compareTo(milestone.getTargetAmount()) >= 0;
        boolean donorCountAchieved = currentDonorCount >= milestone.getTargetDonorCount();
        
        return amountAchieved && donorCountAchieved;
    }

    /**
     * Get next milestone for a category
     */
    public Optional<Milestone> getNextMilestone(String category) {
        return milestoneRepository.findNextMilestoneByCategory(category);
    }

    /**
     * Get all active milestones for an organization
     */
    public List<Milestone> getActiveMilestones(Long organizationId) {
        List<Milestone> allMilestones = milestoneRepository.findByOrganizationOrganizationId(organizationId);
        return allMilestones.stream()
                .filter(m -> !m.getAchieved())
                .toList();
    }

    /**
     * Create a new milestone
     */
    @Transactional
    public Milestone createMilestone(Milestone milestone) {
        milestone.setCreatedAt(LocalDateTime.now());
        milestone.setUpdatedAt(LocalDateTime.now());
        milestone.setAchieved(false);
        
        return milestoneRepository.save(milestone);
    }

    /**
     * Get current progress towards next milestone for a category
     */
    public MilestoneProgress getMilestoneProgress(String category, BigDecimal currentAmount, Integer currentDonorCount) {
        Optional<Milestone> nextMilestoneOpt = getNextMilestone(category);
        
        if (nextMilestoneOpt.isEmpty()) {
            return MilestoneProgress.builder()
                    .hasNextMilestone(false)
                    .build();
        }
        
        Milestone nextMilestone = nextMilestoneOpt.get();
        BigDecimal amountProgress = currentAmount.divide(nextMilestone.getTargetAmount(), 2, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        double donorProgress = (double) currentDonorCount / nextMilestone.getTargetDonorCount() * 100;
        
        return MilestoneProgress.builder()
                .hasNextMilestone(true)
                .nextMilestone(nextMilestone)
                .amountProgress(amountProgress)
                .donorProgress(donorProgress)
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class MilestoneProgress {
        private boolean hasNextMilestone;
        private Milestone nextMilestone;
        private BigDecimal amountProgress;
        private Double donorProgress;
    }
}
