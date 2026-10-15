# Localization — The Mexico Review

Primary site language: Mexican Spanish (`es-MX`), at `https://themexicoreview.com/`.
Secondary: English (`en-US`), at `https://themexicoreview.com/en/`.

## URL and design rules
- Spanish is the canonical root structure, e.g. `/cancun/`, `/reviews/`, `/awards/`. Keep preexisting slugs stable.
- English lives beneath `/en/` with matching slugs: `/en/cancun/`, `/en/reviews/`, etc.
- Flag switcher 🇲🇽 ES / 🇺🇸 EN appears in the Bordeaux header on desktop and mobile and connects equivalent pages, not both homepages.
- Keep the same photography, site styling, header logo, and footer logo in both languages.
- Each page must declare its own `html lang`, self-referencing canonical, equivalent `hreflang=es-MX`, `hreflang=en-US` and `x-default`, and localized title, description, alt text and visible editorial content.
- Current destination and editorial format pages are intentionally `noindex,follow` while coverage is under development. Only both substantial homepages appear in the sitemap.
- When pages are ready for search indexing, remove `noindex` for **both** languages and add both to sitemap. Awards must not claim actual winners or awards before real evaluation.
- When creating or editing a page, update both language versions simultaneously, never mix Spanish and English UI labels within the same edition.
- Do not automatically redirect visitors based on locale: Spanish is root, and visitor choice remains explicit.

## Routes (paired)
| Spanish | English |
|---|---|
| `/` | `/en/` |
| `/destinations/` | `/en/destinations/` |
| `/cancun/` | `/en/cancun/` |
| `/mexico-city/` | `/en/mexico-city/` |
| `/los-cabos/` | `/en/los-cabos/` |
| `/reviews/` | `/en/reviews/` |
| `/best-of/` | `/en/best-of/` |
| `/awards/` | `/en/awards/` |
