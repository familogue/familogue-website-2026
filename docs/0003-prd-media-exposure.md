# PRD: Media Exposure Section

## Status
Ready for implementation

## Problem
Familogue has public media coverage (interviews, articles, mentions) with no place to showcase it. Missed credibility signal.

## Goal
"Media Exposure" display section showing public media mentions. Managed via Decap CMS.

## Scope
- Decap CMS collection: `media` — fields: outlet name, headline, date, URL, thumbnail (optional); stored in `content/media.json`
- Landing page section 5 (after Services): 3-col card grid, max 6 items, sorted by date descending
- Card: thumbnail (fallback to `/images/og-image.png`), outlet name, headline
- Clicking a card opens external URL in new tab (`target="_blank" rel="noopener noreferrer"`)
- Section heading translated via `messages/en.json` + `messages/zh.json`; item data monolingual
- CMS config additions to `public/admin/config.yml`

## Out of Scope
- Full article embed
- Dedicated `/media` index page (defer)
- "View all" link (defer until `/media` page exists)

## Decisions
- **Monolingual data**: outlet name, headline, URL are external — no zh/en split needed
- **Max 6 items**: fills two rows of 3-col grid; no "View all" link until `/media` page built
- **Thumbnail optional**: fallback to `/images/og-image.png`, consistent with services pattern
- **Single JSON file**: `content/media.json`, consistent with `content/services.json` pattern
- **3-col grid**: consistent with services section rhythm
- **Section position**: after Services (section 5)
- **External links**: new tab
