package tech.abhiram.loompay.service;

import tech.abhiram.loompay.dto.CreatePaymentRequest;
import tech.abhiram.loompay.dto.PaymentResponse;

/**
 * Core interface for payment lifecycle operations.
 *
 * <p><strong>SOLID Principles Applied:</strong></p>
 * <ul>
 *   <li><strong>ISP (Interface Segregation Principle):</strong> Client-focused service boundary isolating payment order creation
 *       and inquiry from internal persistence, locking, or settlement mechanics.</li>
 *   <li><strong>DIP (Dependency Inversion Principle):</strong> Presentation layers (controllers) depend on this contract rather
 *       than concrete domain orchestrators.</li>
 * </ul>
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
