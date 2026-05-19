# Assessment Service API

**Base URL (production):** `https://api.futureguide.id`
**Base URL (local):** `http://localhost:8080`
**Port:** `8080`

## Authentication

All assessment and token endpoints (except `/shared/{share_token}`) require JWT: `Authorization: Bearer <token>`.

JWT claims: HS256, issuer `futureguide-auth`, audience `futureguide-api`, `token_type: "user"`, valid `user_id`.

## Common

### Error Format
```json
{"message": "string (Bahasa Indonesia)"}
```

### Rate Limit Headers
On rate-limited routes: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` (on 429 only).

Rate limit 429 response: `{"message": "terlalu banyak permintaan, coba lagi nanti"}`.

If Redis is unavailable, rate-limited routes fail closed with 503: `{"message": "layanan tidak tersedia, coba lagi nanti"}`.

### Content-Type
All request bodies use `Content-Type: application/json`. All responses are `application/json` unless noted otherwise. PDF export returns `application/pdf`.

---

## Assessment Endpoints

### Quick Reference

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | `/assessments` | JWT required | 10/min/IP | Submit 200 answers (costs 1 token) |
| GET | `/assessments` | JWT required | 30/min/IP | List caller's assessments (keyset paginated) |
| GET | `/assessments/questions` | JWT required | 30/min/IP | Get the full assessment question bank (200 items) |
| GET | `/assessments/{job_id}` | JWT required | — | Get assessment result |
| GET | `/assessments/{job_id}/export/pdf` | JWT required | 5/min/IP | Export PDF report |
| POST | `/assessments/{job_id}/share` | JWT (owner) | — | Enable public sharing |
| GET | `/assessments/{job_id}/share` | JWT (owner) | — | Check share status |
| DELETE | `/assessments/{job_id}/share` | JWT (owner) | — | Disable public sharing |
| GET | `/shared/{share_token}` | Public | 30/min/IP | Access shared result |
| GET | `/tokens/balance` | JWT required | — | Get token balance |
| GET | `/tokens/history` | JWT required | — | List token transactions |
| POST | `/tokens/grant` | JWT (superadmin) | 10/min/IP | Grant tokens to user |
| GET | `/health` | Public | — | Health check |
| GET | `/ready` | Public | — | Readiness check |
| GET | `/metrics` | Bearer token* | — | Prometheus metrics |

---

### `POST /assessments`

Submit assessment answers. Costs 1 token. One atomic DB transaction: token debit, ledger, assessment, responses, outbox.

**JWT required.** Rate limit: 10/min/IP. Body size limit: 1 MB.

**Request**
```json
{
  "riasec": [
    {"question_number": 1, "answer_value": 3},
    // ... exactly 60 items, answer_value 1-5
  ],
  "ocean": [
    {"question_number": 1, "answer_value": 4},
    // ... exactly 44 items, answer_value 1-5
  ],
  "via_is": [
    {"question_number": 1, "answer_value": 2},
    // ... exactly 96 items, answer_value 1-5
  ]
}
```

> **Total: exactly 200 answers.** Question numbers must be unique within each section and in range (1-60 RIASEC, 1-44 OCEAN, 1-96 VIA-IS). `user_id` is taken from JWT, not request body.

**Optional header:** `Idempotency-Key: <alphanumeric, ._-:, max 128 chars>` — replay same key returns 201 with existing job; different body with same key returns 409.

**Response** `201`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "status": "pending",
  "created_at": "RFC3339"
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `invalid assessment data` (generic — specific validation errors not exposed) |
| 400 | `invalid request body` |
| 403 | `Anda tidak memiliki token. Silakan dapatkan token terlebih dahulu sebelum submit assessment.` (balance < 1) |
| 409 | `idempotency conflict` (different body with same key) |
| 429 | Rate limited |
| 500 | Internal error |

---

### `GET /assessments`

List the caller's assessments. Owner-scoped (user_id taken from JWT).

**JWT required.** Rate limit: 30/min/IP.

**Query params**

| Name | Type | Default | Notes |
|------|------|--------:|-------|
| `limit` | int | 20 | 1-50; values outside this range return 400 |
| `cursor` | string | — | Opaque RFC3339Nano timestamp from a previous `next_cursor`; omit for first page |
| `status` | string | — | Optional filter: `pending`, `processing`, `completed`, or `failed` |

Sort order is fixed: `created_at DESC, id DESC`. Heavy fields (raw answers, full `result_data`, `scores`) are intentionally omitted; `signature_title` and `signature_description` are extracted from the analysis result for at-a-glance dashboard rendering.

**Response** `200`

```json
{
  "assessments": [
    {
      "id": "uuid",
      "status": "completed",
      "signature_title": "The Investigative Architect",
      "signature_description": "Strategic thinker with deep analytical depth and a strong drive to understand complex systems.",
      "share_enabled": true,
      "created_at": "2026-05-17T10:32:14Z",
      "updated_at": "2026-05-17T10:34:50Z"
    },
    {
      "id": "uuid",
      "status": "failed",
      "share_enabled": false,
      "error": "analysis timeout",
      "created_at": "2026-05-16T08:11:02Z",
      "updated_at": "2026-05-16T08:13:45Z"
    },
    {
      "id": "uuid",
      "status": "pending",
      "share_enabled": false,
      "created_at": "2026-05-15T19:00:00Z",
      "updated_at": "2026-05-15T19:00:00Z"
    }
  ],
  "next_cursor": "2026-05-15T19:00:00Z"
}
```

Field semantics:

- `signature_title` and `signature_description` are populated only when status is `completed` and the analysis result has been written. They are omitted (per `omitempty`) for pending/processing/failed jobs.
- `share_enabled` reflects the `share_enabled` column. If a share token was previously generated and then disabled, the token is preserved internally but the flag is `false` until re-enabled.
- `error` is populated only when status is `failed`; omitted otherwise.
- `next_cursor` is omitted on the final page. Always trust its absence as end-of-list rather than counting items.

**Pagination**

Use the cursor returned in `next_cursor` as the `cursor` query parameter on the next request. The cursor is an opaque string today (RFC3339Nano timestamp) and may evolve; treat it as opaque on the frontend.

**Errors**

| Code | Message |
|------|---------|
| 400 | `limit harus berupa angka antara 1 dan 50` |
| 400 | `status tidak valid: gunakan pending, processing, completed, atau failed` |
| 400 | `cursor tidak valid` |
| 401 | `unauthorized` |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `internal server error` |

---

### `GET /assessments/questions`

Return the full assessment question bank used by `POST /assessments`. Frontends call this to render the actual item text instead of placeholders. Designed to be cached aggressively in the browser via ETag.

**JWT required.** Rate limit: 30/min/IP.

> The endpoint returns all 200 items in a single response and is intended to be prefetched at the start of an assessment session. Measured against the production seed: ~26 KB uncompressed, ~4.3 KB gzipped (gzip is applied at the edge — Cloudflare tunnel — not by the Go service itself).

**Request**

No request body. No query parameters today.

Optional headers:

| Header | Effect |
|---|---|
| `If-None-Match` | If the value matches the current ETag, the server replies `304 Not Modified` with no body, allowing clients to revalidate cached drafts cheaply. |

> Locale handling: today the bank is single-locale Bahasa Indonesia (`"locale": "id"`). The endpoint reserves `Accept-Language` for future locale negotiation; the field is already present in the response and the `Vary` header includes it so any future caching layer behaves correctly. Until a second locale ships, any `Accept-Language` value resolves to `id`.

**Response** `200`

```json
{
  "version": "f1c4a8d3e2b6a45e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
  "locale": "id",
  "total": 200,
  "sections": {
    "riasec": {
      "count": 60,
      "answer_scale": "likert_1_5",
      "questions": [
        {
          "question_number": 1,
          "category": "R",
          "question_text": "Saya suka bekerja dengan alat dan mesin",
          "reverse_scored": false
        }
      ]
    },
    "ocean": {
      "count": 44,
      "answer_scale": "likert_1_5",
      "questions": [
        {
          "question_number": 7,
          "category": "O",
          "question_text": "Saya orang yang lebih suka pekerjaan yang rutin",
          "reverse_scored": true
        }
      ]
    },
    "via_is": {
      "count": 96,
      "answer_scale": "likert_1_5",
      "questions": [
        {
          "question_number": 1,
          "category": "Creativity",
          "question_text": "Saya sering menemukan cara baru untuk melakukan sesuatu",
          "reverse_scored": false
        }
      ]
    }
  }
}
```

> The example above shows one item per section for brevity. The real response contains 60 RIASEC + 44 OCEAN + 96 VIA-IS = exactly 200 items.

**Field reference**

| Field | Type | Notes |
|---|---|---|
| `version` | `string` (64-char lowercase hex) | SHA-256 hash over `(assessment_type, question_number, category, reverse_scored, question_text)` for every item. Stable across requests for a given DB state. Use it as a cache key in localStorage; if it changes, invalidate any draft answers. |
| `locale` | `string` | Always `"id"` today. Reserved for `"en"` and others later. |
| `total` | `int` | Total item count across all sections. Always 200 once migration 032 has run. |
| `sections` | `object` | Keyed by section name: `riasec`, `ocean`, `via_is`. Keys match the JSON field names used by `POST /assessments`. |
| `sections.<name>.count` | `int` | Items in this section. Stable: 60 / 44 / 96. |
| `sections.<name>.answer_scale` | `string` | Response widget hint. Today every section is `"likert_1_5"` (integer 1-5). New types would add new values; clients should default to text rendering on unknown values. |
| `sections.<name>.questions[].question_number` | `int` | The stable identifier. Submit this exact value back in `POST /assessments` `question_number`. RIASEC 1-60, OCEAN 1-44, VIA-IS 1-96. |
| `sections.<name>.questions[].category` | `string` | Underlying dimension. RIASEC: `R`/`I`/`A`/`S`/`E`/`C`. OCEAN: `O`/`C`/`E`/`A`/`N`. VIA-IS: one of 24 strength names (`Creativity`, `Curiosity`, `Judgment`, `LoveOfLearning`, `Perspective`, `Bravery`, `Perseverance`, `Honesty`, `Zest`, `Love`, `Kindness`, `SocialIntelligence`, `Teamwork`, `Fairness`, `Leadership`, `Forgiveness`, `Humility`, `Prudence`, `SelfRegulation`, `AppreciationOfBeauty`, `Gratitude`, `Hope`, `Humor`, `Spirituality`). Safe to render to users for transparency. |
| `sections.<name>.questions[].question_text` | `string` (UTF-8) | Bahasa Indonesia item text. Plain text, no HTML, max length around 200 chars in practice (no hard server cap; rely on item curation). |
| `sections.<name>.questions[].reverse_scored` | `bool` | Whether the scoring engine inverts the value before aggregating. Clients still submit the raw 1-5 Likert value regardless. Today only some OCEAN items are reverse-scored; RIASEC and VIA-IS are not. |

`questions[]` is sorted by `question_number` ascending. The `sections` object is a JSON object — index by name; do not rely on key iteration order.

**Response headers**

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `ETag` | Strong ETag wrapping the `version` hash, e.g. `"f1c4a8d3..."` |
| `Cache-Control` | `private, max-age=3600` — browser may cache for 1 hour without revalidation |
| `Vary` | `Authorization, Accept-Language` |

**304 response**

When `If-None-Match` matches the current `ETag`, the response is `304 Not Modified` with the same `ETag` header echoed back and an empty body.

**Stability and versioning guarantees**

- `question_number` is stable across requests for a given DB migration state. The same number always refers to the same item; it is safe to use as a key in localStorage drafts (`<section>:<question_number>`).
- The `version` hash flips whenever any item's text, category, or reverse-scored flag changes. Clients should compare `version` on every fetch and clear stored drafts on mismatch.
- Item additions or removals require a new migration. The seed migration uses `ON CONFLICT DO NOTHING`, so re-running the seed never silently mutates existing rows. Net new items in a future migration would change `total`, change `version`, and add new `question_number` values — any existing numbers keep referring to the same items.
- Renumbering existing items (e.g. inserting a new RIASEC item between Q5 and Q6 and shifting later numbers) is treated as a breaking change and would be paired with a documented frontend migration. We currently have no plan to renumber.

**Randomization policy**

The backend returns items in deterministic order (`question_number` ascending). Presentation order is the frontend's responsibility — randomize client-side as desired. Submit uses `question_number` as the source of truth, so randomized presentation does not affect submission as long as the same `question_number` is sent back with the user's chosen `answer_value`.

**Volume and latency budget**

- 200 items. Measured against the seed in migration 032: ~26 KB uncompressed JSON, ~4.3 KB gzipped (compression performed by the Cloudflare tunnel; the Go service does not gzip itself).
- Backend memoizes the response in process; the first request after boot does one indexed table scan, subsequent requests are served from memory. No production latency benchmark has been published yet — treat the warm path as effectively free (memory copy + JSON encode of 200 rows).
- Suitable for prefetching at session start. The 1-hour `Cache-Control: private` plus ETag means most navigations during an assessment session do not re-hit the backend.

**Errors**

| Code | Message |
|---|---|
| 401 | `unauthorized` (missing/invalid JWT) |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `internal server error` (also returned if migration 032 has not seeded the catalog) |

---

### `GET /assessments/{job_id}`

Get assessment result. Owner-only.

**JWT required.** No rate limit.

> **Owner endpoint includes `scores`.** Domain scores (RIASEC, OCEAN, VIA-IS) are loaded for the owner alongside the analysis result so the dashboard and result page can render charts without a second round-trip. Public shared endpoint (`GET /shared/{share_token}`) and PDF export (`GET /assessments/{job_id}/export/pdf`) read the same scores.

**Response** `200`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "status": "pending | processing | completed | failed",
  "scores": {
    "riasec": {
      "realistic": 72.5,
      "investigative": 81.0,
      "artistic": 64.2,
      "social": 58.8,
      "enterprising": 70.0,
      "conventional": 55.4
    },
    "ocean": {
      "openness": 78.0,
      "conscientiousness": 65.0,
      "extraversion": 52.0,
      "agreeableness": 70.0,
      "neuroticism": 40.0
    },
    "via_is": {
      "creativity": 82.0,
      "curiosity": 88.0,
      "judgment": 75.0,
      "love_of_learning": 90.0,
      "perspective": 70.0
    }
  },
  "result": {
    "profile_summary": {
      "signature_title": "string",
      "signature_description": "string",
      "learning_style": {
        "preference": "string",
        "environment": "string"
      }
    },
    "detailed_analysis": {
      "strengths": ["..."],
      "weaknesses": ["..."],
      "team_dynamics": {
        "natural_role": "string",
        "collaboration_style": "string",
        "synergy_needs": "string"
      }
    },
    "career_pathing": {
      "top_industries": ["..."],
      "ideal_work_environment": "string",
      "role_prospects": [
        {
          "role_title": "string",
          "match_reason": "string",
          "market_outlook": "string",
          "automation_risk": "string",
          "wage_structure": {}
        }
      ]
    },
    "student_recommendations": {
      "extracurricular_clubs": [
        {"club_name": "string", "relevance": "string"}
      ],
      "immediate_actions": [
        {"action": "string", "description": "string"}
      ]
    },
    "personal_growth": {
      "development_areas": [
        {"area": "string", "action_plan": "string"}
      ],
      "book_recommendations": [
        {"title": "string", "author": "string", "relevance": "string"}
      ]
    }
  },
  "error": "string (only if status=failed)",
  "created_at": "RFC3339",
  "updated_at": "RFC3339"
}
```

**Errors**

| Code | Message |
|------|---------|
| 404 | `job not found` (also returned for ownership mismatch — does not leak existence) |
| 500 | `internal server error` |

---

### `GET /assessments/{job_id}/export/pdf`

Export assessment as PDF. Owner-only + completed-only.

**JWT required.** Rate limit: 5/min/IP.

Response headers:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="futureguide-report-{8chars}.pdf"`
- `Cache-Control: private, no-store`

Binary PDF stream (in-memory, never persisted to disk).

**Errors**

| Code | Message |
|------|---------|
| 404 | `assessment not found` (also returned for ownership mismatch) |
| 409 | `assessment is not completed yet` |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `failed to generate PDF` |

---

### `POST /assessments/{job_id}/share`

Enable public sharing. Generates a share token. Only for completed assessments.

**JWT required (owner).** No rate limit.

> Requires `status = 'completed'`. Returns 404 if assessment is not completed, not found, or not owned by the caller.

**Response** `200`

```json
{
  "assessment_id": "uuid",
  "share_enabled": true,
  "share_token": "64-char-hex"
}
```

**Errors**

| Code | Message |
|------|---------|
| 404 | `assessment not found` |

---

### `GET /assessments/{job_id}/share`

Check share status. Works on any owned assessment regardless of completion status.

**JWT required (owner).** No rate limit.

**Response** `200`

```json
{
  "assessment_id": "uuid",
  "share_enabled": true,
  "share_token": "64-char-hex"
}
```

When disabled: `share_enabled: false`, no `share_token` field.

**Errors**

| Code | Message |
|------|---------|
| 404 | `assessment not found` |

---

### `DELETE /assessments/{job_id}/share`

Disable public sharing. Works on any owned assessment regardless of completion status. The share token is preserved internally — re-enabling later reuses the same token.

**JWT required (owner).** No rate limit.

**Response** `200`

```json
{"message": "share disabled"}
```

**Errors**

| Code | Message |
|------|---------|
| 404 | `assessment not found` |

---

### `GET /shared/{share_token}`

Public access to shared assessment result. No auth required.

**Public.** Rate limit: 30/min/IP.

> Share token must be exactly 64 lowercase hexadecimal characters. Invalid format returns 404.

**Response** `200`
```json
{
  "id": "uuid",
  "status": "completed",
  "scores": { "..." },
  "result": { "..." },
  "created_at": "RFC3339"
}
```

> Note: `user_id`, raw answers, and `error` are NOT included.

**Errors**

| Code | Message |
|------|---------|
| 404 | `not found` |
| 429 | Rate limited |

---

## Token Endpoints

### `GET /tokens/balance`

Get current user token balance.

**JWT required.** No rate limit.

**Response** `200`

```json
{
  "user_id": "uuid",
  "balance": 42
}
```

---

### `GET /tokens/history`

List user token transactions.

**JWT required.** No rate limit.

Query params: `?limit=20` (optional, 1-100, default 20).

**Response** `200`

```json
{
  "transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": -1,
      "transaction_type": "assessment_debit | purchase | grant | refund",
      "reference_id": "job-uuid",
      "description": "string",
      "balance_after": 41,
      "created_at": "RFC3339"
    }
  ],
  "balance": 42
}
```

---

### `POST /tokens/grant`

Grant tokens to a user. Superadmin only (checked in handler).

**JWT required (user token + superadmin role).** Rate limit: 10/min/IP. Body size limit: 64 KB.

**Request**

```json
{
  "user_id": "uuid (required)",
  "amount": 50 (required, positive, max 1000),
  "description": "Bonus tokens" (optional, default: "Token granted by admin", max 500 chars)
}
```

**Response** `200`

```json
{
  "message": "tokens granted successfully",
  "user_id": "uuid",
  "amount": 50,
  "new_balance": 92
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `invalid request body` |
| 400 | `user_id is required` |
| 400 | `amount must be positive` |
| 400 | `amount exceeds maximum (1000)` |
| 400 | `description must be 500 characters or less` |
| 401 | `admin identity required` |
| 403 | `superadmin access required` |
| 429 | `terlalu banyak permintaan, coba lagi nanti` |
| 500 | `failed to grant tokens` |

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
503 if degraded.

### `GET /metrics` — Conditionally protected
Prometheus metrics (`text/plain`).

If `METRICS_SECRET` is configured, requires `Authorization: Bearer <secret>`. If unset, effectively public.

---

## Implementation Notes

- Submit is atomic: token debit (`FOR UPDATE`), tx insert, assessment insert, 200 response inserts, outbox insert — all in one PostgreSQL transaction.
- Outbox poller pushes to Redis queue `queue:analysis_jobs` every 2 seconds.
- PDF uses headless Chromium, streamed from memory, never persisted.
- Share tokens are 64-char hex from `crypto/rand`.
- `Idempotency-Key` header supported for submit — same key returns existing job.

