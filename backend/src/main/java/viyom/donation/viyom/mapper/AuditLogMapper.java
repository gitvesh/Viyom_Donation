package viyom.donation.viyom.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import viyom.donation.viyom.Entity.AuditLog;
import viyom.donation.viyom.dto.AuditLogResponse;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring", imports = DateTimeFormatter.class)
public interface AuditLogMapper {
    AuditLogMapper INSTANCE = Mappers.getMapper(AuditLogMapper.class);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "action", source = "action")
    @Mapping(target = "details", expression = "java(getAuditLogDetails(auditLog))")
    @Mapping(target = "performedBy", expression = "java(String.valueOf(auditLog.getAdminId()))")
    @Mapping(target = "performedAt", expression = "java(auditLog.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME))")
    AuditLogResponse toDto(AuditLog auditLog);
    
    default String getAuditLogDetails(AuditLog auditLog) {
        return String.format("Amount: %s, Beneficiary ID: %s, Pool ID: %s", 
                auditLog.getAmount(), 
                auditLog.getBeneficiaryId(), 
                auditLog.getPoolId());
    }
}
