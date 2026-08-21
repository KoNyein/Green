# Visual Verification Notes

## 2026-08-20 — Entry Gate

The public entry route rendered the Gwave 21+ access gate with a visible unchecked acknowledgement checkbox and a disabled entry action. After the checkbox was explicitly selected, the entry action became active. This confirms that passive arrival is insufficient and an affirmative user action is required before storefront access.

## 2026-08-20 — Public Storefront

After acknowledgement, the home page rendered the black/white/red brutalist identity, oversized display typography, primary navigation, a working Three.js industrial hero scene, and all expected public service links. The Store route rendered a clearly separated merchandise area and a distinct Seeds/Farm Products panel that required sign-in before restricted catalogue access.

## 2026-08-20 — Final Public UI Check

The final desktop home check confirmed the live featured-product and latest-news panels are bound to published backend data and surface clear empty states before staff has published any records. An isolated mobile screenshot was captured before client hydration had completed, so mobile interaction still requires a manual device pass before a production launch; the responsive mobile markup and age-gate layouts are implemented in the application.

## 2026-08-20 — Strain Profile Filters

The Knowledge Library rendered dedicated THC minimum/maximum, CBD minimum/maximum, and effect-profile controls with the required source-aware explanatory copy. Selecting the `creative` effect activated the filter and rendered the distinct no-result state, which explains that unverified profile data is intentionally excluded. The live database verification confirmed all source, profile-range, effect-tag, and review-date columns exist.

## 2026-08-20 — COA Verification Access

The dedicated COA verification desk route is protected by the authenticated dashboard boundary. An unauthenticated browser session was presented with the sign-in screen rather than any COA queue, metadata, private document reference, or staff action. Public strain detail code requests only an approved COA summary and explicitly omits the private document key.

## 2026-08-20 — Source Strain Import

The source repository `KoNyein/gwave.ai` was cloned and its generated `supabase/seed/knowledge_seed.sql` contained 2,001 unique parsed strain rows from the 2,000+ source dataset. All imported rows were published only after the owner approval instruction, with `profileReviewedAt` set and no approved COA records attached. The Knowledge Library rendered OG Kush, Sour Diesel, Blue Dream, and the remaining imported records through the live query. THC/CBD/effect filters returned source-approved records, and the OG Kush detail page showed the source-backed profile with explicit `COA not attached` legal text. The public page did not expose private COA document keys.

## 2026-08-20 — Green Brand Refresh

The supplied Gwave leaf logo was refined into a green transparent asset, uploaded to lifecycle storage, and used in the header, footer, age gate, favicon, and brand lockups. The red UI accent was replaced with `#8bd32c` across the public surfaces and Three.js hero edge/light accents. Desktop and explicit 390×844 mobile screenshots confirmed the logo, green access bar, checkbox gate, CTA, and responsive lockup remain readable. The staff/admin route is protected by the same access boundary; its source contains no remaining red accent token.

## 2026-08-20 — Green Merchandise Visual Set

Generated a green-brand merchandise visual set for the Gwave T-shirt, footwear, cap/cup/bottle collection, plus square and wide social-preview campaign images. The storefront product cards now select the appropriate product image by merchandise name, the home page includes a green collection campaign section, and Open Graph/Twitter metadata references the wide social image. Desktop and 390×844 mobile route screenshots after integration confirmed the updated logo, green brand accent, and responsive 21+ entry surface remain readable. The product collection itself remains behind the mandatory gate in the verification browser state.

## 2026-08-20 — Brand Signal Promotion

The Home Brand Signal banner now presents the truthful campaign line “Wear the signal. Carry the standard.”, a green `New / Brand Signal 001` label, an `Explore collection` CTA, an `About Gwave` secondary CTA, and the hashtags `#Gwave #BrandSignal #RawVerified`. The desktop full-page capture intentionally hides fixed entry chrome, so the full-page surface appears black while the mobile top-viewport capture visibly confirms the green logo, 21+ gate, readable CTA, and brand copy hierarchy. TypeScript, all 15 tests, and production build pass.

The temporary development-only `/__preview/brand-signal` route provided an inspectable desktop verification without the mandatory age overlay. The full-page render visibly showed the `WEAR THE SIGNAL.` banner, `New / Brand Signal 001` label, green CTA, `About Gwave` link, campaign line, and hashtags. The temporary route is for local visual verification only and is disabled in production by `import.meta.env.DEV`.

The full-page 390×844 preview showed the Brand Signal banner stacking correctly on mobile: the green campaign label, `WEAR THE SIGNAL.` headline, collection CTA, `ABOUT GWAVE` link, campaign line, and hashtags remained visible without horizontal overflow. The campaign image crops into a tall visual panel while preserving the green/black identity.

## 2026-08-20 — Responsive Layout Audit

Phone (390×844) verification confirmed the logo lockup, 21+ acknowledgement copy, checkbox, full-width CTA, and legal notice fit without horizontal overflow. Tablet (768×1024) verification confirmed the gate transitions into a two-column content/action layout with readable spacing and a stable green accent frame. Global `overflow-x: clip`, responsive image sizing, visible focus rings, tap-highlight removal, and mobile navigation actions for Sign in/Contact are now in place.

Desktop (1440×900) verification confirmed the gate remains centered with a clear two-column hierarchy, readable logo lockup, green action button, and generous negative space. The full responsive set now covers phone, tablet, and desktop entry states.

## 2026-08-20 — Representative Route Responsive Audit

Development-only preview routes were used for safe visual checks without weakening the production age gate. Desktop and 390×844 mobile captures covered Store, Knowledge, Checkout, and the OG Kush strain detail route. Store controls stack cleanly on mobile, checkout changes from two columns to separate item/delivery cards with full-width inputs and CTA, and the strain detail card/sections wrap without horizontal overflow. The mobile header keeps the logo and menu within the viewport; the detail page preserves source, legal, and COA-separation notices. The knowledge preview showed a loading state in one capture while data was resolving, so the layout—not the transient network state—was evaluated.

Tablet (768×1024) representative-route captures confirmed the catalogue search/filter row stays in one readable line, checkout fields and CTA use the available width without overflow, and the strain profile facts/details switch into a balanced two-column presentation with long source URLs visually contained by the page layout. The knowledge list may show a transient loading state while live data resolves; the detail route remains readable after data loads.

## 2026-08-20 — Component-level Responsive Fixes

After explicit page-component changes, desktop captures confirmed the Store hero heading, catalogue search/filter controls, Checkout title and two-panel form, Brand Signal campaign heading, and strain detail typography remain contained and readable. Long source references in the strain detail use break-word behavior, while the two-column content remains clear at desktop width.

The updated 390×844 captures confirmed smaller mobile display headings, stacked Store search/featured controls, contained checkout fields and CTA, and readable strain profile/details without horizontal overflow. The OG Kush long source links wrap within the content column, and the legal notice remains visibly separated by the green border.

The updated 768×1024 captures confirmed the component-level breakpoint behavior: catalogue search and featured controls sit side-by-side without clipping, checkout selection and delivery panels use the available tablet width, and strain detail facts form a readable two-column grid with the legal notice highlighted. The responsive headline scale remains bold without viewport overflow.

## 2026-08-20 — Help Center and Language Support

Added a `/help` Help Center/User Guide route with English/Myanmar topic content covering access and safety, Store channels, Knowledge/COA, Orders/Delivery, and Staff/Support. The global language switcher persists the selected language in local storage and updates the document language attribute. The switcher is available in the public header, mobile navigation, age gate, and authenticated dashboard profile menu.

Desktop (1280px) verification showed the help topics forming a clear two-column information grid with search, FAQ accordions, support CTAs, and footer Help navigation. Mobile (390px) verification showed a single-column flow with contained long strings, readable accordion labels, and no visible horizontal overflow.

## 2026-08-21 — Roadmap Website Experience

Converted the supplied `gwave-future-roadmap-mm.md` into a public `/roadmap` Roadmap & Trust page with bilingual English/Myanmar sections for the four delivery phases, release gates, source/COA responsibility, KPI categories, and the 90-day direction. Added Roadmap links to the public header/footer and preserved the existing age-gated router; the route is not a restricted catalogue surface.

Desktop (1280×900) verification showed a strong industrial hierarchy, four-phase grid, release-gate checklist, responsibility cards, KPI row, and final CTA panel. Mobile (390×844) verification showed the sections stacking into readable cards with contained text, compact CTAs, and no visible horizontal overflow. Temporary development-only preview routing was used for inspection and will be removed before checkpoint validation.


## 2026-08-21 — Final bilingual entry-surface verification

The final desktop capture covered `/`, `/help`, and `/roadmap` at 1280×720. All three public routes correctly remained behind the mandatory 21+ access gate, and the English/Myanmar switcher, green Gwave logo, consent control, and readable entry CTA remained visible without overflow. Because the production router intentionally preserves the access boundary, protected Help/Roadmap content was not exposed by this screenshot operation; the earlier Help desktop/mobile content verification remains recorded above.


Tablet (768×1024) final entry-surface capture confirmed the age-gate card, bilingual switcher, green logo, consent copy, CTA, and legal notice remain contained and readable across `/`, `/help`, and `/roadmap`; the production gate remained active on all three routes.


Phone (390×844) final entry-surface capture confirmed the English/Myanmar switcher, Gwave logo, 21+ consent text, checkbox, full-width CTA, and legal notice remain readable and contained without horizontal overflow. The protected content routes stayed behind the mandatory gate as designed.


## 2026-08-21 — Actual bilingual content preview verification

Development-only preview captures exposed the actual content surfaces without bypassing production routing. Desktop (1280×900) covered Help, Store, Knowledge, Checkout, Orders, and Roadmap. Tablet (768×1024) showed Help search and FAQ cards, Store controls, Knowledge filters/results, Checkout delivery fields, Orders empty state, and Roadmap phase cards with no visible horizontal overflow. English mode remained readable, and native inputs/details controls preserved their browser keyboard semantics. These preview routes must be removed before the language checkpoint.


Phone (390×844) actual-content preview confirmed Help search, Store filters, Knowledge THC/CBD/effect controls, Checkout fields, Orders empty state, and Roadmap phase content stack cleanly with long English/Myanmar-capable layout and no visible horizontal overflow. Help search uses a native input and FAQ topics use native disclosure controls, preserving keyboard focus/activation semantics.
