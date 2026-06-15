> **Superseded by [ADR-0002](./0002-static-rebuild-on-git-push.md)** — revalidation webhook removed.

# Revalidate webhook uses bearer token, not HMAC

`/api/revalidate` was secured with Airtable's HMAC-SHA256 scheme (`x-airtable-content-mac`). Airtable removed as data source; webhook caller is now internal/trusted infrastructure. Bearer token (`x-revalidate-token` header vs `REVALIDATE_SECRET` env var) is sufficient — replay risk is low (worst case: extra ISR revalidation). HMAC adds complexity without meaningful security gain at this threat level.

## Considered options

- **HMAC-SHA256** (previous) — body-tamper protection, but overkill; no sensitive payload in revalidation calls.
- **Timestamp + HMAC** — replay-resistant, ~10 extra lines, not warranted.
- **Bearer token** (chosen) — matches Next.js docs pattern, zero deps, trivial to rotate.
