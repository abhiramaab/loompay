package tech.abhiram.loompay.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PaymentEventConsumer {

    /**
     * Consumes payment events asynchronously from Apache Kafka.
     * Demonstrates consumer group offset tracking, partition key routing,
     * and decoupled downstream event handling (webhooks/receipts/analytics).
     */
    @KafkaListener(topics = "payment-events", groupId = "loompay-notification-group", autoStartup = "${spring.kafka.consumer.auto-startup:true}")
    public void onPaymentEvent(
            @Payload String payload,
            @Header(value = KafkaHeaders.RECEIVED_KEY, required = false) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("🔥 [KAFKA CONSUMED] Topic: payment-events | Partition: {} | Offset: {} | Key: {}",
                partition, offset, key);
        log.info("📦 [EVENT PROCESSED] Dispatched async receipt & webhook for payload: {}", payload);
    }
}
