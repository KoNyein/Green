# Project TODO

- [x] Create the brutalist black, white, and red global visual system with responsive accessibility defaults.
- [x] Build a mandatory client-side 21+ acknowledgment gate that blocks the public storefront until explicitly confirmed.
- [x] Add seed/farm-product access controls in the UI and server procedures that require an age-gate session record.
- [x] Add the public Gwave storefront layout, primary navigation, footer policy links, and responsive mobile navigation.
- [x] Add a Three.js interactive industrial hero scene with a reduced-motion fallback.
- [x] Build featured product, latest news, and service-shortcut home sections.
- [x] Add a relational data model for products, variants, stock, strains, news posts, orders, payment slips, order-status audits, and age acknowledgments.
- [x] Build searchable, filterable product catalogue pages that separate restricted Seeds/Farm Products from open Brand Shop merchandise.
- [x] Build product detail pages with merchandise size/color variants, size charts, stock status, and cart actions.
- [x] Build strain knowledge library pages with Verified Facts, Supplier Description, Educational Note, and Legal Notice sections.
- [x] Build Newsfeed categories and enforce the Draft → Review → Approved → Published editorial workflow server-side.
- [x] Build About Gwave, Our Services, contact form, order-reference inquiry, privacy, terms, refund, and shipping-policy pages.
- [x] Build protected customer order creation, address capture, email/phone capture, and order-status tracking flows.
- [x] Add protected bank-transfer slip uploads using private S3 object keys, staff-only retrieval procedures, and expiry metadata after order completion.
- [x] Add auditable server-side order-status transitions and staff/admin role controls.
- [x] Add owner notifications for new orders, payment-slip uploads, and order-status changes.
- [x] Build an authenticated staff/admin console using the supplied dashboard layout for content review, order management, and slip review.
- [x] Add Vitest coverage for age access, editorial state transitions, private-slip authorization, and order-status audit logging.
- [x] Run type checks, tests, and visual responsive verification.
- [x] Add deployment and Android packaging documentation, including the Google Cloud alternative and its required configuration.
- [x] Connect homepage featured-products and latest-news panels to live published catalogue and editorial data.
- [x] Add customer-facing catalogue search and merchandise filtering controls.
- [x] Carry selected product and variant into checkout and provide a local cart action from product detail.
- [x] Add a staff payment-slip review queue that uses the private signed retrieval procedure.
- [x] Add Vitest procedure-level coverage for age acknowledgement, editorial publication, and payment-slip audit creation.
- [x] Add source-aware THC range, CBD range, and effect-profile fields to strain records.
- [x] Add validated server-side THC, CBD, and effect-profile query filters for published strain records.
- [x] Add responsive strain-library controls for THC, CBD, and effect-profile filtering with clear no-result states.
- [x] Add tests for the THC, CBD, and effect filtering rules and verify the updated library visually.
- [x] Ensure the checked-in strain-profile migration includes every new field and is safe for fresh deployments.
- [x] Verify the completed THC/CBD/effect test suite and visual library layout before delivery.
- [x] Add source-verified COA metadata, result-summary, approval, and public-visibility fields for strain records.
- [x] Add staff-only COA review controls and public read rules that expose only approved verified summaries.
- [x] Add a responsive Verified COA section to individual strain detail pages.
- [x] Add tests for COA approval visibility and verify the public COA presentation.
- [x] Verify the public Verified COA section's safe empty state and private-key omission; real approved COA visual verification remains pending until the business supplies a record, with no laboratory data fabricated.

- [x] Inspect and map strain data from src/app/(knowledge)/strains into Gwave’s strain library without fabricating verification fields.
- [x] Import compatible strain records with source labels and safe publication status.
- [x] Validate imported strain records, filters, and detail-page presentation.
- [x] Add source-import tests and save a checkpoint after validation.

- [x] Obtain the actual source project or ZIP containing src/app/(knowledge)/strains; current Gwave workspace and selected GitHub repo do not contain it.
- [x] Expand the requested Gwave requirements into explicit data fields and implementation acceptance checks.
- [x] Batch-import the supplied 2,000+ strain records after source inspection, with deterministic mapping and duplicate handling.
- [x] Validate imported records, filters, source labels, and detail-page rendering, then save an import checkpoint.

- [x] Inventory and import strain records from https://github.com/KoNyein/gwave.ai/tree/main/src/app/(knowledge)/strains after retrieving the source repository.

- [x] Apply source-approved status to imported strain records while keeping COA status unapproved until real lab evidence is supplied.
- [x] Validate source-approved record visibility, THC/CBD/effect filter behavior, and COA separation.
- [x] Save an import checkpoint after the approval-scope update.

- [x] Use the provided Gwave logo image as the brand logo and icon across the site.
- [x] Replace the current red accent theme with a consistent green palette across the public UI and staff surfaces.
- [x] Upload/reference the logo safely, update metadata, and validate desktop/mobile rendering.

- [x] Verify the green accent treatment on staff/admin dashboard and COA review surfaces.
- [x] Run explicit mobile viewport verification for the logo, header, and age gate, then record the result.

- [x] Record authenticated staff/admin session check as deferred by the user; current validation confirms source-level green tokens and the protected unauthenticated boundary only, and no admin login was performed.

- [x] Define the green Gwave product-photo and social-preview asset set without fabricating unavailable product details.
- [x] Generate or prepare green-brand merchandise/product and social-preview assets, then upload them to lifecycle storage.
- [x] Integrate the branded assets into storefront cards, collection areas, and social metadata with responsive validation.
- [x] Save a checkpoint after visual asset integration.

- [x] Add branded imagery to the home featured/collection area, not only product cards.
- [x] Run desktop and mobile screenshots after visual asset integration and record the result.

- [x] Add a truthful promotional banner to the Home Brand Signal collection section.
- [x] Add green-brand social campaign copy with platform-ready headline, body, CTA, and disclosure-safe placeholders.
- [x] Verify the banner and campaign copy on desktop/mobile and save a checkpoint.

- [x] Run an inspectable desktop top-viewport verification of the Home Brand Signal banner and campaign copy without hiding the entry overlay.
- [x] Confirm mobile banner/copy presentation with evidence that shows the campaign surface after access is available.
- [x] Save a new checkpoint after promotional banner validation.

- [x] Audit mobile, tablet, and desktop layouts for navigation, age gate, hero, Brand Signal banner, catalogue, filters, checkout, and content pages.
- [x] Fix responsive overflow, wrapping, spacing, image crop, and touch-target issues found during the audit.
- [x] Verify representative routes at phone, tablet, and desktop viewports and save a responsive checkpoint.

- [x] Audit `/store`, `/knowledge`, `/checkout`, and a content/detail route at phone, tablet, and desktop breakpoints.
- [x] Apply and verify concrete responsive fixes on catalogue, filters, checkout, hero/banner, and content/detail layouts.
- [x] Save a new checkpoint after the representative-route responsive audit is complete.

- [x] Apply explicit component-level responsive fixes in GwavePages.tsx for catalogue/filter, checkout, hero/banner, and strain detail layouts.
- [x] Re-run representative route verification across phone, tablet, and desktop after component-level fixes.
- [x] Save a new checkpoint after component-level responsive fixes are validated.


## English / Myanmar Language Support

- [x] Audit all public, age-gate, customer, knowledge, checkout, newsfeed, and staff/admin UI copy for language coverage.
- [x] Add persistent English/Myanmar language state with an accessible global language switcher.
- [x] Add translation dictionaries for navigation, public pages, age gate, catalogue, filters, product detail, checkout, orders, newsfeed, policies, and admin/COA surfaces.
- [x] Connect translated UI labels, buttons, forms, errors, empty states, and status messages without translating source data or private customer documents automatically.
- [x] Add Burmese typography and responsive layout safeguards for longer translated strings.
- [x] Add Vitest coverage for dictionary fallback, language persistence, and key translated labels; run TypeScript check, tests, and production build.
- [x] Verify English and Myanmar rendering on phone, tablet, and desktop, then save a language-support checkpoint.


## Help Center and User Guide

- [x] Define Help Center information architecture for public users, customers, restricted-channel users, and staff/admins.
- [x] Add English/Myanmar help content for age gate, account access, merchandise, restricted products, strain knowledge, COA, checkout, payment slips, shipping, refunds, privacy, and support.
- [x] Add a searchable/sectioned Help Center route with FAQ accordions and clear links into relevant workflows.
- [x] Add contextual Help links from navigation, age gate, Store, Knowledge, Checkout, Orders, and staff/admin surfaces.
- [x] Ensure help content does not expose private payment slips, COA documents, customer data, or restricted operational details.
- [x] Verify Help Center and User Guide in English/Myanmar at phone, tablet, and desktop widths with accessibility and fallback coverage.


## Roadmap Website Experience

- [x] Convert the supplied Myanmar roadmap into a public-facing Gwave roadmap/trust content experience without fabricating compliance or laboratory evidence.
- [x] Add bilingual roadmap sections for launch readiness, trust/COA operations, commerce growth, mobile/scale, risks, KPIs, and the 90-day plan.
- [x] Add a public Roadmap/Trust route and contextual navigation links while preserving the mandatory age gate and restricted-product boundary.
- [x] Keep roadmap content separate from customer private documents, payment slips, source-approved strain data, and staff-only operational actions.
- [x] Verify the roadmap website experience at phone and desktop widths and run TypeScript, Vitest, and production build checks.
- [x] Save a checkpoint after the roadmap website experience is validated.


## Language Quality Follow-up

- [x] Complete explicit component-level i18n wiring for primary workflow copy in GwavePages.tsx, policy/order flows, newsfeed, and admin/COA surfaces.
- [x] Replace the global document.body runtime translation walker with targeted component-level translations that cannot affect source, customer, or private document text.
- [x] Add Vitest coverage for localStorage language persistence, provider initialization, fallback behavior, and representative translated workflow labels.
- [x] Run and record final English/Myanmar verification for key language surfaces at phone, tablet, and desktop widths after final i18n changes.
- [x] Verify Help Center on tablet as well as desktop/mobile, including native keyboard-accessible search/FAQ controls, then save a dedicated language checkpoint.


## Final i18n Verification Gaps

- [x] Finish explicit component-level translation wiring for remaining AdminOperations and CoaOperations copy, then re-run validation.
- [x] Add a testable LanguageProvider initialization contract and representative rendered-label coverage for key workflows.
- [x] Expose safe development-only content previews for final bilingual verification of Help, Store, Knowledge, Checkout, Orders, and Roadmap without weakening production age gating; remove previews before checkpoint.
- [x] Verify Help Center content on tablet with search and native keyboard-accessible FAQ interaction evidence, record the result, and save a dedicated language-support checkpoint.


## Dedicated Language Checkpoint Follow-up

- [x] Complete explicit translation wiring for all remaining hard-coded copy in AdminOperations and CoaOperations, including explanatory text, placeholders, errors, empty states, and action labels.
- [x] Add Vitest coverage for LanguageProvider initialization behavior and at least one rendered translated workflow label/component contract.
- [x] Save a dedicated language-support checkpoint after final Help Center and bilingual verification work.


## Gwave Presentation Deck

- [x] Define the presentation audience, purpose, and core Gwave messages.
- [x] Write a Myanmar slide-by-slide content outline covering brand, platform, trust/compliance, bilingual support, Help Center, roadmap, and next actions.
- [x] Generate a professional Gwave-branded presentation deck within the 12-slide limit.
- [x] Review slide readability, Burmese typography, content density, and visual consistency before delivery.


## Marketing and User Acquisition Plan

- [x] Define Gwave target audiences, brand positioning, channel boundaries, and 21+ compliance-safe marketing rules.
- [x] Design the acquisition funnel from discovery to age-gated entry, account acknowledgement, product/knowledge engagement, checkout, and repeat use.
- [x] Create organic content pillars for Brand Signal, strain knowledge, trust/COA education, Help Center, services, and responsible commerce.
- [x] Define channel-specific campaigns, community partnerships, referral/retention ideas, and disclosure-safe creative rules.
- [x] Define KPI framework, measurement events, weekly reporting cadence, experiments, and a 90-day launch plan.


## Production Environment and Security Setup

- [x] Inventory required production environment variables and classify them as public configuration or server-only secrets.
- [x] Document authentication, JWT, OAuth callback, database, S3 storage, owner notification, analytics, and application identity setup.
- [x] Define HTTPS, cookie, CORS, upload, rate-limit, role-based access, audit-log, and private-document controls.
- [x] Define deployment, monitoring, backup, restore, secret rotation, and incident-response checks.
- [x] Deliver a Myanmar production setup checklist with explicit pre-launch verification steps.


## Android APK Gradle and Signing Guide

- [x] Define Gwave Android package identity, WebView/Capacitor assumption, supported SDK levels, and production endpoint requirements.
- [x] Document Gradle project, build types, signing config, AndroidManifest, network security, and release optimization settings.
- [x] Document secure keystore generation, alias/password handling, backup, rotation, and CI secret injection.
- [x] Document debug/release APK and Play Store AAB build commands, artifact inspection, signing verification, and device smoke tests.


## Google Play Store Listing and Submission

- [x] Research current Google Play Console listing, graphic, screenshot, privacy, data safety, and app-content requirements from official sources.
- [x] Write Gwave store listing metadata and compliance-safe English/Myanmar positioning copy without making unsupported product or legal claims.
- [x] Define phone/tablet screenshot capture plan, icon/feature graphic requirements, captions, and safe visual content rules.
- [x] Document privacy policy URL, Data safety form inputs, target audience/content declarations, app access instructions, and release checklist.


## Google Play Policy Alignment Discussion

- [x] Reconcile current Gwave Android features with the official marijuana-sale restriction and identify policy-risk functions.
- [x] Compare companion-app, commerce-disabled Android build, and non-Play distribution options.
- [x] Define safe app positioning, navigation/data boundaries, server capability flags, and reviewer-facing declarations.
- [x] Document a recommended decision, residual risks, and pre-submission policy review steps.


## Presentation QA Follow-up

- [x] Explicitly document the presentation target audience, purpose, and core Gwave messages in the presentation content file.
- [x] Run and record a final review pass for all 12 slides covering Burmese readability, typography, content density, and visual consistency before marking presentation QA complete.


## Presentation QA Follow-up

- [x] Explicitly document the presentation target audience, presentation purpose, and core Gwave messages in the presentation content file.
- [x] Run and record a final review pass for all 12 slides covering Burmese readability, typography, content density, and visual consistency before marking presentation QA complete.


## GwavePages Syntax Fix

- [x] Inspect and resolve the reported GwavePages.tsx parser error at the AdminOperations workflow block.
- [x] Run TypeScript check, Vitest suite, and production build after the syntax validation.


## Strain Infographic and Sales UX Redesign

- [x] Audit current Knowledge strain detail/library presentation, product catalogue, product detail, checkout, orders, and staff sales surfaces.
- [x] Add source-safe strain infographic sections for profile facts, THC/CBD, effects, usage context, evidence/source status, COA status, and legal/educational notices without fabricating medical or laboratory claims.
- [x] Improve customer storefront UX with clearer channel boundaries, search/filter hierarchy, product detail media/variants/stock, cart summary, checkout steps, and upload/status guidance.
- [x] Improve staff/backend sales UX with order queue filters, payment-slip review states, status transition controls, audit context, empty/loading/error states, and private-document safeguards.
- [x] Verify phone/tablet/desktop responsive behavior, accessibility, TypeScript, Vitest, and production build; save a checkpoint after validation.


## Public Source Display Privacy

- [x] Remove GitHub repository names, URLs, raw-source links, and imported-source wording from public Knowledge/Strain UI.
- [x] Replace public source details with neutral labels such as source-reviewed, source-approved, or laboratory-verified COA, without fabricating verification.
- [x] Preserve internal provenance, audit metadata, and staff-only source references for traceability and compliance.
- [x] Add/update tests and run responsive visual checks, TypeScript, Vitest, and production build.


## Product Gallery and Stock Reservation

- [x] Audit product schema, catalogue procedures, product detail UI, and checkout stock behavior.
- [x] Add product gallery metadata and responsive thumbnail/lightbox-style detail presentation using lifecycle-managed assets.
- [x] Add server-side stock reservation with expiry, ownership/session binding, release/consume rules, and oversell protection.
- [x] Integrate reservation state into product detail, cart/checkout, order creation, and staff visibility without exposing private data.
- [x] Add tests and run TypeScript, Vitest, production build, and phone/tablet/desktop verification before checkpoint.


## Staff Product Image Management

- [ ] Add staff/admin-only product image upload procedure using managed storage, MIME/type/size validation, and safe metadata handling.
- [ ] Add staff/admin product image list, reorder, cover-image, publish/unpublish, and delete procedures with authorization and audit context.
- [ ] Build bilingual dashboard image manager UI with product selection, upload state, previews, ordering controls, cover toggle, publication status, and delete confirmation.
- [ ] Ensure deleted/unpublished images do not appear in public galleries and private storage references remain protected.
- [ ] Add Vitest coverage and run TypeScript, production build, and responsive staff dashboard validation before checkpoint.


## Staff Product Image Manager Follow-up

- [x] Add staff/admin-only product list and product image query procedures.
- [x] Add secure JPG/PNG/WebP upload validation with S3 storage and alt-text metadata.
- [x] Add staff controls for gallery ordering, publish visibility, and image removal.
- [x] Add bilingual responsive Admin Console image manager UI with empty/error/loading states.
- [x] Add Vitest coverage for staff authorization and S3-backed image metadata writes.
- [ ] Perform authenticated staff visual audit when a real staff/admin login session is available.
- [x] Add background expiry release job for expired stock reservations (callback handler implemented; production cron registration requires deployment).
- [x] Add staff order queue date-range filtering and CSV export.
- [x] Replace placeholder imagery with approved branded product photography using the Staff Image Manager-compatible Brand Signal photography URLs.
- [ ] Configure Google Cloud project ID and finalize Android signing configuration.

## Staff Product Image Manager Delivery Validation

- [x] TypeScript check passes after server and UI integration.
- [x] Vitest suite passes with 24 tests across 9 files.
- [x] Production build verification remains to be run after the image manager changes.
- [x] Authenticated staff visual audit remains explicitly deferred because no staff login session was available.
- [x] Product image deletion removes the database gallery reference; underlying S3 objects remain lifecycle-managed and are not exposed publicly through the gallery.


## Visual Design Refinement Follow-up

- [x] Replace oversized mobile full-screen menu with a refined compact navigation drawer and clearer hierarchy.
- [x] Redesign EN/Myanmar language switcher for a cleaner premium segmented-control treatment across header, mobile menu, and age gate.
- [x] Refine global mobile spacing, typography scale, borders, and CTA hierarchy based on the supplied mobile reference.
- [x] Replace nature/forest-like Three.js visual treatment with an abstract industrial signal object and restrained motion.
- [x] Validate the redesigned navigation and hero at mobile and desktop breakpoints, then save a checkpoint.


## Dark Mode Toggle Follow-up

- [x] Audit the existing theme provider and global color tokens for light/dark mode compatibility.
- [x] Add a persistent accessible dark-mode toggle to desktop header, mobile navigation, and the 21+ age gate.
- [x] Preserve the industrial black/lime visual hierarchy while providing a readable light mode.
- [x] Add/adjust tests for theme persistence and toggle semantics.
- [x] Validate theme switching at mobile and desktop breakpoints, then save a checkpoint.


## Industrial Motion and 3D Emphasis Follow-up

- [x] Audit current hover, pointer, and reduced-motion behavior across public UI and Three.js hero.
- [x] Add restrained industrial hover animations to navigation, cards, CTAs, and product imagery.
- [x] Increase Three.js hero 3D element prominence with stronger depth, lighting, and controlled interaction.
- [x] Preserve reduced-motion and mobile performance safeguards.
- [x] Validate motion, 3D visibility, and responsive presentation, then save a checkpoint.


## 3D Loading State Follow-up

- [x] Audit the current Three.js initialization and fallback behavior.
- [x] Add an industrial lime signal loading animation and status treatment for the 3D hero.
- [x] Add resilient fallback behavior for WebGL failure and reduced-motion users.
- [x] Validate the loading state and production build, then save a checkpoint.


## 3D Reveal Transition Follow-up

- [x] Audit the current loader-to-canvas state transition.
- [x] Add a smooth staged 3D reveal with opacity, scale, depth, and restrained stagger timing.
- [x] Preserve reduced-motion and mobile performance behavior.
- [x] Validate the transition and production stability, then save a checkpoint.


## Scroll-linked 3D Motion Follow-up

- [x] Audit the current Three.js lifecycle and scroll-safe performance hooks.
- [x] Add smooth scroll-linked rotation, parallax, and depth motion to the industrial 3D hero.
- [x] Preserve reduced-motion, touch/mobile, and cleanup safeguards.
- [x] Validate scroll animation and production stability, then save a checkpoint.


## Three.js Performance Optimization Follow-up

- [x] Audit renderer, scene complexity, and animation loop.
- [x] Implement GPU-conscious Three.js optimizations.
- [x] Validate frame-safe behavior and production stability.

Validation: device-pixel-ratio cap, mobile antialias reduction, high-performance renderer hint, reduced ring/bar complexity, offscreen IntersectionObserver pause, document visibility pause, listener cleanup, TypeScript check, 25 Vitest tests, production build, and mobile preview all completed. Existing large-chunk advisory remains non-blocking.


## GitHub Pull Request Follow-up

- [ ] Inspect the selected GitHub repository, current branch, remote, and working-tree state.
- [ ] Prepare a reviewable branch and commit the latest Gwave changes without including secrets or generated build output.
- [ ] Open a GitHub pull request with a concise summary, validation results, and any known advisory.
