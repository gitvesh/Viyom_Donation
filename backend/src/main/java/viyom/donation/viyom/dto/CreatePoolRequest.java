package viyom.donation.viyom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePoolRequest {
    private Long sectorId;
    private Long organizationId;
}
