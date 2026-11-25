# Vita Pure IV homepage revamp: port checklist

For porting this mockup into the WordPress theme. Every section in `index.html` carries a `[REVAMP:…]` or `[KEPT]` comment, and `css/styles.css` uses the same section names.

**Files**
- `index.html`: page markup.
- `css/styles.css`: all styles.
- `js/main.js`: vanilla JS, one function per behavior.
- `assets/img/`: client photos copied from vitapureinfusions.com. Each `<img>` has a `source:` comment with its original upload URL.

## Page order (top to bottom)

| # | Section | Status | Notes |
|---|---------|--------|-------|
| 1 | Announcement bar | KEPT | "$20 off your first IV therapy treatment" → /coupons/ |
| 2 | Header | KEPT + CHANGED | Same utility links and Wellness / Face / Body menu. The **logo moves to the left** and the menu runs on one line (the live site splits it around a centered logo). **Book now** stays in the sticky header. The logo and Home link point at www.vitapureinfusions.com; the live site points them at the wpengine staging domain. Medical Weight Loss is added under Wellness. |
| 3 | Hero | CHANGED | Replaces the 3-slide slider and the "Health, Wellness, and Performance Solutions" block. The power statement is **"Come as you are, leave as your best self."** The positioning line is **"Wellness and Med Spa Services"** (was "Med Spa and Wellness"). The hero has two buttons: Book now and Find your treatment. |
| 4 | What you're looking to improve | ADDED | Placed directly under the hero. It has 6 concerns, each routed to Wellness, Face, or Body. The group buttons filter the list. Hovering a concern swaps the photo; clicking one scrolls to its tile and highlights it. |
| 4b | Body map (index.html only) | CHANGED | In index.html, the photo, concern list, and group buttons are replaced by a photo of a woman with 6 dots: Face, Arms & underarms, Wellness (inner arm, where an IV goes), Stomach & waist, Pelvic floor, and Thighs, buttocks & legs. Hovering, focusing, or tapping a dot shows that area's concerns and treatment links in the panel beside it. "See all … treatments" scrolls to and highlights the matching tile. Dots are placed with `--x` / `--y` (percent of the photo). The photo is an Unsplash stock placeholder (`improve-body-map.jpg`); if it's replaced, re-check the dot positions. index2.html keeps the list version. |
| 5 | Wellness / Face / Body tiles | CHANGED | Replaces the 8 rounded navy cards and the "Med Spa and Wellness Services / View all services" block. The tiles touch edge to edge (`gap: 0`) and have square corners. Each tile reveals its treatment list on hover or focus in a **light panel** (white glass, navy text, gold top rule) instead of dark blue. On touch screens the list is always shown. |
| 6 | Authority banner | ADDED | A linear banner: 4.9 rating (92 reviews), 18+ staff, 50+ combined years, 3,000+ clients. All figures come from the live site. |
| 7 | Why choose Vita Pure | CHANGED | Merges the old 3-icon "Why Choose" row with the "Premier MedSpa" block, next to the team photo. |
| 8 | Google reviews | CHANGED | Two rows: row 1 moves left, row 2 moves right. It pauses on hover or focus and has a Pause/Play button. It goes static when the visitor has reduced motion turned on. |
| 9 | Resources | KEPT + MOVED | The same 3 blog posts, moved to the bottom. |
| 10 | Closing CTA | CHANGED | Replaces the second contact form. Headline "Your best self starts with one visit", three numbered first-visit steps (book, meet your provider, relax in your suite), Book your visit + call/text, and the two live offers: $20 off first IV and Cherry financing. Uses the live "Why Choose" IV photo. |
| 11 | Footer | KEPT + CHANGED | "HIPPA" is fixed to "HIPAA". Service areas are now plain text; the live links were "#" placeholders, and the Midlothian link was broken. |

## Removed from the homepage
- Both **"Let's Discuss Your Treatment Plan!"** forms.
- The "Join the Waitlist" hero button (it pointed to the separate waitlist.vitapuremedspa.com domain).
- The three feature tiles ("Get Hydrated", "Transform Your Look", "Book Now").
- The standalone stats counter (its numbers now live in the authority banner) and the logo_banner image.
- "4100+ pounds of fat lost" is not in the banner. It can come back as a 5th column.

## Open items before launch
- [ ] **Reviews:** connect the live Google reviews feed or widget. The cards are currently the 5 testimonials already on the live homepage, verbatim. Confirm the review count (92).
- [ ] **Wellness and Body tile photos are Unsplash stock placeholders** (free Unsplash License), chosen to show women: a guest in a robe in a spa suite (Wellness) and a provider treating a woman's abdomen (Body). Replace them with the client's own photos when available. The Body photo shows bare skin, so confirm it with the client first: their PDF flagged "too much skin" on the reference site.
- [ ] **Category landing pages:** Wellness, Face, and Body are "#" in the live menu. The tile titles link to /services/ until real pages exist.
- [ ] **Office hours:** not on the live site; add them to the footer if wanted.
- [ ] **Fonts:** Outfit is the live body font and is kept. Marcellus is new, for headings only. Enqueue it in WordPress.
- [ ] **Hopewell:** does not appear anywhere in this mockup. Also check the theme's footer and widget areas when porting.

## Design notes
- **Colors** come from the live theme: navy `#122947`, gold `#94731c`, and light gold `#c2a557`. White button text needs the darker gold `#8a6a14` to meet AA contrast; the brand gold reaches only 4.44:1.
- **No rounded corners** anywhere, per the client.
- **Hovers are light**, per the client: gold buttons hover to light gold `#c2a557` with navy text, and the tile panels hover to white.
- **The concern list has no 01–06 numbers**, unlike the reference site. The concerns aren't a sequence; each row carries its Wellness/Face/Body tag instead.
- **Motion is limited** to the hero's load-in and the reviews marquee. Both respect reduced-motion settings.

## index2.html: Figma style variant
`index2.html` has the same layout, content, and JS as `index.html`. It loads `css/theme-figma.css` after `css/styles.css` and takes its look from the Figma file "Vita Pure [C]":
- **Type:** DM Sans, light and tightly tracked, for headings and body. Instrument Serif italic for accent words.
- **Color:** navy `#13294b`, cream `#f7f5f0`, and sand `#efe9e1`. Gold is `#8a6d1f`, or `#7a5f17` for small text. Pill buttons are sky blue `#dce7f7`.
- **Components:**
  - Pill buttons with a round arrow icon.
  - Small tracked-caps section labels with a rule before them.
  - Rounded cards and photos.
  - Reviews on a navy section with glassy cards and faded edges.
  - Gold italic step numbers.
- **Square-tile exception:** the Wellness / Face / Body tiles stay square and gapless, per the client's earlier request.
- **Small markup additions:** button arrow icons, section labels, `<em class="accent">` words in headings, a rating chip in the hero, icons on the "Why choose" points, and a "Claim offer" pill in the announcement bar.
- **Logo:** `logo.png` has a white background, so index2 blends it into the cream with `mix-blend-mode: multiply`. Ask the client for a transparent PNG or an SVG logo.
