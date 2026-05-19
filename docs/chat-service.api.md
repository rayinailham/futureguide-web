# Chat Service API

**Base URL (production):** `https://chat.futureguide.id`
**Base URL (local):** `http://localhost:8083`
**Port:** `8083`

## Overview

Post-assessment chat with RAG-grounded AI (OpenRouter). One session per `(user_id, assessment_id)`. SSE streaming for both message delivery and real-time AI responses. Assessment must be completed and owned by user.

## Authentication

All chat endpoints require JWT: `Authorization: Bearer <token>`.
Health/metrics are public.

JWT claims: HS256, issuer `futureguide-auth`, audience `futureguide-api`, `token_type: "user"`, valid `user_id`.

## Common

### Error Format
```json
{"message": "string (Bahasa Indonesia or English)"}
```

### Rate Limit Headers
On `POST /chat/sessions/{id}/messages`: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` (on 429 only).

Rate limit: 30/min/IP (runtime-configurable via `chat.rate_limit_per_min`). Key format: `ratelimit:<ip>:<route_pattern>`. IP resolution uses `RemoteAddr` unless caller is in `TRUSTED_PROXY_CIDRS`, then honors `X-Forwarded-For`/`X-Real-IP`. Rate limiter fails closed: returns 503 when Redis is unavailable.

### Content-Type
All request bodies use `Content-Type: application/json`. All responses are `application/json` unless noted otherwise. SSE endpoint returns `text/event-stream`.

---

## REST Endpoints

### Quick Reference

| Method | Path | Auth | Rate Limit | Timeout | Description |
|--------|------|------|------------|---------|-------------|
| GET | `/chat/sessions` | JWT required | — | 30s | List user's chat sessions |
| GET | `/chat/sessions/{id}/messages` | JWT required | — | 30s | Get message history |
| DELETE | `/chat/sessions/{id}` | JWT required | — | 30s | Delete session + messages |
| POST | `/chat/sessions/{id}/messages` | JWT required | 30/min/IP | 130s | Send message (SSE response) |
| GET | `/chat/stream/{assessment_id}` | JWT required | — | Long-lived | SSE stream |
| GET | `/health` | Public | — | — | Health check |
| GET | `/ready` | Public | — | — | Readiness check |
| GET | `/metrics` | Conditionally protected | — | — | Prometheus metrics |

---

### `GET /chat/sessions`

List current user's chat sessions.

**JWT required.** Timeout: 30s. No rate limit.

**Response** `200`
```json
{
  "sessions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "assessment_id": "uuid",
      "title": "string | null",
      "model_used": "string",
      "message_count": 0,
      "created_at": "RFC3339",
      "updated_at": "RFC3339"
    }
  ],
  "total": 0
}
```

**Errors**

| Code | Message |
|------|---------|
| 401 | `unauthorized` |
| 500 | `internal server error` |

---

### `GET /chat/sessions/{session_id}/messages`

Get message history for a session. Owner-only. Messages in chronological ASC order. Max 100 returned.

**JWT required.** Timeout: 30s. No rate limit.

**Response** `200`
```json
{
  "messages": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "role": "user | assistant",
      "content": "string",
      "token_count": 0 (omitempty),
      "created_at": "RFC3339"
    }
  ],
  "total": 0
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `session_id is required` |
| 401 | `unauthorized` |
| 403 | `forbidden` |
| 404 | `session not found` |
| 500 | `internal server error` |

---

### `DELETE /chat/sessions/{session_id}`

Delete session and all messages (cascade). Owner-only. Also evicts cached system prompt.

**JWT required.** Timeout: 30s. No rate limit.

**Response** `200`
```json
{"message": "session deleted"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `session_id is required` |
| 401 | Unauthorized |
| 404 | `session not found` (also returned for ownership violations — not distinguished from not-found) |

---

### `POST /chat/sessions/{session_id}/messages`

Send message and get AI response via SSE hub.

**JWT required.** Timeout: 130s. Rate limit: 30/min/IP.

**Constraints:**
- Body max 8KB (raw request, runtime-configurable via `chat.max_body_bytes`).
- Content max 4096 bytes (after trim, runtime-configurable via `chat.max_message_length`). Note: `len()` in Go counts bytes, not characters/runes — multi-byte UTF-8 content has a lower effective character limit.
- 2-second cooldown between messages per session (runtime-configurable via `chat.message_cooldown`).
- Max messages per session (runtime-configurable via `chat.max_messages_per_session`, default from `CHAT_MAX_MESSAGES` env).
- Per-session mutex serializes messages.

**Request**
```json
{
  "content": "string (required, max 4096 bytes, non-empty after trim)"
}
```

**Response** `202 Accepted`
```json
{"message_id": "uuid (persisted assistant message ID)"}
```

The actual AI response is streamed via SSE hub — the HTTP response only confirms message acceptance.

**Errors**

| Code | Message |
|------|---------|
| 400 | `session_id is required` |
| 400 | `pesan tidak boleh kosong` |
| 400 | `pesan terlalu panjang` |
| 400 | `batas pesan tercapai` (message limit reached) |
| 400 | `invalid request body` |
| 401 | Unauthorized |
| 403 | `akses ke session ditolak` |
| 404 | `session tidak ditemukan` |
| 429 | `terlalu cepat, tunggu beberapa detik` (cooldown) |
| 429 | `terlalu banyak permintaan, coba lagi nanti` (rate limit) |
| 500 | `gagal memproses pesan. silakan coba lagi` |
| 503 | `layanan tidak tersedia, coba lagi nanti` (Redis unavailable — rate limiter fails closed) |

---

## SSE Stream Endpoint

### `GET /chat/stream/{assessment_id}`

Persistent SSE connection for a chat session. Creates session on first connect if needed. Streams session info, message history, and real-time AI responses.

**JWT required.** No write deadline (long-lived). No rate limit.

**HTTP Errors (before SSE established)**

| Code | Message |
|------|---------|
| 400 | `assessment_id is required` |
| 400 | `failed to initialize chat session` (assessment not found, not completed, or not owned by user) |
| 401 | `unauthorized` |
| 500 | `streaming not supported` (ResponseWriter doesn't implement http.Flusher) |

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
id: <message_id>
data: <json_payload>

```

### Event Types

#### `session_info` (sent first, on connect)
```json
{
  "type": "session_info",
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "assessment_id": "uuid",
    "title": "string | null",
    "model_used": "string",
    "message_count": 0,
    "created_at": "RFC3339",
    "updated_at": "RFC3339"
  }
}
```

#### `history` (sent second, bootstraps existing messages — max 50)
```json
{
  "type": "history",
  "messages": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "role": "user | assistant",
      "content": "string",
      "token_count": 0,
      "created_at": "RFC3339"
    }
  ]
}
```

#### `streaming_start` (sent when SendMessage begins processing)

> **Note:** This event fires before message validation completes. Clients may receive `streaming_start` followed by an `error` event if the message fails validation (empty, too long, cooldown, message limit).

```json
{
  "type": "streaming_start"
}
```

#### `chunk` (one per AI token delta)
```json
{
  "type": "chunk",
  "content": "partial text from OpenRouter"
}
```

#### `message_complete` (sent when assistant message is fully persisted)
```json
{
  "type": "message_complete",
  "message_id": "uuid"
}
```

#### `error` (sent on processing failure)
```json
{
  "type": "error",
  "message": "user-facing error message"
}
```

### Keepalive

Empty SSE comment `:\n\n` sent every 30 seconds.

### Slow Client Detection

Clients with full channel buffer (32 events) are disconnected.

---

### Frontend Usage Pattern

```
1. Open SSE:  EventSource("/chat/stream/{assessment_id}")
    ↓ receive: session_info → history
2. Send msg:  POST /chat/sessions/{session_id}/messages
               {"content":"Halo, apa passion saya?"}
     ↓ receive: streaming_start → chunk* → message_complete (via SSE)
3. Repeat step 2 for conversation.
```

> One session per assessment. Use `GET /chat/sessions` to find existing session IDs.

**Error handling on disconnect:** SSE reconnection is handled by `EventSource` using the `id:` field as `Last-Event-ID`. No server-side replay exists — on reconnect you get fresh `session_info` + `history`.

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

### `GET /metrics` — Conditionally Protected
Prometheus metrics. If `METRICS_SECRET` is set, requires `Authorization: Bearer <METRICS_SECRET>`. If unset, effectively public.

---

## Implementation Notes

- **RAG:** Top 6 assessment score domains + up to 6 academic references injected into system prompt.
- **System prompt:** cached per session (30-min TTL, max 500 entries), evicted on session delete.
- **OpenRouter:** `POST https://openrouter.ai/api/v1/chat/completions`, streaming `stream: true`, `max_tokens: 2048`, temperature 0.7.
- **Usage logging:** Every AI call logged to `ai_usage_logs` with tokens, latency, cost, and error class.
- **Partial response:** On AI error with partial content, a detached goroutine saves partial response so user doesn't lose generated text.

