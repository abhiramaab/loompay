package tech.abhiram.loompay.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import tech.abhiram.loompay.enums.Currency;

@Data
public class CreatePaymentRequest {

    private String merchantId;
    private Long amount;
    private Currency currency;
    private String idempotencyKey;


}
