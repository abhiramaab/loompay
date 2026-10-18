# LoomPay — SOLID Principles & Low-Level Design (LLD)

This document provides a comprehensive technical breakdown of how the **SOLID** object-oriented design principles are implemented across the LoomPay distributed payment architecture.

---

## Architecture Overview

```text
       POST /api/v1/payments
                │
                ▼
      ┌────────────────────┐
      │  PaymentController │ ──── (DIP: depends on PaymentService interface)
      └────────────────────┘
                │
                ▼
      ┌────────────────────┐
      │ PaymentServiceImpl │ ──── (SRP: orchestrates transaction lifecycle)
      └────────────────────┘
        │      │      │     │
        │      │      │     └──► OutboxPaymentEventPublisher (ISP/DIP: event publishing)
        │      │      │
        │      │      └────────► LedgerService (SRP: double-entry audit balance)
        │      │
        │      └───────────────► DistributedLockService (SRP/DIP: mutex lease management)
        │
        └──────────────────────► IdempotencyService (SRP: duplicate prevention)
```

---

## 1. Single Responsibility Principle (SRP)
> *"A class should have one, and only one, reason to change."*

In LoomPay, each service and domain class has a single, well-defined axis of change:

| Component | Class / Interface | Single Responsibility | Reason to Change |
|---|---|---|---|
| **Payment Orchestrator** | `PaymentServiceImpl` | Coordinates the checkout state machine (idempotency check -> lock -> order creation -> double-entry ledger -> transactional outbox). | Business checkout workflow changes. |
| **Distributed Locking** | `DistributedLockService` | Acquires and releases distributed Redis mutex locks using atomic compare-and-delete tokens. | Mutex acquisition, lease TTL, or lock contention logic changes. |
| **Idempotency Guard** | `IdempotencyService` | Validates client idempotency keys against previous orders to prevent duplicate charges. | Deduplication key generation or lookup strategy changes. |
| **Double-Entry Ledger** | `LedgerService` | Enforces double-entry financial accounting invariants ($\sum \text{Debits} = \sum \text{Credits}$). | Financial accounting rules or journal schema changes. |
| **Event Publisher** | `OutboxPaymentEventPublisher` | Serializes domain events into the transactional outbox table within the same ACID boundary. | Event payload serialization or outbox table structure changes. |
| **Rate Limiter** | `RateLimiterService` | Enforces sliding-window request rate limits per merchant tenant. | Throttling algorithms, quotas, or window interval changes. |
| **Hash Ring** | `ConsistentHashRouter` | Maps merchant IDs and transaction keys to worker nodes via MD5 consistent hashing. | Hash ring virtual node distribution or ring topology changes. |

---

## 2. Open/Closed Principle (OCP)
> *"Software entities should be open for extension, but closed for modification."*

LoomPay leverages polymorphic abstractions to enable extending platform features without modifying existing core logic:

1. **Pluggable Storage Abstraction (`KeyValueStore`)**:
   - The `KeyValueStore` interface defines atomic operations (`setIfAbsent`, `compareAndDelete`, `isAllowedSlidingWindow`).
   - Adding a new distributed cache (e.g., Hazelcast, Apache Ignite, Memcached) simply requires implementing `KeyValueStore`. The `DistributedLockService` and `RateLimiterService` require zero code changes.
2. **Transactional Outbox Event Dispatching**:
   - `PaymentServiceImpl` depends on `PaymentEventPublisher`.
   - The platform can add Kafka direct streaming, RabbitMQ, AWS SQS, or webhook subscribers by implementing new publisher beans without modifying the checkout service.
3. **Consistent Hash Partitioning**:
   - `ConsistentHashRouter` uses a configurable virtual node ring (`numberOfReplicas`). Adding new worker nodes or rebalancing shards happens dynamically at runtime without editing partitioning algorithms.

---

## 3. Liskov Substitution Principle (LSP)
> *"Subtypes must be substitutable for their base types without altering the correctness of the program."*

LoomPay guarantees behavioral equivalence across its interface implementations:

1. **`KeyValueStore` Implementations**:
   - `RedisKeyValueStore` (Production): Uses Redis commands (`SET NX PX`, atomic Lua scripts).
   - `InMemoryKeyValueStore` (Local / Testing): Uses `ConcurrentHashMap` with timestamped entries.
   - Both implementations strictly honor the same contracts (e.g., `compareAndDelete` returns `true` only if the current value matches the caller's token; `setIfAbsent` returns `false` if already occupied).
   - In unit and integration tests, switching between `RedisKeyValueStore` and `InMemoryKeyValueStore` does not alter test correctness or reveal implementation leaks.

---

## 4. Interface Segregation Principle (ISP)
> *"Clients should not be forced to depend upon interfaces that they do not use."*

LoomPay avoids bloated, omnibus interfaces by defining focused, client-specific contracts:

1. **Granular Spring Data Repositories**:
   - `PaymentOrderRepository`: Queries and updates order lifecycle records.
   - `PaymentAttemptRepository`: Tracks gateway attempts.
   - `LedgerEntryRepository`: Records immutable accounting journals.
   - `OutboxEventRepository`: Polls and updates pending asynchronous events.
   - Services inject only the specific repository required for their domain, rather than a monolithic database manager.
2. **Dedicated Lifecycle Interfaces**:
   - `LockService`: Exposes only `acquireLock` and `releaseLock`.
   - `PaymentEventPublisher`: Exposes only `publishPaymentCreated`.
   - `KeyValueStore`: Exposes only minimal atomic distributed primitives.
3. **Isolated DTO Contracts**:
   - `CreatePaymentRequest` (Client submission).
   - `PaymentResponse` (Client response).
   - `LedgerEntryRequest` (Internal ledger audit).

---

## 5. Dependency Inversion Principle (DIP)
> *"High-level modules should not depend on low-level modules. Both should depend on abstractions."*

LoomPay uses Spring Boot's Inversion of Control (IoC) with strict constructor injection to depend exclusively on abstractions:

1. **Controller -> Service**:
   - `PaymentController` injects the `PaymentService` interface, completely unaware of `PaymentServiceImpl`, Hibernate, or database sessions.
2. **Service -> Storage**:
   - `DistributedLockService` and `RateLimiterService` inject the `KeyValueStore` abstraction. They never reference `StringRedisTemplate` or Jedis/Lettuce connection factories directly.
3. **Service -> Messaging**:
   - `PaymentServiceImpl` injects `PaymentEventPublisher`, isolating payment execution from Kafka or outbox table details.
4. **Hermetic Unit Testing**:
   - Because all dependencies are interface-driven and constructor-injected, `PaymentServiceTest` can hermetically mock `IdempotencyService`, `DistributedLockService`, `LedgerService`, and `PaymentOrderRepository` with Mockito without spinning up a live database or Redis instance.
