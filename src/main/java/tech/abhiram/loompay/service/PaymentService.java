package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.abhiram.loompay.dto.CreatePaymentRequest;
import tech.abhiram.loompay.dto.PaymentResponse;
import tech.abhiram.loompay.entity.OutboxEvent;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.repository.OutboxEventRepository;
import tech.abhiram.loompay.repository.PaymentOrderRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final IdempotencyService idempotencyService;
    private final PaymentOrderRepository paymentOrderRepository;
    private final DistributedLockService distributedLockService;
    private final OutboxEventRepository outboxEventRepository;

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        Optional<PaymentOrder> existing = idempotencyService.findByIdempotencyKey(request.getIdempotencyKey());
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        String lockKey = "lock:payment:" + request.getIdempotencyKey();
        String lockValue = UUID.randomUUID().toString();

        boolean acquired = distributedLockService.aquireLock(lockKey, lockValue, 5);
        if (!acquired) {
            throw new RuntimeException("Payment is currently being processed. Please wait.");
        }

        try {
            existing = idempotencyService.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                return mapToResponse(existing.get());
            }

        PaymentOrder order = new PaymentOrder();
        order.setOrderId("ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        order.setMerchantId(request.getMerchantId());
        order.setAmount(request.getAmount());
        order.setCurrency(request.getCurrency());
        order.setIdempotencyKey(request.getIdempotencyKey());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventType("PAYMENT_CREATED")
                    .aggregateId(savedOrder.getOrderId())
                    .payload(String.format("{\"orderId\":\"%s\",\"merchantId\":\"%s\"amount\":%s}",
                            savedOrder.getOrderId(), savedOrder.getMerchantId(), savedOrder.getAmount()))
                    .status("PENDING")
                    .build();
            outboxEventRepository.save(outboxEvent);

            return mapToResponse(savedOrder);
    } finally

    {
        distributedLockService.releaseLock(lockKey, lockValue);
    }
}
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(String orderId) {
        PaymentOrder order = paymentOrderRepository.findByOrderId(orderId).orElseThrow(() -> new RuntimeException("Payment order not found with id : " + orderId));
        return mapToResponse(order);
    }


    private PaymentResponse mapToResponse(PaymentOrder order){
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
