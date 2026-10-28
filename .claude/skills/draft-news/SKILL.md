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

Fetch the URL with `WebFetch`. If that tool is unavailable, use the Agent tool with `subagent_type: "web-fetch"` (put the full URL and the extraction list in the prompt). Extract:
- Event/announcement title
- Date(s) and time(s) — both event date and any deadlines (auction close, registration cutoff, etc.)
- Location (physical address and/or virtual link)
- Description / about
- Ticket/registration links
- Pricing or bid ranges
- Any named items, speakers, or sponsors worth listing

**Login-wall fallback:** if the host is `facebook.com`, `fb.me`, or `instagram.com`, or the fetch returns under ~500 characters, the page is likely login-walled or a stripped preview. Do not retry the fetch or try URL variants. Use the `agent-browser` skill instead (run `agent-browser skills get core` first):
1. `agent-browser open <url>`, then `agent-browser wait --load networkidle`.
2. `agent-browser snapshot -i -c`. On Facebook the login modal only overlays the page; the post text is still in the DOM. Run `agent-browser get text @eN` on the large generic ref that holds the post.
3. Poster image: `agent-browser eval` to find the largest `<img>` (`naturalWidth > 300`) and read its `src`. Download it with `curl` into its own new directory under the scratchpad, then read it. It often carries details the caption lacks (full address, season dates, eligibility, waitlist rules). Use them.
4. `agent-browser close` when done. Never leave the browser running.

If `agent-browser` also returns thin content, stop. Tell the user what (if anything) was visible, then ask them to paste the post text, plus any image path and registration link. Resume from step 2 with the pasted text.

Captions often say "Link in bio" for registration. If the real URL is not on the page, ask the user for it.

Note "Not found" for any field absent from the page before proceeding.

### 2 — Detect post type

| Signal | Type |
|---|---|
| Zeffy / Eventbrite / ticketing URL | `event` |
| Facebook Event | `event` |
| Facebook post (no event page) | Classify by content, never by host: `event` if dates/times or enrolment, `meeting` if a meeting notice, `announcement` only if press-release or article style. If unclear, ask. |
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

**featured_image:** Suggest `/images/<slug>.<ext>`. If the user provides an image file, note the copy command: `cp <source> public/images/<slug>.<ext>`. Featured images should be 16:9 (e.g. 1080×608). If the source is not 16:9 (posters are often 4:5), crop to the key content and pad with the poster's own background colour using `ffmpeg` (`crop`, then `overlay` on a scaled background patch sampled from the source, not `pad`: `pad` leaves a faint seam). Read the result to verify before writing.

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
