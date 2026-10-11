package tech.abhiram.loompay.service;

import tech.abhiram.loompay.dto.CreatePaymentRequest;
import tech.abhiram.loompay.dto.PaymentResponse;

/**
 * Core interface for payment lifecycle operations (DIP & ISP).
 */
public interface PaymentService {

    /**
     * Atomically creates and authorizes a payment order with idempotency protection,
     * distributed locking, double-entry ledger recording, and transactional outbox publishing.
     *
     * @param request the create payment payload
     * @return the authorized payment response
     */
    PaymentResponse createPayment(CreatePaymentRequest request);

    /**
     * Retrieves an existing payment order by its unique public order ID.
     *
     * @param orderId public order ID
     * @return the payment response
     */
    PaymentResponse getPaymentByOrderId(String orderId);
}
