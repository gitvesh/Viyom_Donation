package viyom.donation.viyom.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Repository.FundAllocationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryLedgerService {

    private final FundAllocationRepository allocationRepository;

    public List<FundAllocation> getBeneficiaryLedger(Long beneficiaryId) {
        return allocationRepository.findByBeneficiary_BeneficiaryId(beneficiaryId);
    }
}

