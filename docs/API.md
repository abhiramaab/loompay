# LoomPay API Specification

REST API contracts for the LoomPay payment orchestrator.

## Base URL
* Local: `http://localhost:8081`
* Live: `https://loompay.abhiram.tech`

---

## 1. Create Payment

Executes an idempotent, rate-limited payment authorization.

* **Method**: `POST`
* **Path**: `/api/v1/payments`
* **Headers**:
  * `Content-Type: application/json`
  * `X-Merchant-Id: {merchant_id}` (Required for token-bucket rate limiting)

### Request Payload
```json
{
  "merchantId": "merchant_nike",
  "amount": 499900,
  "currency": "INR",
  "idempotencyKey": "idem_nike_shoe_98234"
}
```

### Response (`201 Created`)
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

### Error Responses
* `400 Bad Request`: Missing required fields or currency mismatch.
* `429 Too Many Requests`: Triggered when exceeding 5 requests per 10 seconds per merchant. Includes `Retry-After: 10` header.

---

## 2. Get Payment by Order ID

Fetches transaction status, timestamps, and order metadata.

* **Method**: `GET`
* **Path**: `/api/v1/payments/{orderId}`

### Response (`200 OK`)
```json
{
  "orderId": "ord_7f8a9b2c3d4e",
  "merchantId": "merchant_nike",
  "amount": 499900,
  "currency": "INR",
  "status": "COMPLETED",
  "createdAt": "2026-09-25T18:30:00"
}
```

---

## 3. Query Double-Entry Ledger Entries

Retrieves debit and credit rows associated with a specific payment order.

* **Method**: `GET`
* **Path**: `/api/v1/ledger/{orderId}`

### Response (`200 OK`)
```json
[
  {
    "entryId": "led_01",
    "orderId": "ord_7f8a9b2c3d4e",
    "account": "customer_acc_98",
    "entryType": "DEBIT",
    "amount": 499900,
    "timestamp": "2026-09-25T18:30:01"
  },
  {
    "entryId": "led_02",
    "orderId": "ord_7f8a9b2c3d4e",
    "account": "merchant_acc_nike",
    "entryType": "CREDIT",
    "amount": 499900,
    "timestamp": "2026-09-25T18:30:01"
  }
]
```

---

## 4. Health & Operator Status

* **Method**: `GET`
* **Path**: `/api/v1/health`

### Response (`200 OK`)
```json
{
  "status": "UP",
  "redis": "CONNECTED",
  "database": "CONNECTED",
  "activeWorkers": 4
}
```
