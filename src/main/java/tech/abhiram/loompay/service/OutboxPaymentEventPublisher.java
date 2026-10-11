package tech.abhiram.loompay.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.entity.OutboxEvent;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.repository.OutboxEventRepository;

import java.util.Map;

/**
 * Transactional Outbox implementation of PaymentEventPublisher (SRP & OCP).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPaymentEventPublisher implements PaymentEventPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void publishPaymentCreated(PaymentOrder order) {
        String payload;
        try {
            payload = objectMapper.writeValueAsString(Map.of(
                    "orderId", order.getOrderId(),
                    "merchantId", order.getMerchantId(),
                    "amount", order.getAmount(),
                    "currency", order.getCurrency() != null ? order.getCurrency().name() : "INR",
                    "status", order.getStatus() != null ? order.getStatus().name() : "CREATED"
            ));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize outbox event payload for order: {}", order.getOrderId(), e);
            payload = String.format("{\"orderId\":\"%s\",\"merchantId\":\"%s\",\"amount\":%d}",
                    order.getOrderId(), order.getMerchantId(), order.getAmount());
        }

        OutboxEvent outboxEvent = OutboxEvent.builder()
                .eventType("PAYMENT_CREATED")
                .aggregateId(order.getOrderId())
                .payload(payload)
                .status("PENDING")
                .build();

        outboxEventRepository.save(outboxEvent);
        log.debug("Enqueued outbox event for order: {}", order.getOrderId());
    }
}
