# LoomPay System Architecture & Distributed Design

LoomPay is an open-architecture, high-throughput payment orchestrator designed to eliminate financial transaction anomalies: double charges, dual-write message loss, ledger state drift, and hotspot node starvation.

---

## 1. High-Level Component Topology

```text
 Client Checkout / Merchant Gateway
                │
                ▼ (POST /api/v1/payments)
   ┌───────────────────────────┐
   │    RateLimitInterceptor   │ ──(Exceeded 5 req / 10s)──► HTTP 429 Too Many Requests
   └───────────────────────────┘
                │ (Allowed)
                ▼
   ┌───────────────────────────┐
   │   ConsistentHashRouter    │ ──► Maps X-Merchant-Id to partition worker
   └───────────────────────────┘
                │
                ▼
   ┌───────────────────────────┐
   │  DistributedLockService   │ ──► Acquires Redis Mutex (SET key uuid NX EX 5)
   └───────────────────────────┘
                │
                ▼
   ┌────────────────────────────────────────────────────────┐
   │               ACID TRANSACTION BOUNDARY                │
   │                                                        │
   │  1. Check Idempotency Key (Cache & DB Lookup)          │
   │  2. Insert PaymentOrder (STATUS = CREATED)             │
   │  3. Double-Entry Ledger (Debit Customer, Credit Merch) │
   │  4. Enqueue OutboxEvent (STATUS = PENDING)             │
   └────────────────────────────────────────────────────────┘
                │
                ▼
   ┌───────────────────────────┐
   │    Release Redis Mutex    │ ──► Verified atomic release via Lua script
   └───────────────────────────┘
                │
                ▼ Return HTTP 201 Created
   ┌────────────────────────────────────────────────────────┐
   │                 BACKGROUND WORKER FLEET                │
   │                                                        │
   │  - OutboxPublisherService: Dispatches pending events   │
   │  - ReconciliationService: Rescues orders stuck > 5m    │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Distributed Concurrency: Redis Mutex Lock

### The Failure Mode
Under network latency or mobile retries, end-users frequently tap payment buttons repeatedly. If two identical requests execute concurrently against an un-serialized backend, both can pass balance validations before either commits, creating a double-debit condition.

### Implementation Details
* **Acquisition**: `SET lock:payment:{merchantId}:{idempotencyKey} {uuid} NX EX 5`.
  - `NX`: Ensures the key is only created if it does not already exist.
  - `EX 5`: Automatically expires the lock after 5 seconds to prevent deadlocks if a server crashes mid-flight.
* **Atomic Release**: Custom Lua script executed on Redis:
  ```lua
  if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
  else
      return 0
  end
  ```
  This prevents a lagging thread from inadvertently deleting a lock acquired by a newer thread after TTL expiration.

---

## 3. Idempotency Engine: Double-Checked Locking

### The Workflow
1. **Pre-Lock Check**: When a request arrives with an `idempotencyKey`, the service performs a fast check against the repository. If the key exists, the cached `PaymentResponse` is immediately returned with `200 OK`.
2. **Post-Lock Verification**: Once the Redis distributed lock is acquired, the service queries the database again within the transaction. This eliminates race conditions where two identical requests arrive in parallel before either has written to disk.
3. **Payload Fingerprinting**: SHA-256 hashes of critical payment fields (amount, currency, merchant ID) are matched against the original request to reject conflicting mutations reusing the same idempotency key.

---

## 4. Messaging Integrity: Transactional Outbox Pattern

### The Problem: Dual-Write Hazard
Writing to a relational database and publishing to a message broker (RabbitMQ/Kafka/Webhooks) inside the same service layer results in message loss or duplicate notifications whenever one side fails after the other succeeds.

### The Solution
* In LoomPay, every state change and its corresponding `OutboxEvent` are committed in the **same ACID relational database transaction**.
* An independent background scheduler (`OutboxPublisherService`) executes:
  - Queries `SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY created_at ASC` using pageable chunks.
  - Relays the payload to upstream webhooks or message queues.
  - Updates the outbox row to `SENT`.
  - After 3 consecutive network failures, flags the record as `FAILED` for dead-letter processing.

---

## 5. Sharding: 360° Consistent Hashing Ring Router

### Hotspot Mitigation
To partition merchant traffic across a dynamic pool of backend workers without creating cache invalidation storms during cluster scaling:
* Built on an in-memory `TreeMap<Integer, String>`.
* Each physical node is hashed across $N$ virtual points (e.g., `worker-1#0`, `worker-1#1`, `worker-1#2`) using MurmurHash3.
* Incoming requests are hashed by `merchantId`. The ring walks clockwise using `tailMap().firstKey()` to locate the responsible node in $O(\log M)$ time.
* Adding or removing a node relocates only $K / N$ keys, preserving existing caches.

---

## 6. Financial Integrity: Double-Entry Bookkeeping Ledger

### Accounting Principles
Balances are never mutated via unchecked SQL increments (`UPDATE accounts SET balance = balance + 100`). Every financial event generates two balanced rows in `ledger_entries`:
* `DEBIT`: Source account (e.g., Customer Wallet).
* `CREDIT`: Target account (e.g., Merchant Settlement).
* **Ledger Invariant**: Sum of all debits must equal sum of all credits across every transaction.

---

## 7. Self-Healing: Automated Reconciliation Worker

* Runs every 60 seconds (`@Scheduled(fixedDelay = 60000)`).
* Scans for transactions in `PROCESSING` state older than 5 minutes.
* Queries payment service provider mock endpoints to reconcile downstream states, transitions expired orders to `FAILED`, and releases lingering balance reservations.

---

## 8. SOLID Principles & Low-Level Design (LLD)

LoomPay is structured following strict object-oriented design and SOLID principles to ensure maintainability, testability, and fault isolation in a high-throughput financial system:

### 1. Single Responsibility Principle (SRP)
Each service and component in LoomPay has exactly one reason to change, isolating discrete concerns across the payment processing pipeline:
* `PaymentService`: Orchestrates the lifecycle of transactions (`CREATED` → `AUTHORIZED` → `SETTLED`). It does not manage lock internals, ledger arithmetic, or outbox database rows directly.
* `DistributedLockService`: Exclusively manages distributed lock acquisition and verified atomic release via Redis Lua scripting.
* `IdempotencyService`: Exclusively verifies, fingerprints (SHA-256), and caches idempotency keys to prevent duplicate transaction authorization.
* `LedgerService`: Solely maintains immutable double-entry bookkeeping ledgers and enforces debit/credit equality invariants.
* `OutboxPublisherService`: Exclusively polls pending outbox events and manages reliable downstream dispatch and retry quarantine.
* `RateLimiterService` / `RateLimitInterceptor`: Solely handles traffic shaping and rate-limiting enforcement via Redis Sorted Sets (ZSET).

### 2. Open/Closed Principle (OCP)
The system is open for extension without modifying existing, tested business logic:
* **Pluggable Key-Value Backends**: The `KeyValueStore` interface allows adding new distributed caching/lock backends (e.g., Hazelcast, AWS ElastiCache, DynamoDB, or In-Memory test mocks) without modifying `DistributedLockService` or `RateLimiterService`.
* **Dynamic Ring Topology**: `ConsistentHashRouter` supports dynamically adding/removing node workers and scaling virtual replicas on the 360° hash ring without modifying the clockwise partition algorithm.
* **Event Dispatch Decoupling**: The Transactional Outbox Pattern enables attaching new event listeners (Kafka topics, analytical sinks, partner webhooks) without altering core payment checkout transactions.

### 3. Liskov Substitution Principle (LSP)
Subtypes can replace their base abstractions without altering program correctness:
* `RedisKeyValueStore` and `InMemoryKeyValueStore` both implement the `KeyValueStore` contract (`get`, `set`, `setIfAbsentWithTtl`, `executeScript`).
* In production, `RedisKeyValueStore` handles distributed Redis state; in hermetic unit test suites and offline fallback modes, `InMemoryKeyValueStore` substitutes it transparently without breaking lock semantics, atomicity expectations, or throwing unexpected unsupported-operation errors.

### 4. Interface Segregation Principle (ISP)
Clients are not forced to depend on broad or unused interfaces:
* **Granular Domain Repositories**: Instead of a monolithic database repository, LoomPay segregates persistence into specialized Spring Data repositories (`PaymentOrderRepository`, `PaymentAttemptRepository`, `LedgerEntryRepository`, `OutboxEventRepository`). Services only inject the specific repositories required for their bounded context.
* **Dedicated DTO Contracts**: Request/Response contracts (`CreatePaymentRequest`, `PaymentResponse`, `LedgerEntryRequest`) expose only fields relevant to each API boundary, preventing internal entity leakage.

### 5. Dependency Inversion Principle (DIP)
High-level modules do not depend on low-level concrete implementations; both depend on abstractions:
* High-level domain services (`DistributedLockService`, `RateLimiterService`) depend on the abstract `KeyValueStore` interface rather than directly coupling to Spring's `StringRedisTemplate` or low-level Jedis/Lettuce drivers.
* All dependencies are inverted and injected via Spring Boot's IoC container using constructor-based dependency injection, facilitating hermetic unit testing with Mockito.

