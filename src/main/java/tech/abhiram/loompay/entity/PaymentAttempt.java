package tech.abhiram.loompay.entity;

import jakarta.persistence.*;
import lombok.Data;
import tech.abhiram.loompay.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Table
@Data
public class PaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_order_id")
    private PaymentOrder paymentOrder;

    @Column(nullable = false)
    private Integer attemptedNumber;

    @Column(nullable = false)
    private String provide;

    private String provider;

    @Column(nullable = false)
    private String providerTransactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false)
    private String failureReasoon;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


}
