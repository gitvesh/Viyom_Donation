package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viyom.donation.viyom.Entity.FundAllocation;
import viyom.donation.viyom.Service.BeneficiaryLedgerService;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiary")
@RequiredArgsConstructor
public class BeneficiaryLedgerController {

    private final BeneficiaryLedgerService ledgerService;

    @GetMapping("/{beneficiaryId}/funds")
    public List<FundAllocation> getFunds(@PathVariable Long beneficiaryId) {
        return ledgerService.getBeneficiaryLedger(beneficiaryId);
    }
}
