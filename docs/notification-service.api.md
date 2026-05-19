# Notification Service API

**Base URL (production):** `https://notify.futureguide.id`
**Base URL (local):** `http://localhost:8082`
**Port:** `8082`

## Overview

Real-time SSE stream of analysis job events (processing, completed, failed). Events are fanned out per-user from Redis Pub/Sub. No event replay — missed events are lost on disconnect.

## Authentication

`GET /events` requires JWT: `Authorization: Bearer <token>`.
Health/metrics are public.

JWT claims: HS256, issuer `futureguide-auth`, audience `futureguide-api`, `token_type: "user"`, valid `user_id`.

---

## Quick Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/events` | JWT (user) | Subscribe to real-time analysis SSE events |
| GET | `/health` | Public | Health check |
| GET | `/ready` | Public | Readiness check |
| GET | `/metrics` | Bearer auth (optional) | Prometheus metrics |

---

## Endpoints

### `GET /events`

Subscribe to real-time analysis events via SSE.

**JWT required (user token).** Max 5 concurrent connections per user.

**Request headers:**
```
Authorization: Bearer <jwt>
Last-Event-ID: <event_id> (optional, logged but NOT used for replay)
```

**Response headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no
```

---

### SSE Event Format

```
event: <event_type>
id: <job_id>
data: <json_payload>

```

### Event Types

#### `analysis_processing`

Emitted when analysis worker picks up the job.

```json
{
  "type": "analysis_processing",
  "job_id": "uuid",
  "user_id": "uuid",
  "status": "processing",
  "timestamp": "RFC3339"
}
```

#### `analysis_completed`

Emitted when analysis finishes successfully, result is in DB.

```json
{
  "type": "analysis_completed",
  "job_id": "uuid",
  "user_id": "uuid",
  "status": "completed",
  "timestamp": "RFC3339"
}
```

#### `analysis_failed`

Emitted when analysis terminates with error.

```json
{
  "type": "analysis_failed",
  "job_id": "uuid",
  "user_id": "uuid",
  "status": "failed",
  "error": "error description",
  "timestamp": "RFC3339"
}
```

### Keepalive

Empty SSE comment `:\n\n` sent every 30 seconds.

### Slow Client Detection

Clients with full channel buffer (64 events) are disconnected and removed.

---

### Error Responses

| Code | Message |
|------|---------|
| 401 | `unauthorized` |
| 401 | `missing authorization header` (from JWT middleware) |
| 401 | `invalid authorization format` (from JWT middleware — missing `Bearer` prefix) |
| 401 | `invalid or expired token` (from JWT middleware) |
| 401 | `invalid token claims` (from JWT middleware — wrong token_type, missing user_id, etc.) |
| 429 | `too many connections, try again later` (max 5 concurrent per user) + `Retry-After: 10` |
| 500 | `streaming not supported` |

---

## Infrastructure

### `GET /health` — Public
```json
{"status": "ok"}
```

### `GET /ready` — Public
Pings Redis:
```json
{"status": "ready", "redis": "up"}
```

```json
{"status": "not_ready", "redis": "down"}
```
Status 503 when degraded.

### `GET /metrics` — Bearer auth (optional)
Prometheus metrics. Requires `Authorization: Bearer <MetricsSecret>` when `METRICS_SECRET` env is set. When `METRICS_SECRET` is empty/unset, the endpoint is publicly accessible without authentication.

---

## Architecture

```
analysis-worker (PUBLISH channel:analysis_events)
    │
    ▼
Redis Pub/Sub
    │
    ▼
notification-service Subscriber (internal/subscriber/redis.go)
    │ json.Unmarshal → AnalysisEvent
    ▼
SSEHub.SendToUser(event.UserID, &event)
    │ fan-out to all user channels
    ▼
SSEHandler.ServeHTTP (sse_handler.go)
    │ SSE wire format
    ▼
Client browser
```

- Subscriber has permanent reconnect loop (2s wait on disconnect).
- No event replay. No deduplication.
- Events are routed ONLY to the matching `user_id` — no broadcast/admin visibility.

---

## Frontend Usage Pattern

> **Note:** The standard `EventSource` API does NOT support custom headers. To send JWT auth with SSE, use a polyfill (e.g., `eventsource-polyfill`, `@microsoft/fetch-event-source`) or a `fetch()`-based streaming approach.

```javascript
// Using @microsoft/fetch-event-source (recommended):
import { fetchEventSource } from '@microsoft/fetch-event-source';

fetchEventSource("/events", {
  headers: { Authorization: `Bearer ${jwt}` },
  onmessage(ev) {
    const data = JSON.parse(ev.data);
    if (ev.event === "analysis_completed") {
      // data.job_id → redirect / GET assessment result
    }
    if (ev.event === "analysis_failed") {
      // data.error → show error UI
    }
  },
  onclose() { /* reconnect logic */ },
  onerror(err) { /* handle error */ },
});

// Server sends `:\n\n` keepalive every 30s.
// No replay — on reconnect you get events going forward only.
```

> Tip: The `id:` field contains the `job_id`. Pass it as `Last-Event-ID` header on reconnect for logging purposes (server does NOT replay).

