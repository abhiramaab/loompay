<p align="center">
  <img src="https://raw.githubusercontent.com/abhiramaab/loompay/main/frontend/public/vite.svg" alt="LoomPay-Logo" width="90px" />
</p>

<h1 align="center">L O O M P A Y</h1>

<p align="center">
  <strong>Distributed & Composable Payment Orchestration Engine</strong>
</p>

<p align="center">
  High-throughput payment gateway orchestrator built with Java 21, Spring Boot 3, Redis, and PostgreSQL.<br/>
  Engineered to eliminate double-charging, network partition loss, and ledger state anomalies.
</p>

<p align="center">
  <a href="https://loompay.abhiram.tech">
    <img src="https://img.shields.io/badge/Live_Console-loompay.abhiram.tech-6366F1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/abhiramaab/loompay">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot 3" />
  <img src="https://img.shields.io/badge/Redis-Distributed_Locks-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/PostgreSQL-ACID_Ledger-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square" alt="License" />
</p>

---

<details>
<summary><strong>📁 Table of Contents</strong></summary>

- [What Can I Do with LoomPay?](#-what-can-i-do-with-loompay)
- [System Design & Core Modules](#-system-design--core-modules)
  - [1. Concurrency: Redis Distributed Mutex](#1-concurrency-redis-distributed-mutex-lock)
  - [2. Idempotency: Double-Checked Locking](#2-idempotency-double-checked-locking)
  - [3. Messaging: Transactional Outbox Pattern](#3-messaging-transactional-outbox-pattern)
  - [4. Sharding: Consistent Hashing 360° Ring](#4-sharding-consistent-hashing-360-ring-router)
  - [5. Integrity: Double-Entry Bookkeeping Ledger](#5-integrity-double-entry-bookkeeping-ledger)
  - [6. Traffic: Token-Bucket Rate Limiter](#6-traffic-token-bucket-rate-limiter)
  - [7. Recovery: Automated Reconciliation Engine](#7-recovery-automated-reconciliation-engine)
- [Architecture & Transaction Lifecycle](#-architecture--transaction-lifecycle)
- [Quickstart (Local Docker Setup)](#-quickstart-local-docker-setup)
- [API Reference & Usage](#-api-reference--usage)
- [Operator Console (Frontend)](#-operator-console-frontend)
- [Verification & Test Suite](#-verification--test-suite)

</details>

---

## ⚡ What Can I Do with LoomPay?

LoomPay is an open architecture payment engine modeled after enterprise payment orchestrators (such as Hyperswitch and Stripe). When processing millions of transactions, financial systems encounter race conditions, network partition timeouts, and double-swipes.

LoomPay provides a composable, modular backend in Java 21 to solve these distributed systems challenges:

* **Eliminates Double Charges**: Serializes concurrent requests using atomic Redis distributed locks and idempotency keys.
* **Guarantees Zero-Loss Webhooks**: Decouples external network delivery from database mutations using the Transactional Outbox Pattern.
* **Balances Merchant Workloads**: Partitions traffic across processing nodes using a 360° Consistent Hashing ring with virtual replicas.
* **Maintains Audit-Proof Balances**: Double-entry bookkeeping ledger ensures debits and credits stay balanced down to the exact paisa.
* **Self-Healing Reconciliation**: Background cron scheduler rescues dangling `PROCESSING` transactions during network interruptions.

---

## 🏗️ System Design & Core Modules

<details>
<summary><h3>1. Concurrency: Redis Distributed Mutex Lock</h3></summary>

* **Mechanism**: Implemented via Redis `SET key uuid NX EX 5`.
* **Atomic Release**: Uses a custom Lua script that validates UUID ownership before releasing the key, preventing accidental unlock if processing exceeds TTL.
* **Interview Defense**: Protects against concurrent payment taps from impatient users or automated retry bursts without locking the entire relational database.

</details>

<details>
<summary><h3>2. Idempotency: Double-Checked Locking</h3></summary>

* **Pattern**: Checks whether an `idempotencyKey` already exists before acquiring the Redis lock, and checks again immediately after acquiring it.
* **Safe Return**: If an identical key was already submitted, returns the existing cached `PaymentResponse` with `200 OK` rather than authorizing a duplicate transaction.

</details>

<details>
<summary><h3>3. Messaging: Transactional Outbox Pattern</h3></summary>

* **The Problem Solved**: Eliminates the "Dual-Write" distributed transaction problem where a DB commit succeeds but an external webhook or Kafka dispatch fails.
* **Execution**: Saves the `PaymentOrder` and an `OutboxEvent` (`status = PENDING`) inside the **exact same ACID database transaction**.
* **Worker**: A background `@Scheduled(fixedDelay = 5000)` worker polls pending events in batches using non-blocking pagination (`Pageable`), dispatches them, and quarantines poisoned records after 3 failed retries.

</details>

<details>
<summary><h3>4. Sharding: Consistent Hashing 360° Ring Router</h3></summary>

* **Mechanism**: Built on an in-memory `TreeMap<Integer, String>` representing a 360° hash ring.
* **Hotspot Prevention**: Each physical server receives $N$ virtual replicas (`server#0`, `server#1`, `server#2`) scattered across the ring.
* **Routing**: Hashes incoming merchant IDs and walks clockwise using `tailMap().firstKey()` to find the nearest server in $O(\log M)$ time.
* **Zero Downtime**: When a server joins or leaves, only $K / N$ keys are relocated, preventing total cache invalidation.

</details>

<details>
<summary><h3>5. Integrity: Double-Entry Bookkeeping Ledger</h3></summary>

* **Immutable Accounting**: Financial balances are never modified with simple `balance = balance + amount` queries.
* **Debit/Credit Pairing**: Every successful transaction generates two immutable rows in `ledger_entries`:
  * `DEBIT` from `Customer_Account`
  * `CREDIT` to `Merchant_Account`
* **Integrity Invariant**: Sum of all debits must equal sum of all credits across the entire ledger.

</details>

<details>
<summary><h3>6. Traffic: Token-Bucket Rate Limiter</h3></summary>

* **Mechanism**: Redis-backed fixed-window counter using `INCR` + `EXPIRE` registered via Spring MVC `HandlerInterceptor`.
* **Enforcement**: Limits incoming requests per `X-Merchant-Id` (default: 5 requests per 10 seconds).
* **HTTP 429 Response**: Excess traffic is rejected with `HTTP 429 Too Many Requests` alongside a standard `Retry-After: 10` header.

</details>

<details>
<summary><h3>7. Recovery: Automated Reconciliation Engine</h3></summary>

* **Cron Worker**: A background scheduler (`@Scheduled(fixedDelay = 60000)`) searches for transactions stuck in `PROCESSING` status older than 5 minutes.
* **Resolution**: Reconciles dangling states with upstream mock gateways and updates timed-out records to `FAILED`, releasing temporary holds.

</details>

---

## 🔄 Architecture & Transaction Lifecycle

```text
  Customer Request (POST /api/v1/payments)
                     │
                     ▼
       ┌───────────────────────────┐
       │   RateLimitInterceptor    │ ──(Exceeded?)──► HTTP 429 Too Many Requests
       └───────────────────────────┘
                     │ (Allowed)
                     ▼
       ┌───────────────────────────┐
       │   ConsistentHashRouter    │ ──► Routes to designated worker node
       └───────────────────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │   DistributedLockService  │ ──► Acquires Redis Mutex (SET NX EX 5)
       └───────────────────────────┘
                     │
                     ▼
  ┌────────────────────────────────────────────────────────┐
  │              SINGLE ACID DATABASE TRANSACTION           │
  │                                                        │
  │  1. Check Idempotency Key                              │
  │  2. Insert PaymentOrder (STATUS = CREATED)             │
  │  3. Insert Ledger Entries (Debit Customer, Credit Merch)│
  │  4. Insert OutboxEvent (STATUS = PENDING)              │
  └────────────────────────────────────────────────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │   Release Redis Mutex     │ ──► Atomic Lua Script verification
       └───────────────────────────┘
                     │
                     ▼
           Return HTTP 201 Created
                     │
                     ▼
  ┌────────────────────────────────────────────────────────┐
  │                 ASYNC BACKGROUND WORKERS               │
  │                                                        │
  │  ► OutboxPublisherService: Polls & Relays Webhook / MQ │
  │  ► ReconciliationService: Rescues Stuck Orders (>5m)   │
  └────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart (Local Docker Setup)

### 1. Prerequisites
* **Java 21**
* **Docker & Docker Compose**

### 2. Boot Infrastructure & Service
Clone the repository and run the full stack:

```bash
# Clone repository
git clone https://github.com/abhiramaab/loompay.git
cd loompay

# 1. Spin up PostgreSQL 16 & Redis 7
docker compose up -d

# 2. Run the Spring Boot application
./mvnw spring-boot:run
```

The service will start on `http://localhost:8081`.

---

## 📡 API Reference & Usage

### 1. Create Payment
Executes an idempotent, rate-limited payment swipe:

```bash
curl -i -X POST http://localhost:8081/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "X-Merchant-Id: merchant_nike" \
  -d '{
    "merchantId": "merchant_nike",
    "amount": 499900,
    "currency": "INR",
    "idempotencyKey": "idem_nike_shoe_98234"
  }'
```

**Response (`201 Created`):**
```json
{
  "orderId": "ord_7f8a9b2c3d4e",
  "merchantId": "merchant_nike",
  "amount": 499900,
  "currency": "INR",
  "status": "CREATED",
  "createdAt": "2026-09-25T18:30:00"
}
```

### 2. Fetch Payment by Order ID
```bash
curl -X GET http://localhost:8081/api/v1/payments/ord_7f8a9b2c3d4e
```

### 3. Rate Limit Pressure Test (HTTP 429)
Fire 6 rapid requests in under 10 seconds:
```bash
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8081/api/v1/payments \
    -H "Content-Type: application/json" \
    -H "X-Merchant-Id: spam_merchant" \
    -d '{"merchantId":"spam_merchant","amount":1000,"currency":"INR","idempotencyKey":"idem_'$i'"}'
done
```
**Output:**
```text
201
201
201
201
201
429  <-- Rate Limit Triggered (HTTP 429 Too Many Requests)
```

---

## 💻 Operator Console (Frontend)

LoomPay includes a high-performance operator console built with **Vite, React, TypeScript, and Tailwind CSS** located in [`frontend/`](frontend/):

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the live payment stream, inspect outbox event queues, and view double-entry balances.

Live Demo is accessible at: **[loompay.abhiram.tech](https://loompay.abhiram.tech)**

---

## 🧪 Verification & Test Suite

LoomPay maintains a strict, hermetic unit and integration test suite (Mockito, JUnit 5) verifying concurrency isolation, idempotency bypass paths, and lock release guarantees.

Run tests locally:
```bash
./mvnw clean test
```

**Test Execution:**
```text
[INFO] Running tech.abhiram.loompay.PaymentServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running tech.abhiram.loompay.LoompayApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---

<p align="center">
  Built by <a href="https://github.com/abhiramaab">Abhirama</a> · Live at <a href="https://portfolio.abhiram.tech">portfolio.abhiram.tech</a>
</p>
