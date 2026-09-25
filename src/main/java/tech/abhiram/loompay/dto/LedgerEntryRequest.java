package tech.abhiram.loompay.dto;

import lombok.Data;
import tech.abhiram.loompay.enums.Currency;
import tech.abhiram.loompay.enums.EntryType;

@Data
public class LedgerEntryRequest {

    private String orderId;
    private String account;
    private EntryType entryType;
    private Long amount;
    private Currency currency;
}
