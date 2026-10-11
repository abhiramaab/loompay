package tech.abhiram.loompay;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.abhiram.loompay.dto.CreatePaymentRequest;
import tech.abhiram.loompay.dto.PaymentResponse;
import tech.abhiram.loompay.entity.PaymentOrder;
import tech.abhiram.loompay.enums.Currency;
import tech.abhiram.loompay.enums.PaymentStatus;
import tech.abhiram.loompay.repository.PaymentOrderRepository;
import tech.abhiram.loompay.service.DistributedLockService;
import tech.abhiram.loompay.service.IdempotencyService;
import tech.abhiram.loompay.service.LedgerService;
import tech.abhiram.loompay.service.PaymentEventPublisher;
import tech.abhiram.loompay.service.PaymentServiceImpl;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private IdempotencyService idempotencyService;

    @Mock
    private PaymentOrderRepository paymentOrderRepository;

    @Mock
    private DistributedLockService distributedLockService;

    @Mock
    private LedgerService ledgerService;

    @Mock
    private PaymentEventPublisher paymentEventPublisher;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private CreatePaymentRequest request;

    @BeforeEach
    void setUp() {
        request = new CreatePaymentRequest();
        request.setMerchantId("merch_001");
        request.setAmount(50000L);
        request.setCurrency(Currency.INR);
        request.setIdempotencyKey("idemp_unique_123");
    }

    @Test
    @DisplayName("1. Concurrency Block: Rejects duplicate request when lock is already occupied")
    void shouldBlockConcurrentPayment_WhenLockIsOccupied() {
        when(idempotencyService.findByIdempotencyKey("idemp_unique_123")).thenReturn(Optional.empty());
        when(distributedLockService.acquireLock(any(), any(), anyLong())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> paymentService.createPayment(request));

        verify(paymentOrderRepository, never()).save(any());
        verify(ledgerService, never()).recordDoubleEntry(any(), any(), any(), any());
        verify(paymentEventPublisher, never()).publishPaymentCreated(any());
    }

    @Test
    @DisplayName("2. Idempotency Fast-Path: Returns existing order without acquiring lock")
    void shouldReturnExistingPaymen_WhenAlreadyInDatabase() {
        PaymentOrder existingOrder = new PaymentOrder();
        existingOrder.setOrderId("ord_existing_999");
        existingOrder.setMerchantId("merch_001");
        existingOrder.setAmount(50000L);
        existingOrder.setCurrency(Currency.INR);
        existingOrder.setStatus(PaymentStatus.CREATED);

        when(idempotencyService.findByIdempotencyKey("idemp_unique_123")).thenReturn(Optional.empty());
        when(distributedLockService.acquireLock(any(), any(), anyLong())).thenReturn(true);

        PaymentOrder savedOrder = new PaymentOrder();
        savedOrder.setOrderId("ord_new_888");
        savedOrder.setMerchantId("merch_001");
        savedOrder.setAmount(50000L);
        savedOrder.setCurrency(Currency.INR);
        savedOrder.setStatus(PaymentStatus.CREATED);
        savedOrder.setCreatedAt(LocalDateTime.now());

        when(paymentOrderRepository.save(any(PaymentOrder.class))).thenReturn(savedOrder);

        PaymentResponse response = paymentService.createPayment(request);

        assertNotNull(response);
        assertEquals("ord_new_888", response.getOrderId());

        verify(distributedLockService, times(1)).releaseLock(any(), any());
        verify(ledgerService, times(1)).recordDoubleEntry(eq("ord_new_888"), eq("merch_001"), eq(50000L), eq(Currency.INR));
        verify(paymentEventPublisher, times(1)).publishPaymentCreated(savedOrder);
    }
}
