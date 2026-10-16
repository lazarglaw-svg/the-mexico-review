# Awards nominations integration

Annual editorial award nominations are open to both readers and businesses conceptually. Formal assessment is planned from January 1, 2027. Nominations are suggestions, not public votes, and no winner/nominee is guaranteed.

Static pages: `/awards/` and `/en/awards/`. Shared form JS: `/assets/js/awards.js`; endpoint: `/api/award-nominations` (Vercel Node.js serverless; uses Resend for email delivery).

**The receiving service is NOT active until the following Vercel environment variables exist in Production and Preview:**
- RESEND_API_KEY — server-side Resend API key
- AWARDS_TO_EMAIL — inbox that should receive nominations
- AWARDS_FROM_EMAIL — sender at a domain verified with Resend, e.g. `TMR Awards <awards@verified-domain>`

Get `/api/award-nominations` returns `{"available":false}` until configured. Browser JS disables Submit and displays a clear temporary unavailability message. Do not claim submissions have been received without a successful POST.

To activate, create/verify sender domain at Resend, add three env vars to Vercel, redeploy production, test GET available=true and one consented sample POST; verify actual recipient receipt. No submissions are stored in GitHub or site files. Resend receives nomination data and emails it to the configured inbox. The service does not constitute a privacy policy; publish full policy before extensive collecting.

POST enforces origin, JSON, form field lengths, required consent, time-based bot trap, honeypot, and only accepts three award categories. Business contacts require name/email; readers may recommend without email. No persistent rate limiting yet, so for traffic spikes add Turnstile and server-side limiter.

The award pages intentionally remain `noindex,follow` until the form is operational; then change to `index,follow,max-image-preview:large` and add both /awards/ and /en/awards/ to sitemap with hreflang.

Editorial note: criteria and winners are not yet announced. Do not describe forms as binding votes or count duplicate self-nominations as popularity.
