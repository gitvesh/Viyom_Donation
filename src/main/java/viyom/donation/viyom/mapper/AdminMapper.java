package viyom.donation.viyom.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import viyom.donation.viyom.Entity.Admin;
import viyom.donation.viyom.dto.AdminResponse;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    @Mapping(target = "organizationId", source = "organization.organizationId")
    @Mapping(target = "organizationName", source = "organization.name")
    @Mapping(target = "isActive", source = "active")
    AdminResponse toDto(Admin admin);
}
