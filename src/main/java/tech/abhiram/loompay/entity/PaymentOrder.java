package tech.abhiram.loompay.entity;

import jakarta.persistence.*;
import lombok.Data;
import tech.abhiram.loompay.enums.Currency;
import tech.abhiram.loompay.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Table
@Data
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String merchantId;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    @Version
    private Long version;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void OnCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null){
            this.status = PaymentStatus.CREATED;
        }
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }

    public void transitionTo(PaymentStatus nextStatus){
        if(!this.status.canTransitionTo(nextStatus)) {
            throw new RuntimeException("Illegal transition from " + this.status + "to " + nextStatus);

        }
        this.status = nextStatus;
    }

}
