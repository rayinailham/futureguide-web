# Auth Service API

**Base URL (production):** `https://auth.futureguide.id`
**Base URL (local):** `http://localhost:8081`
**Port:** `8081`

## Authentication

Most endpoints are public. Only `/auth/logout-all` and `/auth/profile` require JWT.

JWT: `Authorization: Bearer <token>`, HS256, 15-minute expiry, issuer `futureguide-auth`, audience `futureguide-api`.

## Common

### Error Format
```json
{"message": "string (Bahasa Indonesia)"}
```

### Rate Limit Headers
On rate-limited routes: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` (on 429 only).

### Content-Type
All request bodies use `Content-Type: application/json`. All responses are `application/json` unless noted otherwise.

### Common Errors
All POST endpoints may return `400` with `{"message": "invalid request body"}` if the JSON payload is malformed or unparseable. This error is not repeated in individual endpoint documentation below.

---

## Endpoints

### Quick Reference

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | `/auth/register` | Public | 5/min/IP | Register new user |
| POST | `/auth/verify-otp` | Public | 5/min/IP | Verify OTP |
| POST | `/auth/resend-otp` | Public | 3/min/IP | Resend OTP |
| POST | `/auth/login` | Public | 10/min/IP | Login with email+password |
| POST | `/auth/admin/login` | Public | 5/min/IP | Admin login |
| POST | `/auth/forgot-password` | Public | 3/min/IP | Request password reset OTP |
| POST | `/auth/reset-password` | Public | 5/min/IP | Reset password with OTP |
| POST | `/auth/refresh` | Public | 10/min/IP | Rotate refresh token |
| POST | `/auth/logout` | Public | 10/min/IP | Revoke refresh token family |
| POST | `/auth/logout-all` | JWT (user) | — | Revoke all user refresh tokens |
| GET | `/auth/google/login` | Public | 10/min/IP | Get Google OAuth redirect URL |
| GET | `/auth/google/callback` | Public | 10/min/IP | Google OAuth callback |
| GET | `/auth/profile` | JWT (user) | — | Get authenticated user profile |
| GET | `/health` | Public | — | Health check |
| GET | `/ready` | Public | — | Readiness check |
| GET | `/metrics` | Bearer token | — | Prometheus metrics |

---

### `POST /auth/register`

Register new user. Sends OTP email.

**Public.** Rate limit: 5/min/IP.

**Request**
```json
{
  "full_name": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 8 chars, max 72 chars, must have upper+lower+digit+special char)"
}
```

**Response** `201`
```json
{"message": "registrasi berhasil, silakan cek email untuk kode verifikasi"}
```

**Anti-enumeration:** If the email already exists, the response is still `201` with `{"message": "jika email tersedia, kode verifikasi telah dikirim"}` — indistinguishable by status code to prevent email enumeration.

**Errors**

| Code | Message |
|------|---------|
| 400 | `full_name, email, dan password wajib diisi` |
| 400 | `password minimal 8 karakter` |
| 400 | `password maksimal 72 karakter` |
| 400 | `password harus mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter khusus` |
| 500 | `gagal mendaftar` |

---

### `POST /auth/verify-otp`

Verify OTP and get JWT + refresh token.

**Public.** Rate limit: 5/min/IP.

**Request**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6-digit)"
}
```

**Response** `200`
```json
{
  "token": "string (JWT, 15min)",
  "refresh_token": "string (64-char hex, 7-day TTL)",
  "user": {
    "id": "uuid",
    "full_name": "string",
    "email": "string",
    "email_verified": true,
    "provider": "email",
    "created_at": "RFC3339",
    "updated_at": "RFC3339"
  }
}
```

Optional fields (omitted from JSON when not set, never `null`):
- `school_id` — string
- `grade` — string
- `major` — string
- `birthdate` — RFC3339

**Errors**

| Code | Message |
|------|---------|
| 400 | `email dan otp wajib diisi` |
| 400 | `kode OTP salah atau sudah kedaluwarsa` |
| 429 | `terlalu banyak percobaan, minta kode baru` |
| 500 | `gagal verifikasi` |

---

### `POST /auth/resend-otp`

Resend OTP to email.

**Public.** Rate limit: 3/min/IP. Also per-email rate limit (1 per 2 minutes).

**Request**
```json
{
  "email": "string (required)"
}
```

**Response** `200`
```json
{"message": "kode verifikasi baru telah dikirim ke email"}
```

If email is already verified:
```json
{"message": "email sudah terverifikasi"}
```

If user not found (ambiguous — same 200):
```json
{"message": "jika email terdaftar, kode verifikasi baru telah dikirim"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `email wajib diisi` |
| 429 | `terlalu banyak permintaan OTP, coba lagi nanti` |
| 500 | `gagal mengirim OTP` |

---

### `POST /auth/login`

Login with email + password.

**Public.** Rate limit: 10/min/IP. Account lockout after 20 failures (15-minute lock).

**Request**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** `200`
```json
{
  "token": "string (JWT, 15min)",
  "refresh_token": "string (64-char hex, 7-day TTL)",
  "user": { "..." }
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `email dan password wajib diisi` |
| 401 | `email atau password salah` |
| 403 | `email belum terverifikasi` |
| 429 | `akun terkunci sementara karena terlalu banyak percobaan, coba lagi dalam 15 menit` |
| 500 | `gagal login` |

---

### `POST /auth/admin/login`

Admin login (queries `admin_users` table). Account lockout after 10 failures (30-minute lock).

**Public.** Rate limit: 5/min/IP.

**Request** — same shape as user login:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** `200`
```json
{
  "token": "string (JWT with admin/superadmin role, 15min)",
  "refresh_token": "string (64-char hex, 7-day TTL)",
  "admin": {
    "id": "uuid",
    "email": "string",
    "full_name": "string",
    "role": "admin | superadmin",
    "created_at": "RFC3339",
    "updated_at": "RFC3339"
  }
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `email dan password wajib diisi` |
| 401 | `email atau password salah` |
| 429 | `akun terkunci sementara karena terlalu banyak percobaan, coba lagi dalam 30 menit` |
| 500 | `gagal login` |

---

### `POST /auth/forgot-password`

Request password reset OTP.

**Public.** Rate limit: 3/min/IP. Also per-email rate limit (1 per 2 minutes, swallowed as 200).

**Request**
```json
{
  "email": "string (required)"
}
```

**Response** `200`
```json
{"message": "jika email terdaftar, kode reset password telah dikirim"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `email wajib diisi` |
| 500 | `gagal memproses permintaan` |

---

### `POST /auth/reset-password`

Reset password with OTP.

**Public.** Rate limit: 5/min/IP.

**Request**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6-digit)",
  "password": "string (required, min 8 chars, max 72 chars, upper+lower+digit+special)"
}
```

**Response** `200`
```json
{"message": "password berhasil direset, silakan login"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `invalid request body` |
| 400 | `email, otp, dan password baru wajib diisi` |
| 400 | `password minimal 8 karakter` |
| 400 | `password maksimal 72 karakter` |
| 400 | `password harus mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter khusus` |
| 400 | `kode OTP salah atau sudah kedaluwarsa` (also returned when OTP attempts exceeded or user not found) |
| 500 | `gagal reset password` |

---

### `POST /auth/refresh`

Rotate refresh token — get new JWT + new refresh token pair. Replay detection: if a revoked token is reused, entire family is revoked.

**Public.** Rate limit: 10/min/IP.

**Request**
```json
{
  "refresh_token": "string (required)"
}
```

**Response** `200`
```json
{
  "token": "string (new JWT)",
  "refresh_token": "string (new refresh token)",
  "user": { "..." }
}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `refresh_token wajib diisi` |
| 401 | `refresh token tidak valid atau sudah kedaluwarsa` |
| 401 | `refresh token reuse terdeteksi, silakan login ulang` |
| 401 | `user tidak ditemukan` |
| 500 | `gagal refresh token` |

---

### `POST /auth/logout`

Revoke refresh token family. Idempotent — if the token is already revoked or not found, still returns 200.

**Public.** Rate limit: 10/min/IP.

**Request**
```json
{
  "refresh_token": "string (required)"
}
```

**Response** `200`
```json
{"message": "berhasil logout"}
```

**Errors**

| Code | Message |
|------|---------|
| 400 | `invalid request body` |
| 400 | `refresh_token wajib diisi` |
| 500 | `gagal logout` |

---

### `POST /auth/logout-all`

Revoke ALL user's refresh tokens.

**JWT required (user token).**

No request body.

**Response** `200`
```json
{"message": "berhasil logout dari semua perangkat"}
```

**Errors**

| Code | Message |
|------|---------|
| 401 | `unauthorized` |
| 500 | `gagal logout dari semua perangkat` |

---

### `GET /auth/google/login`

Get Google OAuth redirect URL.

**Public.** Rate limit: 10/min/IP.

**Response** `200`
```json
{
  "redirect_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

**Error** `503` when `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are not configured:
```json
{"message": "login Google belum tersedia"}
```

---

### `GET /auth/google/callback`

Google OAuth2 callback. Query params: `?code=<auth_code>&state=<state>`.

**Public.** Rate limit: 10/min/IP.

**Response** `200` — same as login (JWT + refresh_token + user).

**Errors**

| Code | Message |
|------|---------|
| 400 | `code and state parameters required` |
| 409 | `akun sudah terdaftar dengan email/password, silakan login lalu hubungkan Google dari profil` |
| 503 | `login Google belum tersedia` |
| 500 | `gagal login dengan Google` |

---

### `GET /auth/profile`

Get authenticated user profile.

**JWT required (user token).**

No request body.

**Response** `200`
```json
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "email_verified": true,
  "provider": "email | google",
  "created_at": "RFC3339",
  "updated_at": "RFC3339"
}
```

Optional fields (omitted from JSON when not set, never `null`):
- `school_id` — string
- `grade` — string
- `major` — string
- `birthdate` — RFC3339

---

## Infrastructure

### `GET /health` — Public
```json
{"status": "ok"}
```

### `GET /ready` — Public
```json
{"status": "ok", "checks": {"postgres": "ok", "redis": "ok"}}
```
Returns `503` with `{"status": "degraded", "checks": {...}}` when a dependency is down.

### `GET /metrics` — Bearer token (when `METRICS_SECRET` is set)
Prometheus metrics endpoint (`text/plain`). Requires `Authorization: Bearer <METRICS_SECRET>` header when `METRICS_SECRET` env var is configured. Returns `401` if token is missing/invalid. If `METRICS_SECRET` is not set, endpoint is publicly accessible.

---

## Implementation Notes

- OTP: 6-digit, SHA-256 stored in Redis, 10-min TTL, max 5 attempts.
- Refresh tokens: 32-byte crypto/rand, SHA-256 stored in PostgreSQL, family-based rotation, replay detection revokes entire family.
- Passwords: bcrypt cost 12.
- Emails normalized: lowered+trimmed.
- Security headers on all responses: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, CSP, HSTS.
- CORS allowlist from `CORS_ALLOWED_ORIGINS` env var.

