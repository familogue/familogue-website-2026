# PRD: Replace Supabase with In-Repo JSON + Decap CMS

## Problem Statement

The website depends on Supabase to display service listings on the homepage and the Our Services page. The Supabase instance is primarily used as a back-office database for member management, payments, and third-party integrations — none of which are relevant to the public website. Maintaining a Supabase connection (service role key, type generation, connection config) for a single table of ~15 rarely-changing rows is disproportionate overhead. The current setup creates unnecessary operational complexity and a security surface area with no meaningful benefit for website content management.

## Solution

Replace Supabase as the website's content source with a JSON file stored directly in the Git repository. Add Decap CMS — a Git-based headless CMS — to provide a web-based editor UI at `/admin`, allowing content to be edited without writing code or using the GitHub UI directly. GitHub OAuth (handled via Next.js API routes in the same repo) gates access to the admin interface. Saving in Decap commits directly to `main`, triggering a Vercel rebuild and deploying the updated content within ~2 minutes.

This eliminates all Supabase dependencies from the website while preserving a comfortable editing experience.

## User Stories

1. As a site maintainer, I want to edit service listings through a web UI, so that I don't need to touch code or the database to update content.
2. As a site maintainer, I want to edit both Chinese and English content for each service in the same form, so that bilingual parity is easy to maintain.
3. As a site maintainer, I want to upload service images through the admin UI, so that I don't need to manually manage files or external storage buckets.
4. As a site maintainer, I want changes to go live automatically after saving, so that I don't need to trigger deployments manually.
5. As a site maintainer, I want the admin UI to be accessible at `/admin` on the same domain, so that I don't need to remember a separate URL.
6. As a site maintainer, I want to log in to the admin UI with my GitHub account, so that I don't need to manage a separate password.
7. As a site maintainer, I want to control the display order of services by setting a position value, so that I can prioritise which services appear first.
8. As a site maintainer, I want to mark services as Published or Archived, so that I can hide services without deleting them.
9. As a site maintainer, I want archived services preserved in the content file, so that I can re-publish them later without re-entering data.
10. As a visitor, I want the homepage to show the same service cards as before, so that the migration is invisible to the public.
11. As a visitor, I want the Our Services page to show full bilingual service details, so that I can read about services in my preferred language.
12. As a visitor, I want service images to load fast and in modern formats, so that the page feels responsive.
13. As a developer, I want no Supabase dependencies in the website codebase, so that the project is simpler to onboard to and maintain.
14. As a developer, I want the GitHub OAuth client secret to remain server-side only, so that credentials are never exposed to the browser.
15. As a developer, I want content changes tracked in Git history, so that I can see who changed what and roll back if needed.

## Implementation Decisions

### Content storage

- Service data stored as a single JSON file at `content/services.json`
- Schema mirrors current `web_posts` table fields: `id`, `slug`, `title`, `title_en`, `content`, `content_en`, `image`, `position`, `status`
- All 14 rows migrated (both Published and Archived) — status field preserved
- Data layer reads the JSON file directly at build time; no network call, no env vars
- Slug on row 9 has a leading space (`" speech‑language-pathology"`) — must be corrected during migration

### Image hosting

- All images migrated from Supabase Storage to `public/images/`
- Filenames preserved from Supabase Storage object names
- Pages updated to use Next.js `<Image />` with local paths (`/images/filename.ext`)
- `remotePatterns` entry for Supabase Storage removed from `next.config.ts`
- Row 3 (clinical-counselling-services) has no image — handled gracefully with conditional render

### Decap CMS admin UI

- Static files at `public/admin/index.html` and `public/admin/config.yml`
- Served by Vercel as `/admin` — no separate hosting
- Config defines a single `services` collection backed by `content/services.json`
- Fields: slug, title (ZH), title_en, content (ZH, markdown widget), content_en (markdown widget), image (file widget → `public/images/`), position (number), status (select: Published / Archived)
- Backend: GitHub (direct commits to `main`)
- Media folder: `public/images`, public folder: `public`

### GitHub OAuth (server-side)

- Two Next.js API route handlers implement the OAuth handshake:
  - `GET /api/auth` — redirects to GitHub OAuth authorization URL
  - `GET /api/callback` — exchanges code for token server-side, posts token to Decap via `postMessage`
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` stored as Vercel env vars — never sent to browser
- GitHub OAuth App registered with callback URL pointing to `/api/callback`
- Repo collaborator access (write permission) required to log in — no extra user management

### Revalidation / deployment

- ISR (`revalidate`) removed from all pages — pages become fully static
- `/api/revalidate` webhook endpoint deleted — no longer needed
- Vercel auto-deploy on push to `main` handles all content updates (~1–2 min to live)
- `REVALIDATE_SECRET` env var removed from Vercel

### Dependency cleanup

- `@supabase/supabase-js` removed from `package.json`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars removed from Vercel
- `src/utils/supabase-client.ts` deleted
- `src/types/supabase.types.ts` deleted
- `src/pages/api/revalidate.ts` deleted
- `src/utils/sdk/services.ts` rewritten to import from JSON file
- `src/types/types.ts` — `ServiceRecord` type retained, now typed against JSON schema directly

### ADR candidate

The removal of ISR in favour of full Vercel rebuilds is a hard-to-reverse architectural change (all pages lose `revalidate` config). An ADR should be created documenting this trade-off: content change latency increases from seconds to ~2 minutes, accepted because content update frequency is low (weeks/months between changes) and the elimination of the revalidation webhook removes a security surface area.

## Testing Decisions

Good tests verify external behaviour — what the page renders — not implementation details like which file is imported or how the JSON is parsed.

### Modules to test

- **`getAllServices(locale)`** (rewritten in `services.ts`) — unit test: given a fixture JSON with mixed Published/Archived rows, assert only Published rows are returned, sorted by position, with correct locale fields mapped.
- **`/admin` route** — smoke test: GET `/admin` returns 200 and includes the Decap CMS script tag.
- **`/api/auth` route** — unit test: GET `/api/auth` returns a redirect to GitHub OAuth URL containing correct `client_id` and `scope`.
- **`/api/callback` route** — unit test with mocked GitHub token exchange: assert response posts token via `postMessage` script.

### Prior art

No existing test suite found in this repo. These would be the first tests. Use Next.js built-in test patterns (Jest + React Testing Library for unit; Playwright for smoke/e2e if added later).

## Out of Scope

- Migrating back-office Supabase tables (members, payments, SimplyBook) — those belong to a separate application
- Draft/preview workflow — Decap commits directly to `main`; no staging branch
- Multi-user access control beyond GitHub repo collaborator membership
- Rich media management beyond static image upload (no video, no image transforms)
- i18n message strings (`messages/en.json`, `messages/zh.json`) — these are already file-based and unaffected
- Other pages that currently use only i18n strings (About Us, Support Us, Donate, Volunteer, News)
- CI/CD pipeline changes beyond removing the revalidation webhook

## Further Notes

- The Decap CMS `config.yml` markdown widget for `content` and `content_en` fields should use `editor_components: []` to disable the visual toolbar and keep editors writing plain markdown — consistent with how the current content is authored.
- Decap's media library writes image paths relative to `public/` — the `image` field in JSON will store paths like `/images/filename.ext`, which is the correct format for Next.js `<Image src>`.
- The existing ADR-0001 (bearer token for revalidate webhook) becomes moot once the webhook is deleted. The ADR file can be kept for historical reference or explicitly marked superseded.
- Row 9 (`speech-language-pathology`) uses a Unicode non-breaking hyphen (`‑`) in the slug — should be normalized to a standard hyphen (`-`) during migration to avoid URL encoding issues.
