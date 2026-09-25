# LoomPay

LoomPay is a distributed payment processing service written in Java using Spring Boot and Redis. It is engineered to handle concurrent payment traffic safely, preventing duplicate charges, state race conditions, and ledger imbalances under high load.

---

## Architectural Highlights

### 1. Concurrency Control and Idempotency
- **Distributed Mutex Lock**: Implemented using Redis (`SET key uuid NX EX seconds`) to serialize concurrent incoming requests referencing the same idempotency key.
- **Atomic Release via Lua**: Lock release validates ownership using a UUID before unlinking, preventing accidental lock releases across worker nodes if an operation exceeds TTL.
- **Double-Checked Idempotency**: Evaluates whether an order already exists before acquiring the lock and immediately after acquiring it, avoiding redundant payment gateway authorizations and database mutations.

### 2. Double-Entry Ledger System
- Every financial movement creates immutable debit and credit ledger rows.
- No single balance column update is performed in isolation. System consistency can be verified by asserting that total debits match total credits across all accounts.

### 3. Traffic Protection via Rate Limiting
- Built on top of Spring MVC's `HandlerInterceptor` backed by Redis counters.
- Enforces request quotas per client identifier (IP or API key).
- Rejects excess traffic with standard `HTTP 429 Too Many Requests` alongside a `Retry-After` header.

### 4. Partition Routing via Consistent Hashing
- Features a deterministic MD5 hash ring with configurable virtual nodes (default: 100 replicas per node).
- Distributes incoming merchant payloads across storage partitions evenly, mitigating hot partitions while minimizing rehashing overhead when partitions scale.

---

## State Lifecycle

Payment orders follow an explicit state transition model:

```
[CREATED] ---> [PENDING] ---> [SUCCESS]
                    |
                    +-------> [FAILED]
```

State changes are strictly validated; invalid transitions (such as moving from `FAILED` to `SUCCESS` directly) throw domain-specific exceptions captured by a centralized exception handler.

---

## Tech Stack

- **Language**: Java 21
- **Framework**: Spring Boot 3.x (Spring Web, Spring Data JPA)
- **Data & Cache**: PostgreSQL (Storage), Redis (Locks, Idempotency, Rate Limiting), H2 (Local Profiles)
- **Testing**: JUnit 5, Mockito

---

## API Endpoints

### 1. Create Payment
- **Method**: `POST`
- **Path**: `/api/v1/payments`
- **Header**: `X-Merchant-Id: <merchant-id>` (used for rate limiting; defaults to `default_merchant`)
- **Request Body**:
```json
{
  "merchantId": "merchant_123",
  "amount": 150000,
  "currency": "INR",
  "idempotencyKey": "idem_9f2c1a7b3d4e5f60"
}
```
- **Response**: `201 Created` with order details and current status.

> `amount` is in minor units (paise/cents). `currency` is one of `INR`, `USD`, `EUR`.

### 2. Get Payment
- **Method**: `GET`
- **Path**: `/api/v1/payments/{orderId}`
- **Response**: `200 OK` with order details, or `404` for an unknown order.

Rate limiting allows **5 requests per 10 seconds per merchant**. Excess
requests receive `429 Too Many Requests` with a `Retry-After` header.

---

## Console (Frontend)

An operator console lives in [`frontend/`](frontend/README.md). It provides an
overview dashboard, payment creation and lookup, a projection of the
double-entry ledger, and an API reference.

```bash
# Terminal 1 — backend without Redis (in-process locks/rate limits):
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 2 — console:
cd frontend && npm install && npm run dev
# http://localhost:5173
```

For the production stack use Docker and the default profile:

```bash
docker compose up -d   # Postgres + Redis
./mvnw spring-boot:run
```

The `local` profile replaces Redis with an in-process store so the backend runs
without infrastructure. It is not distributed and is intended for development
only. See `frontend/README.md` for the list of read endpoints the console would
use once available.

---

## Verification & Testing

Unit tests cover critical paths, including concurrent duplicate submission handling, idempotency checks, and lock release guarantees in finally blocks:

```bash
./mvnw test
```
