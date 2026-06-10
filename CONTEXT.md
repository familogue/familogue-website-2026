# Domain Glossary

## Service

A programme or offering provided by the organisation. Stored in `content/services.json`. Has a `slug`, bilingual `title`/`title_en`, bilingual `content`/`content_en` (markdown), optional `image`, and `status`. Only `Published` services are displayed. `Archived` services are hidden.

## Service Slug

Stable kebab-case identifier for a Service. Explicitly authored in CMS — never derived from title. Used as the URL path segment in `/our-services/[slug]`.

## Service Excerpt

First paragraph of a Service's markdown content, extracted at render time. Used on the `/our-services` index listing. Not stored in CMS.
