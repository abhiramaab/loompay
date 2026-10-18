package tech.abhiram.loompay.service;

import tech.abhiram.loompay.entity.PaymentOrder;

/**
 * Single responsibility interface for dispatching payment events.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>ISP (Interface Segregation Principle):</strong> Lean, specialized contract focused exclusively on event emission.</li>
 *   <li><strong>OCP (Open/Closed Principle):</strong> Allows swapping event dispatch mechanisms (Transactional Outbox, Kafka,
 *       RabbitMQ, Webhooks) without altering transaction processing pipelines.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Decouples {@link PaymentService} from messaging infrastructure.</li>
 * </ul>
 */
public interface PaymentEventPublisher {

    /**
     * Publishes a payment creation event to the outbox pipeline.
     *
     * @param order the persisted payment order
     */
    void publishPaymentCreated(PaymentOrder order);
}
