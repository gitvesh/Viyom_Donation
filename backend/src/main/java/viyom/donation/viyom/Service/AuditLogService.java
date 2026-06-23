package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.AuditLog;
import viyom.donation.viyom.Exception.ResourceNotFoundException;
import viyom.donation.viyom.Repository.AuditLogRepository;
import viyom.donation.viyom.dto.AuditLogResponse;
import viyom.donation.viyom.mapper.AuditLogMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    public void createAuditLog(Long adminId, String action, BigDecimal amount, Long beneficiaryId, Long poolId) {
        AuditLog auditLog = AuditLog.builder()
                .adminId(adminId)
                .action(action)
                .amount(amount)
                .beneficiaryId(beneficiaryId)
                .poolId(poolId)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
        log.info("Audit log created: adminId={}, action={}, amount={}, beneficiaryId={}, poolId={}", 
                adminId, action, amount, beneficiaryId, poolId);
    }

    public void logFundAllocation(Long adminId, BigDecimal amount, Long beneficiaryId, Long poolId) {
        createAuditLog(adminId, "FUND_ALLOCATED", amount, beneficiaryId, poolId);
    }

    public void logFundAllocationReversal(Long adminId, BigDecimal amount, Long beneficiaryId, Long poolId) {
        createAuditLog(adminId, "FUND_ALLOCATION_REVERSED", amount, beneficiaryId, poolId);
    }

    public Page<AuditLogResponse> getAuditLogs(
            String action, 
            String entityType, 
            Long entityId, 
            LocalDateTime startDate, 
            LocalDateTime endDate, 
            Pageable pageable) {
        
        Specification<AuditLog> spec = Specification.where(null);
        
        if (action != null && !action.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.like(cb.lower(root.get("action")), "%" + action.toLowerCase() + "%"));
        }
        
        if (entityType != null && !entityType.isEmpty()) {
            // Assuming entityType is stored in the action or we need to add it to the AuditLog entity
            spec = spec.and((root, query, cb) -> 
                cb.like(cb.lower(root.get("action")), "%" + entityType.toLowerCase() + "%"));
        }
        
        if (entityId != null) {
            // Check both poolId and beneficiaryId
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.equal(root.get("poolId"), entityId),
                    cb.equal(root.get("beneficiaryId"), entityId)
                )
            );
        }
        
        if (startDate != null) {
            spec = spec.and((root, query, cb) -> 
                cb.greaterThanOrEqualTo(root.get("timestamp"), startDate));
        }
        
        if (endDate != null) {
            spec = spec.and((root, query, cb) -> 
                cb.lessThanOrEqualTo(root.get("timestamp"), endDate));
        }
        
        return auditLogRepository.findAll(spec, pageable)
                .map(auditLogMapper::toDto);
    }
    
    public AuditLogResponse getAuditLogById(Long id) {
        return auditLogRepository.findById(id)
                .map(auditLogMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Audit log not found with id: " + id));
    }
}
