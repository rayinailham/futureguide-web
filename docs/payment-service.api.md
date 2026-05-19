# Payment Service API

**Base URL (production):** `https://pay.futureguide.id`
**Base URL (local):** `http://localhost:8084`
**Port:** `8084`

## Authentication

Order endpoints require JWT: `Authorization: Bearer <token>`.
Webhook is IP-allowlist (no JWT) + server-side Pakasir verification. When `PAKASIR_WEBHOOK_IPS` is unset/empty, the IP allowlist is bypassed (all IPs accepted).
Packages are public.

## Common

### Error Format
```json
{"message": "string (Bahasa Indonesia)"}
```

### Rate Limit Headers
On rate-limited routes: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` (on 429 only).

### Content-Type
All request bodies use `Content-Type: application/json`. All responses are `application/json` unless noted otherwise.

---

## Endpoints

### Quick Reference

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/payments/packages` | Public | — | List available token packages |
| POST | `/payments/orders/` | JWT required | 5/min/IP | Create Pakasir QRIS payment order |
| GET | `/payments/orders/` | JWT required | 30/min/IP | List current user's orders |
| GET | `/payments/orders/{order_id}` | JWT required | 30/min/IP | Get single order |
| DELETE | `/payments/orders/{order_id}` | JWT required | 10/min/IP | Cancel pending order |
| POST | `/payments/webhook` | IP-allowlist | 30/min/IP | Pakasir payment callback |
| GET | `/health` | Public | — | Health check |
| GET | `/ready` | Public | — | Readiness check |
| GET | `/metrics` | Bearer auth (optional) | — | Prometheus metrics |

---

### `GET /payments/packages`

List available token packages.

**Public.** No rate limit.

**Response** `200`

```json
{
  "packages": [
    {"id": "1_token",  "token_amount": 1,  "price_idr": 200000,  "label": "1 Token - Rp 200.000"},
    {"id": "3_tokens", "token_amount": 3,  "price_idr": 500000,  "label": "3 Token - Rp 500.000"},
    {"id": "5_tokens", "token_amount": 5,  "price_idr": 800000,  "label": "5 Token - Rp 800.000"},
    {"id": "10_tokens","token_amount": 10, "price_idr": 1200000, "label": "10 Token - Rp 1.200.000"}
  ]
}
```

---

### `POST /payments/orders/`

Create a Pakasir QRIS payment order.

**JWT required.** Rate limit: 5/min/IP.

**Request** (max 16KB body)
```json
{
  "package_id": "1_token | 3_tokens | 5_tokens | 10_tokens"
}
```

**Response** `201`

```json
{
  "order": {
    "id": "uuid (internal)",
    "user_id": "uuid",
    "order_id": "FG-xxxxxxxxxxxx",
    "package_id": "1_token",
    "token_amount": 1,
    "amount_idr": 200000,
    "fee_idr": 1000,
    "total_payment_idr": 201000,
    "status": "pending",
    "payment_method": "qris",
    "qr_string": "000201010212... (QRIS string)",
    "expired_at": "RFC3339 (omitempty — absent when nil)",
    "completed_at": "RFC3339 (omitempty — absent when nil)",
    "created_at": "RFC3339",
    "updated_at": "RFC3339"
  },
  "qr_string": "000201010212... (QRIS string)",
  "total_payment": 201000,
  "expired_at": "RFC3339 or null (present but null when no expiry)"
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `package_id is required` |
| 400 | `invalid package_id` |
| 400 | `invalid request body` |
| 401 | `unauthorized` |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `failed to create payment order` |

> If Pakasir succeeds but DB insert fails, a background goroutine cancels the orphaned upstream transaction (compensating action).

---

### `GET /payments/orders/`

List current user's orders. Keyset pagination, sorted by `created_at DESC`.

**JWT required.** Rate limit: 30/min/IP.

Query params: `?limit=20&cursor=<opaque>` (limit 1-50, default 20).

**Response** `200`

```json
{
  "orders": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "order_id": "FG-xxxxxxxxxxxx",
      "package_id": "1_token",
      "token_amount": 1,
      "amount_idr": 200000,
      "fee_idr": 1000,
      "total_payment_idr": 201000,
      "status": "pending | completed | cancelled | expired",
      "payment_method": "qris",
      "qr_string": "string (omitempty)",
      "expired_at": "RFC3339 (omitempty — absent when nil)",
      "completed_at": "RFC3339 (omitempty — absent when nil)",
      "created_at": "RFC3339",
      "updated_at": "RFC3339"
    }
  ],
  "next_cursor": "RFC3339Nano (only if more results)"
}
```

> `qr_string` is omitted when empty.

**Errors**

| Code | Message |
|------|---------|
| 401 | `unauthorized` |
| 500 | `internal server error` |

---

### `GET /payments/orders/{order_id}`

Get a single order. Owner-only.

**JWT required.** Rate limit: 30/min/IP.

**Response** `200` — flat `PaymentOrder` object (not wrapped):

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "order_id": "FG-xxxxxxxxxxxx",
  "package_id": "1_token",
  "token_amount": 1,
  "amount_idr": 200000,
  "fee_idr": 1000,
  "total_payment_idr": 201000,
  "status": "pending | completed | cancelled | expired",
  "payment_method": "qris",
  "qr_string": "string (omitempty)",
  "expired_at": "RFC3339 (omitempty — absent when nil)",
  "completed_at": "RFC3339 (omitempty — absent when nil)",
  "created_at": "RFC3339",
  "updated_at": "RFC3339"
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `order_id is required` |
| 401 | `unauthorized` |
| 403 | `access denied` (not owner) |
| 404 | `order not found` |
| 500 | `internal server error` |

---

### `DELETE /payments/orders/{order_id}`

Cancel a pending order. Also cancels the Pakasir upstream transaction. Atomic: `UPDATE ... WHERE status='pending'` with row-count check to prevent race with webhook.

**JWT required.** Rate limit: 10/min/IP.

**Response** `200`

```json
{"message": "order cancelled"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `order_id is required` |
| 400 | `order cannot be cancelled` (already completed/expired/cancelled, or race lost) |
| 401 | `unauthorized` |
| 403 | `access denied` |
| 404 | `order not found` |
| 500 | `internal server error` |

---

### `POST /payments/webhook`

Pakasir payment callback. Webhook verification flow:

1. Pre-filter: non-`completed` status silently ignored.
2. Lookup local order by `payload.OrderID`.
3. Reject mismatches: project, amount, payment method.
4. Idempotency: already `completed` orders are silently skipped.
5. Pakasir server-side verification via Transaction Detail API.
6. Atomic completion: `SELECT ... FOR UPDATE` lock → mark order `completed` → credit tokens → insert `token_transactions` (type `purchase`).

**Public (IP-allowlist).** Rate limit: 30/min/IP. Detached 30s context.

**Request** (max 64KB body)
```json
{
  "order_id": "string (required)",
  "status": "string (required, only 'completed' processed)",
  "project": "string (required)",
  "payment_method": "string (required)",
  "amount": 201000 (required, > 0),
  "completed_at": "RFC3339 (optional)"
}
```

**Response** `200`

```json
{"status": "ok"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `invalid payload` / `missing required fields` |
| 400 | `webhook rejected` (project/amount/method mismatch) |
| 403 | `forbidden` (IP not in allowlist) |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `processing failed` |

---

## Important Behaviors

### Order Lifecycle

| Transition | Trigger |
|------------|---------|
| (none) → `pending` | CreateOrder |
| `pending` → `completed` | Webhook (after Pakasir verification) |
| `pending` → `cancelled` | DELETE order (user-initiated) |
| `pending` → `expired` | Background goroutine (every 5 min) |
| `expired`/`cancelled` → `completed` | Webhook still accepted — Pakasir completion is authoritative |

### Idempotency Guards

- DB-level: unique partial index on `token_transactions(reference_id) WHERE transaction_type='purchase'`.
- Service-level: `SELECT ... FOR UPDATE` serializes concurrent completion. Returns `ErrAlreadyPaid` if already done.
- Cancel race: `UPDATE ... WHERE status='pending'` with row-count check.

### Circuit Breaker (Pakasir Client)

- Opens after 5 consecutive failures (network/5xx).
- Half-open: 3 probe requests.
- 4xx errors do NOT trip breaker.
- Timeout: 30s HTTP, 1MB max response.
- Interval: 60s (failure count resets after 60s of no failures).
- Open duration: 30s before transitioning to half-open.

### Background Expiry

Pending orders past `expired_at` are marked `expired` every 5 minutes. The `expired_at` timestamp is set by Pakasir's `CreateTransaction` response (not a hardcoded duration in this service).

---

## Infrastructure

### `GET /health` — Public
```json
{"status": "ok"}
```

### `GET /ready` — Public
Pings Postgres + Redis:
```json
{"status": "ok", "checks": {"postgres": "ok", "redis": "ok"}}
```

### `GET /metrics` — Bearer auth (optional)
Prometheus metrics. Requires `Authorization: Bearer <MetricsSecret>` when `METRICS_SECRET` env is set. When `METRICS_SECRET` is empty/unset, the endpoint is publicly accessible without authentication.

