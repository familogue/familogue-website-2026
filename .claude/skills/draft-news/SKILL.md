---
name: draft-news
description: Draft a bilingual (zh/en) news entry for content/news.json from a URL source (Zeffy, Facebook Events, Google Forms, press release, etc.). Enforces AEO/SEO best practices. Use when given a source URL to draft a news post.
---

# Draft News

Draft a bilingual news post for `content/news.json` from a URL source, then offer to write it.

## Input

Arg is a URL. If no arg, ask for one.

## Steps

### 1 — Fetch source

`WebFetch` the URL. Extract:
- Event/announcement title
- Date(s) and time(s) — both event date and any deadlines (auction close, registration cutoff, etc.)
- Location (physical address and/or virtual link)
- Description / about
- Ticket/registration links
- Pricing or bid ranges
- Any named items, speakers, or sponsors worth listing

### 2 — Detect post type

| Signal | Type |
|---|---|
| Zeffy / Eventbrite / ticketing URL | `event` |
| Facebook Event | `event` |
| AGM / meeting notice | `meeting` |
| Press release / article | `announcement` |

### 3 — Draft JSON entry

Produce a single JSON object matching this schema:

```json
{
  "slug": "",
  "title": "",
  "title_en": "",
  "date": "",
  "author": "Calvin Chan",
  "body": "",
  "body_en": "",
  "featured_image": "",
  "status": "Draft"
}
```

**Slug:** kebab-case, explicit, never derived from title. Pattern: `<topic>-<year>` (e.g. `4th-anniversary-silent-auction-2026`).

**date:** Use today's date (publication date) in YYYY-MM-DD.

**AEO/SEO rules — non-negotiable:**

- `body_en` **must** open with a 1–2 sentence answer snippet that directly answers *"What is [this event/announcement]?"* — this becomes the page meta description (truncated to 160 chars by `extractExcerpt`). Write it as a complete, standalone sentence a search engine can surface as a featured snippet.
- `body` (Chinese) **must** open with an equivalent 1–2 sentence summary.
- For `event` type: bold **Date**, **Time**, **Location** fields near the top of both bodies.
- Include the source/ticket URL as a prominent CTA link at the end of both bodies.
- Keep markdown clean — no raw HTML.

**featured_image:** Suggest `/images/<slug>.<ext>`. If the user provides an image file, note the copy command: `cp <source> public/images/<slug>.<ext>`.

### 4 — Present draft

Show the full JSON. Then show a preview of what the meta description will be (first 160 chars of `body_en`).

Flag any missing info (e.g. event date not found on page, no image provided).

### 5 — Confirm and write

Ask: "Write this to `content/news.json` and set status to Published?"

If yes:
1. Read `content/news.json`.
2. Prepend the new entry to the `news` array (newest first).
3. Set `status` to `"Published"`.
4. Write the file.
5. If an image file was provided but not yet copied, run the copy command.
6. Confirm: "Added `<slug>` to news.json."

If no: output the JSON block only, for manual use.

## AEO/SEO checklist (verify before writing)

- [ ] `body_en` first paragraph answers "What is X?" in ≤160 chars
- [ ] Event date/time/location bolded in body
- [ ] Source/ticket CTA link present
- [ ] `featured_image` path set (or noted as missing)
- [ ] `slug` is explicit kebab-case, not derived from Chinese title
- [ ] `hreflang` covered by existing page routing (automatic — no action needed)
