# Technical SEO & AI search (2026-10-14)

## Site-wide architecture
- Static HTML at stable trailing-slash URLs (no dependence on client-rendered JavaScript for core content).
- Mexican Spanish root / and English /en/ with reciprocal hreflang es-MX, en-US and x-default.
- Self-canonical on each language version and OG URL matching the canonical.
- Title, meta description, Open Graph, X/Twitter Card and large image preview directives on all content pages.
- Linked Organization, WebSite and WebPage JSON-LD throughout, with BreadcrumbList on inner pages.
- TouristDestination linked from each city guide's WebPage; no fake ratings, reviews, awards or claimed editorial visits.
- Sitemap contains only the 8 indexable home and city pages (4 ES / 4 EN). Other 32 incomplete pages remain noindex,follow and out of the sitemap.
- Robots allow web indexing and OAI-SearchBot. llms.txt is an optional agent-oriented navigation aid, not a ranking requirement.

## Validation and publishing
- Run `node scripts/check-seo.mjs` before each release.
- GitHub Actions checks SEO metadata, structured data, language, internal links, sitemap membership on push / pull request.
- When publishing future Reviews and Best Of: first add verifiable, unique editorial content and relevant author or methodology details. Only add Review/Rating structured data if truly substantiated and compliant.
- When promoting a page, remove noindex and add both localized versions to the sitemap.
- Re-evaluate meta title, description, first-party image and internal links for each new article.

## Not solved by tags alone
- Independent editorial expertise and real first-hand reviews.
- Google Search Console URL inspection and indexing status, external earned links and brand citations.
- PageSpeed Insights field/lab testing and real mobile Core Web Vitals.
- Google Rich Results Test validation. Eligibility is not guaranteed.
- AI search inclusion is not guaranteed. Google's official guidelines say special AI-specific markup or llms.txt is not necessary.
