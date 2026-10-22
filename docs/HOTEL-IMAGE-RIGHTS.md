# Licensed hotel photographs — first-party media

Hotel directory and article images use three genuine Creative Commons photos, saved as
local optimized WebP via \`scripts/import-hotel-photos.py\`:

- Nima Local House (neighborhood image, NOT hotel): Nanahuatl, "A house in Colonia Roma, Mexico City.jpg",
  https://commons.wikimedia.org/wiki/File:A_house_in_Colonia_Roma,_Mexico_City.jpg
  CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
- Casa Tortugas (Nichupté Lagoon region, NOT hotel): Isabel A01706197,
  https://commons.wikimedia.org/wiki/File:Laguna_Nichupt%C3%A9.jpg
  CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
- Villa Ganz (authentic hotel ceiling in 2015, PRE-renovation): Alan Levine ("cogdogblog"),
  https://commons.wikimedia.org/wiki/File:Vaulted_Brick_Ceiling_(16684853114).jpg
  CC BY 2.0: https://creativecommons.org/licenses/by/2.0/

Technical modifications: image orientation correction, reduction to at most 1600 pixels
and WebP conversion to optimize file size. Web display additionally crops to card
aspect ratios. Share-alike licence conditions apply to the adapted CC BY-SA media.

All articles and directory cards retain links to original, author, and licence.
Do not imply that the Nima or Casa Tortugas photo depicts its respective hotel.
Avoid externally hotlinked Wikimedia thumbnail URLs: the site serves first-party
\`/assets/editorial/hotels/<hotel-slug>.webp\` instead.

This workflow is a one-time media import, triggered only when the workflow/script
changes or by manual dispatch. It commits the binaries and corresponding HTML
changes. Existing SEO integrity workflow will run on the resulting commit.
