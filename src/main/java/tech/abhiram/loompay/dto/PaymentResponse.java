package tech.abhiram.loompay.dto;

import lombok.Data;
import tech.abhiram.loompay.enums.Currency;
import tech.abhiram.loompay.enums.PaymentStatus;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {

    private String orderId;
    private String merchantId;
    private Long amount;
    private Currency currency;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
