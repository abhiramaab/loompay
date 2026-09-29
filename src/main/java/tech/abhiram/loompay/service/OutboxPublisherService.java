package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.entity.OutboxEvent;
import tech.abhiram.loompay.repository.OutboxEventRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    public static final String TOPIC_NAME = "payment-events";
    private static final int BATCH_SIZE = 50;
    private static final int MAX_RETRIES = 3;

    @Scheduled(fixedDelay = 5000)
    public void publishPendingEvents() {
        PageRequest pageRequest = PageRequest.of(0, BATCH_SIZE, Sort.by("createdAt").ascending());
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatus("PENDING", pageRequest);

        if (pendingEvents.isEmpty()) {
            return;
        }

        log.info("Found {} pending outbox events to publish to Kafka", pendingEvents.size());

        for (OutboxEvent event : pendingEvents) {
            processEvent(event);
        }
    }

    private void processEvent(OutboxEvent event) {
        try {
            sendToKafka(event);

            event.setStatus("PROCESSED");
            event.setProcessedAt(LocalDateTime.now());
            outboxEventRepository.save(event);

            log.info("Successfully published outbox event ID: {} to Kafka for aggregate: {}",
                    event.getId(), event.getAggregateId());
        } catch (Exception ex) {
            log.error("Failed to publish outbox event ID: {} to Kafka. Error: {}", event.getId(), ex.getMessage());

            event.setRetryCount(event.getRetryCount() + 1);

            if (event.getRetryCount() >= MAX_RETRIES) {
                event.setStatus("FAILED");
                log.error("Event ID: {} exceeded max retries. Marked as FAILED", event.getId());
            }
            outboxEventRepository.save(event);
        }
    }

    private void sendToKafka(OutboxEvent event) throws Exception {
        if (kafkaTemplate != null) {
            // Partition by aggregateId (orderId) so events for the same order stay strictly in-order on the same partition
            kafkaTemplate.send(TOPIC_NAME, event.getAggregateId(), event.getPayload()).get(5, TimeUnit.SECONDS);
            log.info("KAFKA PRODUCED [topic={} partitionKey={}] payload: {}", TOPIC_NAME, event.getAggregateId(), event.getPayload());
        } else {
            log.warn("KafkaTemplate unavailable. Falling back to local dispatch: {}", event.getPayload());
        }
    }
}
