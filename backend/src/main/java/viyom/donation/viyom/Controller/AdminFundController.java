package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Service.AdminAllocationService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/funds")
@RequiredArgsConstructor
public class AdminFundController {

    private final AdminAllocationService allocationService;

    @GetMapping("/pools")
    public List<DonationPool> pools() {
        return allocationService.getAllPools();
    }

    @GetMapping("/allocations/{poolId}")
    public List<FundAllocation> allocations(@PathVariable Long poolId) {
        return allocationService.getPoolAllocations(poolId);
    }
}

