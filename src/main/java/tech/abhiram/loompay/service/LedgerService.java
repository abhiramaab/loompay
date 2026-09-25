package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.dto.LedgerEntryRequest;
import tech.abhiram.loompay.entity.LedgerEntry;
import tech.abhiram.loompay.repository.LedgerEntryRepository;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;

    public void recordEntry(LedgerEntryRequest request){
        LedgerEntry entry = new LedgerEntry();
        entry.setPaymentOrderId(request.getOrderId());
        entry.setAccount(request.getAccount());
        entry.setAmount(request.getAmount());
        entry.setCurrency(request.getCurrency());
        entry.setEntryType(request.getEntryType());

        ledgerEntryRepository.save(entry);
    }
}
