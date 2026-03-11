# PeptidePal — Security Notes

Developer reference covering key risks, mitigations, and ongoing guidance for maintaining the security posture of the application.

---

## Threat Model Summary

PeptidePal is a read-heavy price/review aggregator with user accounts and an admin panel. The primary attack surfaces are:

| Surface | Risk |
|---------|------|
| Public read endpoints (`/api/peptides`, `/api/vendors`, etc.) | Scraping, DoS, cache-busting |
| Review/auth write endpoints | Spam, injection, account takeover |
| Admin endpoints (`/api/admin/*`, `/api/finnrick/*`) | Privilege escalation, data corruption |
| Vendor scraping pipeline | SSRF, infinite loops, credential exposure |
| News ingestion | Malicious feed content, SSRF |

---

## 1. Authentication & Authorization

### Implementation
- **NextAuth v5** with JWT sessions (stateless, no DB lookup per request).
- User role (`USER` | `ADMIN`) is embedded in the JWT on login and re-embedded on token refresh from the DB.
- `requireAuth()` and `requireRole()` helpers in `src/lib/auth/helpers.ts` are used on every protected route handler.

### Findings & Mitigations Applied
| Issue | Status | Location |
|-------|--------|----------|
| Admin endpoints check role via `requireRole("ADMIN")` | ✅ Verified | `/api/admin/*`, `/api/finnrick/*` |
| Credentials provider validates schema (Zod) before DB lookup | ✅ OK | `src/lib/auth/config.ts` |
| Password hashing: bcrypt cost factor 12 | ✅ OK | `src/app/api/auth/signup/route.ts` |
| No password reset endpoint exists | ⚠️ Gap | Not yet implemented |
| NextAuth v5 beta — track security advisories | ⚠️ Monitor | `package.json` |

### Guidance
- **Never** expose the `AUTH_SECRET` env var. Rotate it immediately if leaked.
- Implement password reset before production launch (secure token, email, time-limited link).
- Review NextAuth v5 changelogs before upgrading — it is still beta (`5.0.0-beta.30`).

---

## 2. Input Validation & Output Encoding

### Implementation
All user-facing inputs pass through Zod schemas in `src/lib/validation/schemas.ts`:
- HTML is stripped using `sanitize-html` with `allowedTags: []` (no tags allowed).
- CUIDs are validated before DB lookups.
- Enum fields (`sortBy`, `finnrickGrade`, `availability`) are restricted to exact allowed values.
- Import file content is capped at **5 MB** (`finnrickImportSchema`).
- Pagination max set to **50 per page** (was 100 — reduced to limit query cost).

### XSS Risk
- Review titles and bodies are sanitized server-side before storage.
- All React rendering uses JSX (auto-escaped by default) — no `dangerouslySetInnerHTML` in application code.
- CSP `script-src 'unsafe-inline'` is still present (required for Tailwind v4 runtime styles). A nonce-based CSP would fully close inline script injection but requires Next.js middleware to inject nonces per request.

### SQL Injection
- ✅ Not applicable — Prisma ORM uses parameterized queries exclusively.

---

## 3. Content-Security-Policy

Current production CSP (`src/lib/security/headers.ts`):

```
default-src 'self';
script-src 'self' 'unsafe-inline';          ← no unsafe-eval in production
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
```

### Changes made
- **Removed `unsafe-eval`** from production `script-src` — Next.js 13+ no longer needs it outside development.
- **Added Google Fonts** to `style-src` and `font-src` — required for the Inter font import in `globals.css`.
- **Added `object-src 'none'`** — blocks Flash and other plugin content.
- **Development only**: `unsafe-eval` and `ws:` are added back for HMR websockets.
- **HSTS** is only set in production (would break localhost HTTPS otherwise).

### Remaining gaps
- `unsafe-inline` for `script-src` — required until a nonce-based approach is implemented.
- To tighten further: generate a per-request nonce in middleware and pass it to Next.js's `<Script>` components.

---

## 4. Rate Limiting

### Implementation (`src/lib/security/rate-limit.ts`)
- **Storage**: Redis (via ioredis INCR + EXPIRE pipeline).
- **Fallback**: In-process `Map`-based counter when Redis is unavailable — prevents complete bypass on Redis outage while not blocking traffic from an unresponsive Redis.
- **IP extraction**: Validates `X-Forwarded-For` and `X-Real-IP` against IPv4/IPv6 regex before trusting. Invalid header values fall back to `"unknown"` (shared bucket).

### Per-endpoint limits
| Endpoint | Limit |
|----------|-------|
| Default public API | 100 req / 60s |
| `POST /api/auth/signup` | 5 req / 60s |
| `POST /api/peptides/:id/reviews` | 10 req / 3600s (per user ID) |
| `PATCH/DELETE /api/reviews/:id` | 20 req / 60s |
| `POST /api/finnrick/import` | 5 req / 3600s |
| `GET /api/health` | Not rate-limited (health probes) |

### Remaining gaps
- Rate limits are per-IP. Sophisticated attackers with many IPs can still distribute attacks.
- In-memory fallback is per-server-instance; on a multi-instance deployment, limits are not globally enforced when Redis is down.

---

## 5. CSRF Protection

- All state-changing endpoints (`POST`, `PATCH`, `DELETE`) require a valid `Content-Type: application/json` header. Browsers cannot send cross-origin JSON POSTs without a CORS preflight, and CORS is restricted to allowed origins.
- SameSite cookie attribute for the NextAuth session cookie should be verified in production — NextAuth v5 sets `SameSite=Lax` by default for credentials-based sessions.
- Form submissions (`<form method="GET">` for search) are read-only and cannot modify state.
- **No additional CSRF tokens are implemented** — the combination of SameSite cookies + CORS + JSON content-type enforcement is the mitigation.

---

## 6. Secrets Management

All sensitive values are managed via environment variables — never hardcoded:

| Secret | Variable |
|--------|----------|
| Database connection | `DATABASE_URL` |
| Redis connection | `REDIS_URL` |
| NextAuth signing key | `AUTH_SECRET` |
| Google OAuth credentials | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |

### Guidance
- Rotate `AUTH_SECRET` immediately if the `.env` file is accidentally committed.
- Use a secrets manager (AWS Secrets Manager, Doppler, Vercel Environment Variables) in production — never store `.env` in version control.
- Audit `.gitignore` to ensure `.env`, `.env.local`, `.env.production` are excluded.

---

## 7. Security Headers

Applied by `src/middleware.ts` on every response:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Clickjacking prevention |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing prevention |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS for 1 year |
| `Permissions-Policy` | Disables camera, mic, geolocation, topics | Reduces browser feature attack surface |
| `Content-Security-Policy` | See §3 above | Restricts resource loading |

---

## 8. Logging & Monitoring

- Structured JSON logs via `src/lib/utils/logger.ts`.
- `logger.audit()` records security-relevant events: login, signup, review deletion, Finnrick import, admin operations.
- **Logs go to stdout only** — in production, wire stdout to a log aggregator (CloudWatch, Datadog, ELK).
- **No sensitive data is logged** — passwords, tokens, and raw request bodies are never included in log entries.

### Security events to monitor
- `user_login` (failed attempts cluster = brute force)
- `review_flagged`, `review_deleted` (content moderation)
- `finnrick_import_*` (unexpected bulk imports)
- HTTP 429 rate limit responses (spike = scanning/attack)
- HTTP 403 responses on `/api/admin/*` (privilege escalation attempts)

---

## 9. Load & DoS Hardening

| Mitigation | Status |
|-----------|--------|
| Redis SCAN (non-blocking) instead of KEYS | ✅ Fixed |
| Homepage peptide query capped at 20 rows | ✅ Fixed |
| Max page size reduced to 50 | ✅ Fixed |
| Import content max 5 MB | ✅ Fixed |
| Redis 5s command timeout | ✅ Added |
| Rate limiting with in-memory fallback | ✅ Fixed |

### Pending
- DB connection pool limits (add `?connection_limit=10&pool_timeout=10` to `DATABASE_URL` in production).
- Set Postgres statement timeout: `ALTER ROLE peptidepal SET statement_timeout = '20s'`.
- Deploy behind a CDN (Vercel Edge / CloudFront) for DDoS absorption on public read endpoints.

---

## 10. Dependency Security

```bash
npm audit                    # Check for known CVEs
npm audit fix                # Auto-fix low/medium issues
npm outdated                 # See outdated packages
```

Key packages to keep updated:
- `next-auth` (security-sensitive, track beta patches)
- `next` (patches ship frequently, often include security fixes)
- `prisma` (SQL injection prevention relies on ORM)
- `sanitize-html` (XSS prevention)
- `bcryptjs` (password hashing)

---

## 11. Health Check & Smoke Tests

`GET /api/health` — returns `200 { status: "ok" }` when DB + Redis are reachable.

Run after every deployment:
```bash
curl -s https://yourapp.com/api/health | jq .
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-11T00:00:00Z",
  "checks": {
    "database": { "status": "ok", "latencyMs": 5 },
    "redis": { "status": "ok", "latencyMs": 1 }
  }
}
```
