# PRD: Our Partners Section

## Status
Draft — needs refinement

## Problem
No visible acknowledgement of partner organisations. Misses credibility signal and relationship-building opportunity.

## Goal
"Our Partners" display section on landing page. Logo grid showing partner orgs. Data managed via JSON in repo.

## Scope
- Data file: `data/partners.json` — array of `{ name: string, logo: string }`, ordered by array position
- Logo assets stored in `public/images/partners/`
- Landing page section: logo grid, responsive
- No external CMS for now

## Out of Scope
- Partner grouping / tiers
- Partner detail pages
- Decap CMS management (possible future)

## Open Questions
- Logo display: colour or greyscale?
- Click behaviour: link to partner website or no link?
- Section placement on landing page
