package tech.abhiram.loompay.service;

import tech.abhiram.loompay.entity.PaymentOrder;

/**
 * Single responsibility interface for dispatching payment events (SRP & DIP).
 */
public interface PaymentEventPublisher {

    /**
     * Publishes a payment creation event to the outbox pipeline.
     *
     * @param order the persisted payment order
     */
    void publishPaymentCreated(PaymentOrder order);
}
