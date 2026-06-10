# PRD: News Section

## Status
Draft — needs refinement

## Problem
No place to publish org updates, announcements, or stories. No content pipeline for regular publishing.

## Goal
Blog-style News section managed via Decap CMS. Staff can author, preview, and publish posts without code changes.

## Scope
- Decap CMS collection: `news` — fields: title, date, author, body (markdown), slug, featured image (optional)
- `/news` index page: list of posts, sorted by date descending
- `/news/[slug]` detail page: full post content rendered as markdown
- CMS config additions to `public/admin/index.html`

## Out of Scope
- Comments, likes, subscriptions
- Tagging / categorisation (defer)
- Facebook pipeline integration (separate PRD)

## Open Questions
- Excerpt field or auto-truncate from body?
- Pagination or infinite scroll on index?
- Draft/publish workflow already handled by Decap — confirm branch config
