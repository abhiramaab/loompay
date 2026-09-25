package tech.abhiram.loompay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByOrderId(String orderId);
    Optional<PaymentOrder> findByIdempotencyKey(String idempotencyKey);

    List<PaymentOrder> findByStatusAndCreatedAtBefore(PaymentStatus status, LocalDateTime cutoffTime);
}

