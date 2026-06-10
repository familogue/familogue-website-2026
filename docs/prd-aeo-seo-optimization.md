# PRD: AEO / SEO Site Optimization

## Status
Draft — needs refinement

## Problem
Site not optimized for search or AI answer engines. Missing structured data, incomplete meta tags, no sitemap, weak semantic HTML.

## Goal
Primary: AEO (Answer Engine Optimization) — make content digestible by AI search (ChatGPT, Perplexity, Google SGE).
Secondary: SEO — improve organic ranking signals.

## Scope (TBD — needs audit first)
- Audit current meta tags, Open Graph, Twitter Card coverage
- Add `schema.org` structured data: `Organization`, `LocalBusiness`, `Service`, `FAQPage` where applicable
- XML sitemap generation
- Canonical URLs
- Semantic HTML review (heading hierarchy, landmark regions)
- Page-level meta descriptions via CMS/frontmatter

## Out of Scope
- Paid search / ads
- Link-building campaigns
- Performance optimization (separate concern)

## Open Questions
- Run Lighthouse / structured data audit first to prioritise gaps?
- Which pages are highest priority (homepage, services, news)?
- FAQ content exists or needs to be created?
