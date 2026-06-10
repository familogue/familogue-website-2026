# PRD: Landing Page Impact Counters

## Status
Draft — needs refinement

## Problem
Landing page has no quick visual proof of impact. Visitors lack immediate social proof / credibility signal.

## Goal
3 counter slots on landing page showing org impact metrics (e.g. people served, volunteer hours, years active). Numbers stored in repo JSON, updated manually.

## Scope
- Data file: `data/counters.json` — array of `{ label: string, value: number, suffix?: string }`, max 3 items
- Landing page component renders the 3 slots with animated count-up (or static)
- No CMS integration for now

## Out of Scope
- Auto-calculation from external data source
- More than 3 slots
- Decap CMS management (possible future addition)

## Open Questions
- Count-up animation on scroll-into-view, or static?
- Suffix support (e.g. "1,200+" or "500 hrs")?
- Where on landing page — above fold, below hero, before CTA?
