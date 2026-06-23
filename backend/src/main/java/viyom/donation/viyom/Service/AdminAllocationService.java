package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Repository.DonationPoolRepository;
import viyom.donation.viyom.Repository.FundAllocationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAllocationService {

    private final DonationPoolRepository poolRepository;
    private final FundAllocationRepository allocationRepository;

    public List<DonationPool> getAllPools() {
        return poolRepository.findAll();
    }

    public List<FundAllocation> getPoolAllocations(Long poolId) {
        return allocationRepository.findByDonationPool_PoolId(poolId);
    }
}

