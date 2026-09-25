package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.repository.PaymentOrderRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final PaymentOrderRepository paymentOrderRepository;

    public Optional<PaymentOrder> findByIdempotencyKey(String idempotencyKey){
        return paymentOrderRepository.findByIdempotencyKey(idempotencyKey);
    }
}
