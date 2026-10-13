# The Mexico Review — Platform structure

Updated: 2026-10-13

## Destinations
- Cancún (`/cancun/`) — first editorial focus
- Mexico City (`/mexico-city/`) — editorial coverage to develop
- Los Cabos (`/los-cabos/`) — editorial coverage to develop

These are the initial platform destinations. Geographic scope can expand later without changing the taxonomy.

## Categories (consistent in every destination)
1. Restaurants (`restaurants`)
2. Hotels (`hotels`)
3. Experiences (`experiences`)

A destination will eventually have its own category landing pages and individual review pages. The initial destination pages use category anchors until full editorial content exists.

## Editorial formats (separate concepts)
1. **Reviews** (`/reviews/`): individual, evidence-led evaluations of a place or experience.
2. **Best Of** (`/best-of/`): editorial comparison lists, organized by location and category and supported by actual evaluation.
3. **Annual Awards** (`/awards/`): distinct once-a-year recognition. The first awards edition is intended for **late 2026**, only if sufficient defensible coverage and published criteria exist. Do not imply 2026 award winners exist before selection.

Reviews are not synonymous with Best Of placements. Best Of placements are not automatic annual awards.

## Implementation principles
- Maintain static-first HTML, shared CSS and lightweight JavaScript.
- Use canonical URLs at https://themexicoreview.com.
- Do not fabricate reviews, rankings, experience, awards or numerical ratings.
- New destination/format landing pages are `noindex,follow` while they serve as architecture placeholders. Remove `noindex` and add to sitemap only after substantial accurate content is published.
- Country and category naming is English-first: Cancún / Mexico City / Los Cabos; Restaurants / Hotels / Experiences.
- Build actual city pages and categories next, prioritizing Cancún but with the same reusable pattern for all three.
- No paid placement may determine Reviews, Best Of, or Annual Awards.
