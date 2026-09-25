package tech.abhiram.loompay.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.enums.PaymentStatus;
import tech.abhiram.loompay.repository.PaymentOrderRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReconciliationService {

    private final PaymentOrderRepository paymentOrderRepository;

    /**
     * Runs every 60 seconds (60000 ms).
     * Finds orders stuck in 'PROCESSING' for more than 5 minutes and auto-resolves them.
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void reconcileStuckPayments() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(5);
        List<PaymentOrder> stuckOrders = paymentOrderRepository.findByStatusAndCreatedAtBefore(
                PaymentStatus.PROCESSING, cutoffTime);

        if (stuckOrders.isEmpty()) {
            return;
        }

        log.info("Found {} stuck PROCESSING payments to reconcile", stuckOrders.size());

        for (PaymentOrder order : stuckOrders) {
            // In production, we query the upstream bank/gateway: GET /charges/{order.getOrderId()}
            // If the bank confirms timeout/no-charge, mark as FAILED to release holds safely:
            log.warn("Reconciling stuck order: {}. Marking as FAILED due to timeout.", order.getOrderId());
            order.setStatus(PaymentStatus.FAILED);
            paymentOrderRepository.save(order);
        }
    }
}
