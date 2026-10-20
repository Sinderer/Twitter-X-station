---
name: find-images
description: Where to find a picture that already exists and how to pull it — Wikimedia Commons, Met, Art Institute of Chicago and other museum APIs, archive.org, Unsplash/Pexels, Pixiv's public ajax endpoints, Pinterest, Google Images/Lens, brand and shop sites, client material — plus the post-processing that has worked (rembg cut-outs, webp + LQIP). Use when the user asks for a cover image, a product shot, a reference painting, a car or landscape photo, fan-art, "find me a picture of X", "where can I get a free image of", or the original source of a repost.
---
# Finding pictures

Where to find a picture that already exists: covers
for articles, product shots, design references, paintings, cars, landscapes,
fan-art. Making a new one is a job for an image generator you have (local or
web). Two sites (Pixiv, Instagram) are reached from a tab open in your browser;
every other source is used directly — open it, search, pick, download.

## Tools on the user's machine

- **Your browser** — by hand, or a browser automation MCP such as Playwright
  MCP / Chrome DevTools MCP: open any site (Pinterest boards, Google Images,
  brand sites), read the page to pick, call a site's own JSON from inside the
  page (the console, or an evaluate call), take a screenshot for art direction,
  the window handed to the user for a login or captcha.
- **Pixiv** — `/ajax/search/artworks/<tag>` from a pixiv.net tab, ranked by
  `bookmarkCount` from `/ajax/illust/<id>`; SFW works logged out, R-18 and the
  popular sort need a pixiv login in the profile. For the image files on
  `i.pximg.net`, open the site in your browser.
- **Instagram** — a client's own feed, every carousel frame: open the site in
  your browser (the profile's own GraphQL answers can be read from the page;
  media URLs live ~1 hour, download at once).


## Sources and how to reach them

- **Wikimedia Commons** — search
  `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=<q>&format=json`,
  then `prop=imageinfo&iiprop=url|extmetadata|size&titles=File:…` for the file
  URL; `extmetadata` carries `Artist` and `ImageDescription`.
  Crops, plants, animals, landscapes, paintings, old photos.
- **Met Museum Open Access** —
  `https://collectionapi.metmuseum.org/public/collection/v1/search?q=<q>&hasImages=true`
  → `/objects/{id}` → `primaryImage`, artist, date. Reachable
  from every network we tried (Rijksmuseum was not).
- **Art Institute of Chicago** —
  `https://api.artic.edu/api/v1/artworks/search?q=<q>&fields=id,title,artist_display,image_id`;
  image `https://www.artic.edu/iiif/2/{image_id}/full/1686,/0/default.jpg`.
- **Rijksmuseum, V&A, Smithsonian, Cleveland Museum** — public APIs; if one is
  blocked from the box, the same painting is usually on Commons.
- **archive.org** — magazines, books, old photos:
  `https://archive.org/advancedsearch.php?q=<q>+AND+mediatype:texts&fl[]=identifier,title,date&output=json`;
  page images through BookReader
  (`…/BookReaderImages.php?zip=…_jp2.zip&file=…&scale=2`). A local script
  that did search → page grid → full-res spreads has worked before and is
  worth writing again when a client needs archive spreads.
- **Unsplash / Pexels** — official APIs (free key per project) or the site;
  the `?w=2000` download URL, photographer page next to it. Cars, cities,
  lifestyle.
- **Client material** — their Instagram (open it in your browser), their old
  site, their Drive, product photos they send. Usually the first place to look
  for a business.
- **Pixiv** — see above.
- **Pinterest** — in your browser (logged in if the user has an account):
  `https://www.pinterest.com/search/pins/?q=<q>`;
  pins are rarely the original — Google Lens finds the source.
- **Google Images / Lens** — `https://www.google.com/search?tbm=isch&q=<q>`;
  Lens (`https://lens.google.com/upload`) finds the original of a repost.
- **Manufacturer / brand sites** (Porsche, AMG, dealers) — screenshots of live
  pages as art direction; product cards from shops for cut-outs of the client's
  goods.
- **Blogger / Shopify archives, magazine shops** — editorial references (Twen,
  Bazaar…); Blogger feeds `/feeds/posts/default?alt=json&q=`, Shopify
  `/products.json`; a small local script covers both.
- **Nothing fits** — make one: an image generator you have (local or web).

## Post-processing that has worked

- Cut-outs: `rembg` with model `isnet-general-use`; flood-fill from the corners
  for flat white shop backgrounds; a regenerated background (an image generator)
  as the last resort.
- Web build: webp at the target width plus a tiny LQIP, original kept next to it.
- Artwork conditioning (canvas-edge crop, depth map) — a small local script.

## Handing over

Save the picture in the working folder with a descriptive name, and next to it
a `.md` with where it came from (the page URL, the artist or photographer, the
licence line the source gave). Open the file and look at it before showing it,
then show the user.

---

*Part of the free [AICB content skills](https://github.com/corj1k/aicb-content-skills). What a skill alone cannot do — reads of X / Reddit / Instagram / Google as tools, monitoring, posting from your own browser, the timeline, a render box — is [AICB](https://aicb.notpeople.ai).*
