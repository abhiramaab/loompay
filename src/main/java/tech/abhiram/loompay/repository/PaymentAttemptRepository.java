package tech.abhiram.loompay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.abhiram.loompay.entity.PaymentAttempt;
import tech.abhiram.loompay.entity.PaymentOrder;

import java.util.List;
import java.util.Optional;

public interface PaymentAttemptRepository extends JpaRepository<PaymentAttempt, Long> {

    List<PaymentAttempt> findByPaymentOrder(PaymentOrder paymentOrder);

    Optional<PaymentAttempt> findByProviderTransactionId(String providerTransactionId);
}
