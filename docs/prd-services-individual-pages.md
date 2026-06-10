# PRD: Individual Service Pages

## Status
Draft — needs refinement

## Problem
"Our Services" is a single page. No deep-linkable URLs per service, poor SEO, hard to expand content per service.

## Goal
Each service gets its own page at `/services/[slug]`. The `/services` index page becomes a listing/overview.

## Scope
- Generate individual routes from existing CMS service content
- `/services` index lists all services with summary + link
- Each service page renders full content (already rendered as markdown — see issue #18)
- Navigation / breadcrumbs

## Out of Scope
- New service content authoring (existing CMS flow unchanged)
- Design overhaul

## Open Questions
- URL slug: derived from service title or explicit field in CMS?
- Should `/services` index remain as-is visually, just adding "Read more" links?
