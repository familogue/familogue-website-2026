---
name: draft-news
description: Draft a bilingual (zh/en) news entry for content/news.json from a URL source (Zeffy, Facebook Events, Google Forms, press release, etc.). Use when the user provides a URL to announce an event or news item.
---

# Draft News

Draft a bilingual news post for `content/news.json` from a URL source, then offer to write it.

**Answer snippet:** a 1–2 sentence standalone answer to "What is [this event/announcement]?" that fits within 160 characters — used as the page meta description.

## Steps

### 1 — Fetch source

Arg is a URL. If no arg, ask for one.

`WebFetch` the URL. Extract:
- Event/announcement title
- Date(s) and time(s) — both event date and any deadlines (auction close, registration cutoff, etc.)
- Location (physical address and/or virtual link)
- Description / about
- Ticket/registration links
- Pricing or bid ranges
- Any named items, speakers, or sponsors worth listing

Note "Not found" for any field absent from the page before proceeding.

### 2 — Detect post type

| Signal | Type |
|---|---|
| Zeffy / Eventbrite / ticketing URL | `event` |
| Facebook Event | `event` |
| AGM / meeting notice | `meeting` |
| Press release / article | `announcement` |

Assign exactly one type before proceeding.

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
  "featured": false,
  "status": "Draft"
}
```

**Slug:** kebab-case, explicit, never derived from title. Pattern: `<topic>-<year>` (e.g. `4th-anniversary-silent-auction-2026`).

**date:** Use today's date (publication date) in YYYY-MM-DD.

- Open `body_en` with an **answer snippet**.
- Open `body` (Chinese) with an equivalent **answer snippet**.
- For `event` type: bold **Date**, **Time**, **Location** fields near the top of both bodies.
- Include the source/ticket URL as a prominent CTA link at the end of both bodies.
- Keep markdown clean — no raw HTML.

**featured_image:** Suggest `/images/<slug>.<ext>`. If the user provides an image file, note the copy command: `cp <source> public/images/<slug>.<ext>`.

**featured:** Ask: "Should this post be featured on the landing page?" Set `featured: true` if yes, `false` if no.

### 4 — Present and verify

Show the full JSON. Show a preview of the meta description (first 160 chars of `body_en`).

Flag any missing info (e.g. event date not found on page, no image provided).

Verify before proceeding:

- [ ] `body_en` opens with an **answer snippet** (≤160 chars)
- [ ] Event date/time/location bolded in body (if `event` type)
- [ ] Source/ticket CTA link present
- [ ] `featured_image` path set (or noted as missing)
- [ ] `slug` is explicit kebab-case, not derived from Chinese title

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

### 6 — Commit and open PR

Ask: "Create a branch, commit, and open a PR?"

If yes:
1. Create branch: `git checkout -b news/<slug>`
2. Stage: `git add content/news.json public/images/<slug>.*`
3. Commit: `feat(news): add <slug>` (no body needed)
4. Push: `git push -u origin news/<slug>`
5. Open PR via `gh pr create` with title matching the commit subject and a brief markdown body (Summary bullets + Test plan checklist).
6. Return the PR URL.

If no: done.
