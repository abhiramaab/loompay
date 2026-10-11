package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.abhiram.loompay.dto.CreatePaymentRequest;
import tech.abhiram.loompay.dto.PaymentResponse;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.repository.PaymentOrderRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Production implementation of PaymentService adhering strictly to SOLID principles:
 * - SRP: Orchestrates workflow; delegates locking, idempotency, ledgering, and event publishing to dedicated services.
 * - DIP: Injects domain abstractions and Spring Data repository interfaces.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final IdempotencyService idempotencyService;
    private final PaymentOrderRepository paymentOrderRepository;
    private final DistributedLockService distributedLockService;
    private final LedgerService ledgerService;
    private final PaymentEventPublisher paymentEventPublisher;

    @Override
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        // Fast-path: Check idempotency key before acquiring lock
        Optional<PaymentOrder> existing = idempotencyService.findByIdempotencyKey(request.getIdempotencyKey());
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        String lockKey = "lock:payment:" + request.getIdempotencyKey();
        String lockValue = UUID.randomUUID().toString();

        boolean acquired = distributedLockService.acquireLock(lockKey, lockValue, 5);
        if (!acquired) {
            throw new RuntimeException("Payment is currently being processed. Please wait.");
        }

        try {
            // Re-check idempotency key under lock to eliminate race conditions
            existing = idempotencyService.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                return mapToResponse(existing.get());
            }

            // 1. Create and persist PaymentOrder
            PaymentOrder order = new PaymentOrder();
            order.setOrderId("ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
            order.setMerchantId(request.getMerchantId());
            order.setAmount(request.getAmount());
            order.setCurrency(request.getCurrency());
            order.setIdempotencyKey(request.getIdempotencyKey());

            PaymentOrder savedOrder = paymentOrderRepository.save(order);

            // 2. Double-Entry Bookkeeping Ledger (Debit Customer, Credit Merchant)
            if (ledgerService != null) {
                ledgerService.recordDoubleEntry(
                        savedOrder.getOrderId(),
                        savedOrder.getMerchantId(),
                        savedOrder.getAmount(),
                        savedOrder.getCurrency()
                );
            }

            // 3. Transactional Outbox Event Publishing (Decoupled & SRP)
            if (paymentEventPublisher != null) {
                paymentEventPublisher.publishPaymentCreated(savedOrder);
            }

            return mapToResponse(savedOrder);
        } finally {
            distributedLockService.releaseLock(lockKey, lockValue);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(String orderId) {
        PaymentOrder order = paymentOrderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment order not found with id : " + orderId));
        return mapToResponse(order);
    }

    private PaymentResponse mapToResponse(PaymentOrder order) {
        PaymentResponse response = new PaymentResponse();
        response.setMerchantId(order.getMerchantId());
        response.setAmount(order.getAmount());
        response.setCurrency(order.getCurrency());
        response.setOrderId(order.getOrderId());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        return response;
    }
}
