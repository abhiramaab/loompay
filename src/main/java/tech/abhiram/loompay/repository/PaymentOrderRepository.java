package tech.abhiram.loompay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.abhiram.loompay.entity.PaymentOrder;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByOrderId(String orderId);
    Optional<PaymentOrder> findByIdempotencyKey(String idempotencyKey);
}
