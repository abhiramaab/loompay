package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.repository.PaymentOrderRepository;

import java.util.Optional;

/**
 * Verifies transaction uniqueness and prevents duplicate payment processing.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>SRP (Single Responsibility Principle):</strong> Dedicated strictly to idempotency key validation
 *       and historical order lookup, isolating duplicate-request protection from payment execution logic.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Relies on the {@link PaymentOrderRepository} abstraction
 *       injected via constructor.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final PaymentOrderRepository paymentOrderRepository;

    public Optional<PaymentOrder> findByIdempotencyKey(String idempotencyKey){
        return paymentOrderRepository.findByIdempotencyKey(idempotencyKey);
    }
}
