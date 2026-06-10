# PRD: Automated Facebook → News Draft Pipeline

## Status
Draft — needs refinement

## Problem
Familogue posts regularly on Facebook. Content has to be manually re-published to the website. High friction, so it doesn't happen.

## Goal
GitHub Action cron (daily) fetches Familogue Facebook page feed via Graph API, creates Decap CMS draft news posts from new entries. Human reviews, edits, and publishes via CMS.

## Scope
- GitHub Action: scheduled daily cron
- Fetches posts from Facebook Graph API (`/me/feed` or page feed endpoint)
- Maps post to News fields: title (auto-generated or first line), date, body (post text), source URL (FB post link)
- Creates draft markdown files in `content/news/` via GitHub API (commit to CMS branch or direct to main as draft)
- Skips posts already imported (dedup by FB post ID stored in frontmatter)
- Secrets: `FB_PAGE_ACCESS_TOKEN`, `GITHUB_TOKEN` stored in GitHub repo secrets

## Out of Scope
- Image extraction from Facebook posts (defer)
- Auto-publish without human review
- Other social platforms

## Open Questions
- Facebook API: Page token or User token? Long-lived token rotation strategy?
- Draft mechanism: Decap uses Git — commit with `draft: true` in frontmatter, or separate `drafts/` branch?
- How far back to import on first run (e.g. last 30 posts)?
- Notification when new drafts created (email? GitHub issue?)?
