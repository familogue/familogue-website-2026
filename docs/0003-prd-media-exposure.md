# PRD: Media Exposure Section

## Status
Draft — needs refinement

## Problem
Familogue has public media coverage (interviews, articles, mentions) with no place to showcase it. Missed credibility signal.

## Goal
"Media Exposure" display section showing public media mentions. Managed via Decap CMS.

## Scope
- Decap CMS collection: `media` — fields: outlet name, date, headline, URL, thumbnail (optional)
- Landing page section: card grid of media items, sorted by date descending
- Clicking a card opens the external URL
- CMS config additions to `public/admin/index.html`

## Out of Scope
- Full article embed
- Dedicated `/media` index page (defer)

## Open Questions
- Max items shown on landing page before "View all" link?
- Thumbnail: required or optional fallback to outlet logo / placeholder?
- Separate page `/media` or landing page section only?
