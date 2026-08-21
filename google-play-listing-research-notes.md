# Google Play Store Listing Research Notes

## Official sources reviewed

1. **Best practices for your store listing** — https://support.google.com/googleplay/android-developer/answer/13393723?hl=en
   - Short description: 80 characters or less.
   - Full description: up to 4,000 characters.
   - Listing copy must accurately describe functionality/content, be concise, general-audience appropriate, and avoid misleading claims, rankings, discounts, pricing promotions, unattributed testimonials, and unrelated brand references.
   - App title must be 30 characters or less and must not mislead users or promote deals/rankings.
   - Graphics should use consistent/complementary styles, minimize text, keep important elements centered for scaling, and avoid violence, sexually suggestive content, rankings, pricing/promotion language, and impersonation/IP issues.
   - Screenshots should highlight real in-app experiences; language-specific screenshots/promotional videos are appropriate where screenshots contain text.

2. **Add preview assets to showcase your app** — https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
   - Preview assets are managed from Grow users → Store presence → Main store listing → Graphics.
   - Assets appear across test tracks after being added.
   - External marketing promotion can be controlled in Store settings.
   - Google may use submitted icons, screenshots, and videos for Play and Google-owned promotional surfaces under the distribution agreement.
   - Asset requirements are mandatory where marked; policy compliance applies to all assets.

3. **Provide information for Google Play's Data safety section** — https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
   - Developers must declare how app data is collected, shared, and protected in the Play Console Data safety form.
   - Declarations must include third-party libraries/SDK behavior and security practices such as encryption.
   - The declaration appears on the store listing and is reviewed as part of app review.
   - The developer is responsible for complete and accurate declarations; discrepancies may result in enforcement.

## Gwave-specific implications

Gwave should use factual, education-and-platform-focused listing copy rather than promotional claims about cannabis products. The screenshots should show the 21+ gate, bilingual switcher, Help Center, Knowledge Library filters, public merchandise boundary, order flow, and Roadmap/Trust surfaces. Restricted seeds/farm purchase details, private payment slips, private COA keys, customer records, and unsupported laboratory/medical claims must not appear in public store assets. Data safety declarations must be completed from the actual production APK behavior, backend logs, analytics configuration, OAuth flow, order/customer fields, payment-slip upload, and third-party SDKs—not from assumptions.


4. **Developer Program Policy** — https://support.google.com/googleplay/android-developer/answer/16852659?hl=en (effective March 4, 2026 unless otherwise stated)
   - Google Play policy states that apps facilitating the sale of marijuana or marijuana products are not allowed regardless of legality, including allowing users to order marijuana through an in-app shopping cart.
   - This creates a critical distribution risk for Gwave because the current web platform includes restricted seeds/farm and order/payment workflows. The Play Store app should not be submitted with in-app cannabis sales or marijuana ordering enabled without a policy-reviewed architecture and written confirmation from the relevant Google Play policy channel.

5. **Inappropriate Content policy** — https://support.google.com/googleplay/android-developer/answer/9878810?hl=en
   - The Marijuana section repeats that apps facilitating sale of marijuana or marijuana products are not allowed irrespective of legality.
   - Store listing and in-app content must also avoid prohibited or misleading content, and the full policy takes precedence over summaries.

## Critical launch decision

Before preparing a final Play Store listing, Gwave must choose between: (a) a Play-compliant information/brand/knowledge companion app with all cannabis purchase, cart, payment, and order-facilitation functions removed or disabled in the Android build; or (b) not distributing the commerce-enabled Android app through Google Play and instead using a legally reviewed alternative distribution approach. A 21+ gate alone does not override the marijuana-sale restriction. This is a policy risk assessment, not a guarantee of approval; obtain a formal review before submission.
