# LoomPay Console

The operator console for the LoomPay payment orchestration engine. React + Vite +
TypeScript + Tailwind + Framer Motion, wired directly to the Spring Boot API.

## Screens

| Route | Purpose |
| --- | --- |
| `/` | Overview: volume, lifecycle state machine, recent orders, engine capabilities. |
| `/payments` | Order list, status filters, lookup-by-orderId, create-payment drawer. |
| `/payments/:orderId` | Order detail: lifecycle timeline, ledger preview, state machine. |
| `/ledger` | Double-entry journal with live debit/credit reconciliation. |
| `/developer` | API reference with sample requests and the backend endpoint backlog. |

## Running

The console talks to the backend through the Vite dev proxy at `/api/v1` →
`http://localhost:8081`.

### 1. Start the backend

The engine needs Redis in production. For UI development, use the `local`
profile, which swaps Redis for an in-process lock/rate-limit store:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

With Docker available, the real stack is:

```bash
docker compose up -d          # Postgres + Redis
./mvnw spring-boot:run
```

> The `local` profile is single-process only. Locks and rate limits are not
> shared across instances and must never be used in production.

### 2. Start the console

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

### Configuration

`VITE_API_BASE` overrides the API prefix (default `/api/v1`). Copy
`.env.example` to `.env.local` to customise it.

## Scripts

```bash
npm run dev        # dev server with HMR
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc only
```

## Architecture notes

- `src/api/` — typed client. Amounts are sent in minor units (paise/cents).
  `ApiError` carries status and `Retry-After` for 429 handling.
- `src/lib/store.ts` — session-local payment cache. This exists because the
  backend exposes only `POST /payments` and `GET /payments/{orderId}` today.
  It is the single seam to replace with real list/metrics calls.
- `src/lib/status.ts` — canonical status metadata mirrored from
  `PaymentStatus.java`, including the legal transition graph.
- `public/loompay-mark.svg`, `public/loompay-logo.svg` — standalone brand
  assets (the favicon and wordmark).

## Backend endpoints still needed

The console currently works with the two endpoints that exist. To make the
list, ledger, and metric views authoritative rather than session-derived, add:

1. **`GET /api/v1/payments`** — paginated list.
   Query: `merchantId?`, `status?`, `page=0`, `size=20`, `sort=createdAt,desc`.
   Returns `{ content: PaymentResponse[], page, size, totalElements, totalPages }`.

2. **`GET /api/v1/ledger`** — journal query.
   Query: `orderId?`, `account?`, `page`, `size`.
   Returns entries (`paymentOrderId`, `account`, `entryType`, `amount`, `currency`, `createdAt`).

3. **`GET /api/v1/metrics/summary`** — aggregates for the dashboard.
   Returns counts by status, settled volume per currency, success rate, and
   pending outbox events. Optional: `merchantId?`, `from?`, `to?`.

4. **`POST /api/v1/webhooks/payment`** — implement the `WebhookController`
   stub so orders can move `CREATED → PROCESSING → SUCCESS/FAILED/REFUNDED`.
   Body: `{ orderId, status, gatewayReference }`. This is what lets the UI
   show real lifecycle progress instead of a snapshot.

5. **`GlobalExceptionHandler`** — the class currently has no annotations, so
   `RuntimeException("Payment order not found")` returns HTTP 500. A handler
   returning `404` for missing orders and `409` for illegal state transitions
   would let the console stop falling back to the session cache.

Once (1), (2), and (3) exist, replace the reads in `src/lib/store.ts`,
`src/pages/Ledger.tsx`, and `src/pages/Dashboard.tsx` with `api` calls; the
presentational components need no changes.
