package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tech.abhiram.loompay.entity.OutboxEvent;
import tech.abhiram.loompay.repository.OutboxEventRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private static final int BATCH_SIZE = 50;
    private static final int MAX_RETRIES = 3;

    @Scheduled(fixedDelay = 5000)
    public void publishPendingEvents() {
        PageRequest pageRequest = PageRequest.of(0, BATCH_SIZE, Sort.by("createdAt").ascending());
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatus("PENDING", pageRequest);

        if (pendingEvents.isEmpty()) {
            return;
        }

        log.info("Found {} pending outbox events to publish", pendingEvents.size());

        for (OutboxEvent event : pendingEvents) {
            processEvent(event);
        }
    }

    private void processEvent(OutboxEvent event) {
        try {
            sendToExternalSystem(event);

            event.setStatus("PROCESSED");
            event.setProcessedAt(LocalDateTime.now());
            outboxEventRepository.save(event);

            log.info("Successfully published outbox event ID: {} for aggregate: {}",
                    event.getId(), event.getAggregateId());
        } catch (Exception ex) {
            log.error("Failed to publish outbox event ID: {}. Error: {}", event.getId(), ex.getMessage());

            event.setRetryCount(event.getRetryCount() + 1);

            if (event.getRetryCount() >= MAX_RETRIES) {
                event.setStatus("FAILED");
                log.error("Event ID: {} exceeded max retries. Marked as FAILED", event.getId());
            }
            outboxEventRepository.save(event);
        }
    }

    private void sendToExternalSystem(OutboxEvent event) {
        log.info("DISPATCHING [{}] event to network: {}", event.getEventType(), event.getPayload());
    }
}
