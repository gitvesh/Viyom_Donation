package viyom.donation.viyom.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viyom.donation.viyom.Entity.AuditLog;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {
    List<AuditLog> findByAdminIdOrderByTimestampDesc(Long adminId);
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    List<AuditLog> findByPoolIdOrderByTimestampDesc(Long poolId);
    List<AuditLog> findByBeneficiaryIdOrderByTimestampDesc(Long beneficiaryId);
    
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
