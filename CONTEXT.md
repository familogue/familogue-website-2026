# Domain Glossary

## Service

A programme or offering provided by the organisation. Stored in `content/services.json`. Has a `slug`, bilingual `title`/`title_en`, bilingual `content`/`content_en` (markdown), optional `image`, and `status`. Only `Published` services are displayed. `Archived` services are hidden.

## Service Slug

Stable kebab-case identifier for a Service. Explicitly authored in CMS — never derived from title. Used as the URL path segment in `/our-services/[slug]`.

## Service Excerpt

First paragraph of a Service's markdown content, extracted at render time. Used on the `/our-services` index listing. Not stored in CMS.

## Media Exposure

A public media mention of the organisation — typically a video interview or article. Has an outlet name, headline, date, external URL, and optional thumbnail. Stored in `content/media.json`. Data is monolingual (not duplicated per locale); only the section heading is translated. Only `Published` items are displayed. Shown as a card grid (max 6, sorted by date descending) on the landing page.
