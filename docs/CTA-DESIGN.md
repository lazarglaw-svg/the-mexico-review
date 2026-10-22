# TMR CTA button system — 2026-10-22

All real navigation actions are visually buttons, with square editorial geometry and WCAG-conscious contrast. Leave in-body citations, breadcrumb links, text navigation, image credits and language switch as ordinary text links.

- Primary action: #4B0F17 (Bordeaux), #fff text, no large border radius or shadow.
- Hover: #691D29, white text.
- On Bordeaux or dark editorial backgrounds: #211E1B (ink black) with white text; hover #3C3531.
- Links that navigate retain correct <a> semantics and their href; submissions retain <button> semantics and disabled/loading states.
- Affected components: .underlined-link, .hero-button, .journal-story-link, .tmr-editorial-card-label, .tmr-link, .rh-btn, awards buttons and .error-page .text-link.
- Entire clickable destination, category, and city-choice cards get a localized CSS ::after button affordance to clearly communicate clickability while keeping one keyboard-focusable target. Use html lang es-MX / en-US for the label.
- Browse category tabs get a distinct boxed selected state (not fake submit actions).
- Focus indicators, 44–48px minimum CTA heights and touch-friendly mobile padding.
- Existing noindex/indexable rules, links, article content, imagery, nav and SEO metadata are untouched.
