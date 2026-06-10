# PRD: Individual Service Pages

## Status
Ready for implementation

## Context

`/our-services` renders all 8 published services on one page. No deep-linkable URLs per service — poor SEO, no shareable links, hard to expand per-service content.

## Goal

Each service gets its own page at `/our-services/[slug]`. The `/our-services` index becomes a summary listing.

## Data model

Service slugs already exist in `content/services.json` — no CMS schema change needed. Excerpt derived from first paragraph of markdown `content`/`content_en` at render time.

## Routes

| Route | Behaviour |
|---|---|
| `/our-services` | Summary listing: image + title + first-paragraph excerpt + "Read more" link per service |
| `/our-services/[slug]` | Full service page: image + title + full markdown content |
| `/our-services/[nonexistent]` | `notFound()` → Next.js 404 |

## Navigation changes

- Homepage service cards: change links from `/our-services#${slug}` → `/our-services/${slug}`
- Individual service page: breadcrumb "Our Services → [Service Title]"

## SEO

- `sitemap.ts`: add dynamic entries for all published service slugs (both locales)
- Individual page: locale-aware `<title>` and `<meta description>` from service title + excerpt

## Out of scope

- New service content authoring (CMS flow unchanged)
- Design overhaul
- Adding excerpt/description field to CMS
