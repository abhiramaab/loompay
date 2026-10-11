package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.abhiram.loompay.dto.LedgerEntryRequest;
import tech.abhiram.loompay.entity.LedgerEntry;
import tech.abhiram.loompay.enums.Currency;
import tech.abhiram.loompay.enums.EntryType;
import tech.abhiram.loompay.repository.LedgerEntryRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;

    public void recordEntry(LedgerEntryRequest request) {
        LedgerEntry entry = new LedgerEntry();
        entry.setPaymentOrderId(request.getOrderId());
        entry.setAccount(request.getAccount());
        entry.setAmount(request.getAmount());
        entry.setCurrency(request.getCurrency());
        entry.setEntryType(request.getEntryType());

        ledgerEntryRepository.save(entry);
    }

    /**
     * Atomically records a balanced double-entry ledger pair (debit customer, credit merchant)
     * enforcing financial balance consistency (SRP & ACID invariant).
     */
    @Transactional
    public void recordDoubleEntry(String orderId, String merchantId, Long amount, Currency currency) {
        // 1. DEBIT customer account
        LedgerEntry debit = new LedgerEntry();
        debit.setPaymentOrderId(orderId);
        debit.setAccount("CUSTOMER:" + orderId);
        debit.setEntryType(EntryType.DEBIT);
        debit.setAmount(amount);
        debit.setCurrency(currency);
        ledgerEntryRepository.save(debit);

        // 2. CREDIT merchant account
        LedgerEntry credit = new LedgerEntry();
        credit.setPaymentOrderId(orderId);
        credit.setAccount("MERCHANT:" + merchantId);
        credit.setEntryType(EntryType.CREDIT);
        credit.setAmount(amount);
        credit.setCurrency(currency);
        ledgerEntryRepository.save(credit);

        log.debug("Recorded balanced double-entry ledger for order: {} [debit={}, credit={}]", orderId, amount, amount);
    }
}
