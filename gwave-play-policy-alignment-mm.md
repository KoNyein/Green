# Gwave Android App — Google Play Policy Alignment ဆွေးနွေးချက်

> **သတိပေးချက်** — ကျွန်ုပ်သည် ရှေ့နေမဟုတ်ပါ။ အောက်ပါအချက်များသည် Google Play ၏ public policy ကို အခြေခံထားသော လုပ်ငန်း/နည်းပညာဆိုင်ရာ analysis ဖြစ်ပြီး တင်သွင်းမည့်အခါ qualified legal counsel နှင့် Google Play policy review channel မှ ပြန်လည်စစ်ဆေးသင့်ပါသည်။

## အဓိကအဖြေ

Gwave ၏ လက်ရှိ website သည် merchandise၊ restricted Seeds/Farm Products၊ checkout၊ payment-slip upload နှင့် staff order workflow များ ပါဝင်သော commerce platform ဖြစ်သည်။ သို့သော် Google Play ၏ current Developer Program Policy တွင် marijuana သို့မဟုတ် marijuana products ရောင်းချမှုကို လွယ်ကူစေသော app များကို တရားဝင်ဖြစ်/မဖြစ် မခွဲခြားဘဲ ခွင့်မပြုကြောင်း ဖော်ပြထားသည်။ In-app shopping cart ဖြင့် marijuana မှာယူနိုင်ခြင်းကိုလည်း policy တွင် တိတိကျကျ မခွင့်ပြုထားသည်။ [1] [2]

ထို့ကြောင့် **လက်ရှိ commerce-enabled website ကို APK အဖြစ် တိုက်ရိုက် wrapper လုပ်ပြီး Play Store တင်ခြင်းကို မအကြံပြုပါ**။ အကောင်းဆုံးရွေးချယ်မှုမှာ Gwave ကို platform နှစ်ခုအဖြစ် ခွဲခြားခြင်းဖြစ်သည်။

| Platform | အဓိကရည်ရွယ်ချက် | ရောင်းဝယ်ရေးအခြေအနေ |
|---|---|---|
| **Gwave Web Commerce** | Website မှတစ်ဆင့် business operation၊ catalogue၊ order၊ payment-slip နှင့် staff workflow | ဒေသဆိုင်ရာဥပဒေ၊ payment provider နှင့် legal review အရ သီးခြားစီမံရန် |
| **Gwave Android Companion** | Brand၊ Knowledge၊ Help၊ Trust နှင့် Roadmap information ကို ပေးရန် | Marijuana sale၊ cart၊ checkout၊ payment နှင့် order-facilitation မပါဝင်ရန် |

ဤခွဲခြားမှုသည် navigation link များကို ဖုံးကွယ်ခြင်းမျှ မဟုတ်ရပါ။ Android release build၊ server capability၊ API permission နှင့် Play listing အားလုံးတွင် commerce scope ကို အမှန်တကယ် ပိတ်ထားရမည်။

## 1. App positioning ကို ဘယ်လိုပြောင်းမလဲ

လက်ရှိ positioning ကို **“21+ Cannabis Marketplace”**၊ **“Seeds/Farm Products Store”** သို့မဟုတ် **“Order and Delivery App”** အဖြစ် မသတ်မှတ်သင့်ပါ။ ထိုစကားလုံးများသည် Play reviewer အတွက် app ၏ primary purpose သည် marijuana-related sale ဖြစ်ကြောင်း အဓိပ္ပာယ်ရစေနိုင်သည်။ 21+ gate တစ်ခုတည်းဖြင့် sale restriction ကို မကျော်လွှားနိုင်ပါ။

အစားထိုး positioning ကို အောက်ပါပုံစံဖြင့် သတ်မှတ်နိုင်သည်။

> **Gwave — 21+ Brand, Knowledge & Trust Companion**
>
> Gwave သည် brand story၊ lifestyle identity၊ neutral strain knowledge၊ COA transparency၊ Help Center နှင့် responsible-access information များကို လေ့လာနိုင်သော bilingual companion experience ဖြစ်သည်။

အဆိုပါ positioning တွင် “ရောင်းသည်”၊ “မှာယူနိုင်သည်”၊ “delivery”၊ “ဆေးဘက်ဆိုင်ရာအကျိုးကျေးဇူး”၊ “အာနိသင်အာမခံ” စသည့် claim များ မပါဝင်သင့်ပါ။ App သည် ပညာပေးအကြောင်းအရာနှင့် brand trust ကို အဓိကထားပြီး product transaction ကို မလုပ်ဆောင်ကြောင်း ရှင်းလင်းရမည်။

## 2. Feature scope ကို အပိုင်းလိုက် ချိန်ညှိခြင်း

### Play build ထဲ ထည့်နိုင်ရန် အလားအလာရှိသော features

| Feature | သတ်မှတ်ချက် |
|---|---|
| Brand Home | Gwave brand story၊ Brand Signal နှင့် lifestyle identity ကိုသာ ပြသရန် |
| 21+ access notice | Adult-access notice အဖြစ်ထားရန်၊ purchase permission အဖြစ် မဖော်ပြရန် |
| Knowledge Library | Strain records၊ THC/CBD ranges နှင့် effects ကို neutral educational information အဖြစ်ပြသရန် |
| COA transparency | Approved COA summary၊ source label နှင့် “source-approved မဟုတ် lab-verified” ခွဲခြားချက်ကိုသာ ပြသရန် |
| Help Center/User Guide | App အသုံးပြုပုံ၊ privacy၊ support နှင့် responsible information များကို ရှင်းပြရန် |
| Roadmap/Trust | Gwave platform goals၊ quality process နှင့် audit principles ကို ပြသရန် |
| English/Myanmar switcher | Public content နှင့် accessibility အတွက် ထည့်သွင်းရန် |
| Public merchandise information | Marijuana-related sale မပါသော brand merchandise information သာ ထည့်သွင်းရန်၊ policy review လိုအပ် |

### Play build ထဲ မထည့်သင့်သော features

| Feature | Risk |
|---|---|
| Marijuana/seed/farm product catalogue with purchase CTA | Sale facilitation အဖြစ် အဓိပ္ပာယ်ရနိုင်သည် |
| Add-to-cart၊ checkout၊ order confirmation | In-app marijuana ordering flow ဖြစ်နိုင်သည် |
| Payment-slip upload၊ payment status၊ bank transfer instructions | Transaction facilitation ကို တိုက်ရိုက်ထောက်ပံ့သည် |
| Delivery address၊ fulfillment status၊ shipping workflow | Sale ပြီးနောက် fulfillment ကို လွယ်ကူစေသည် |
| WebView ဖြင့် commerce website ကို တိုက်ရိုက်ဖွင့်ခြင်း | App က transaction ကို လွယ်ကူစေသည်ဟု သတ်မှတ်ခံရနိုင်သည် |
| External link ဖြင့် marijuana checkout သို့ ခေါ်သွားခြင်း | In-app sale မဟုတ်ဟု ဖုံးကွယ်ရန် ကြိုးစားသကဲ့သို့ မြင်နိုင်သည် |
| Staff/admin order၊ private-slip နှင့် private COA console | Public Play app ထဲတွင် မလိုအပ်ဘဲ sensitive access ဖြစ်သည် |
| “Medical benefit”၊ “cure”၊ “guaranteed effect” claims | Misleading health claim နှင့် policy risk ဖြစ်နိုင်သည် |

## 3. Architecture ကို ဘယ်လိုခွဲမလဲ

### Option A — Separate Android companion app

အကြံပြုချက်အမြင့်ဆုံးရွေးချယ်မှုမှာ Android အတွက် သီးခြား route နှင့် သီးခြား capability set ပါသော companion app တစ်ခု ထုတ်ခြင်းဖြစ်သည်။ Android client သည် `brand`၊ `knowledge`၊ `help`၊ `roadmap` နှင့် public `coa-summary` query များကိုသာ ခေါ်နိုင်ရမည်။ `createOrder`၊ `uploadPaymentSlip`၊ `restrictedCatalogue`၊ `fulfillment` နှင့် staff mutation များကို Android credential scope တွင် မပေးရပါ။

Server-side တွင် `APP_SURFACE=play_companion` ကဲ့သို့ capability flag သုံးနိုင်သော်လည်း client-side flag တစ်ခုတည်းကို security boundary မသတ်မှတ်ရပါ။ Server သည် platform/application identity ကို စစ်ဆေးပြီး restricted procedures များကို သီးခြား authorization ဖြင့် ပိတ်ရမည်။

### Option B — Commerce-disabled Android flavor

လက်ရှိ codebase ကို ပြန်သုံးလိုပါက Android အတွက် `playRelease` flavor တစ်ခု ဖန်တီးနိုင်သည်။ ထို flavor တွင် commerce routes၊ cart components၊ checkout၊ payment upload၊ order mutation နှင့် restricted product navigation မပါဝင်ရပါ။ `webRelease` သည် web commerce အတွက် သီးခြားဖြစ်နိုင်သည်။

သို့သော် UI ကို ဖျောက်ထားရုံနှင့် မလုံလောက်ပါ။ APK ကို reverse engineer လုပ်နိုင်သောကြောင့် server authorization နှင့် endpoint-level capability restriction ကိုပါ ထည့်ရမည်။ Play build တွင် commerce code မပါဝင်အောင် build-time exclusion ပြုလုပ်နိုင်လျှင် ပိုကောင်းသည်။

### Option C — လက်ရှိ website ကို WebView ဖြင့် တိုက်ရိုက်ထုပ်ခြင်း

ဤ option ကို မအကြံပြုပါ။ Website ထဲတွင် cart၊ order၊ payment-slip နှင့် restricted commerce routes များရှိနေပါက WebView သည် ထိုလုပ်ဆောင်ချက်များကို Android app ထဲသို့ သယ်ဆောင်လာမည်ဖြစ်သည်။ Store listing တွင် “app သည် information only” ဟုရေးထားသော်လည်း actual runtime တွင် order flow ရှိနေပါက declaration နှင့် behavior မကိုက်ညီနိုင်ပါ။

## 4. Data flow နှင့် access control

Play companion app အတွက် public data နှင့် private operational data ကို အောက်ပါအတိုင်း ခွဲထားသင့်သည်။

| Data | Companion app | Web/staff system |
|---|---:|---:|
| Brand content | Read | Read/write editorial |
| Strain educational metadata | Read | Staff review/write |
| Approved COA summary | Public read, private key မပါ | Staff review and private document access |
| Customer name/email/phone/address | မလိုအပ်လျှင် မစုဆောင်း | Commerce order flow တွင်သာ |
| Payment slip | မရ | Staff-only private storage |
| Order creation | မရ | Web commerce မှသာ |
| Order status/fulfillment | မရ | Authenticated customer/staff workflow |
| Admin/COA approval mutation | မရ | Admin-only |
| Analytics | Minimal, declared | Actual SDK/data policy အတိုင်း |

Android app တွင် login လိုအပ်လျှင် customer account အတွက် မလိုအပ်သော data မစုဆောင်းသင့်ပါ။ Staff/admin login ကို Play public app ထဲသို့ မထည့်ခြင်းက ပိုလုံခြုံသည်။ COA public section တွင် approved summary၊ test date၊ laboratory name ကဲ့သို့ public-safe fields များသာ ထည့်ပြီး private document key၊ signed URL၊ audit record နှင့် internal notes မပြသရပါ။

## 5. Store listing positioning

Google Play listing သည် app ၏ အမှန်တကယ် functionality ကို တိတိကျကျ ဖော်ပြရမည်။ Google ၏ Store Listing guidance အရ title သည် 30 characters အောက်ဖြစ်ရပြီး short description သည် 80 characters အောက်၊ full description သည် 4,000 characters အတွင်း ဖြစ်ရမည်။ Listing တွင် misleading claims၊ rankings၊ discount/price promotion၊ anonymous testimonial နှင့် မရှိသော functionality များ မထည့်သင့်ပါ။ [3]

### အကြံပြု title

`Gwave`

### အကြံပြု English short description

> **Explore Gwave’s brand, knowledge, and 21+ guidance.**

### အကြံပြု မြန်မာ short description

> **Gwave brand၊ knowledge နှင့် 21+ လမ်းညွှန်များကို လေ့လာပါ။**

### မသုံးသင့်သော listing စကားလုံးများ

| မသုံးသင့်သော စကား | အကြောင်းပြချက် |
|---|---|
| Buy cannabis / Buy seeds | Marijuana sale facilitation အဖြစ် မြင်နိုင်သည် |
| Order now / Fast delivery | Transaction/fulfillment ကို promote လုပ်သည် |
| Medical benefits / Cure | Health claim နှင့် misleading claim ဖြစ်နိုင်သည် |
| Best / #1 / Guaranteed | Ranking/unsupported claim ဖြစ်နိုင်သည် |
| Discount / Free / Limited offer | Promotional metadata restriction ဖြစ်နိုင်သည် |
| Verified အားလုံး | Source-approved data နှင့် laboratory-verified COA ကို မရောထွေးရ |

## 6. Screenshot နှင့် visual scope

Screenshots များသည် actual companion app screens များဖြစ်ရမည်။ အောက်ပါ set ကို သုံးနိုင်သည်။

| Screenshot | ပြသမည့်အကြောင်းအရာ | Caption |
|---:|---|---|
| 1 | 21+ access notice | `Start with responsible access.` |
| 2 | Gwave brand home | `Brand, identity, and signal.` |
| 3 | Knowledge Library | `Explore clear strain information.` |
| 4 | THC/CBD/effect filters | `Find information with useful filters.` |
| 5 | COA summary | `See what is verified—and what is not.` |
| 6 | Help Center/Roadmap | `Understand the platform and its standards.` |

Screenshots ထဲတွင် seed pack၊ cannabis order button၊ payment slip၊ customer address၊ staff dashboard၊ private COA PDF၊ fake reviews၊ fake ratings၊ medical promise၊ price tag နှင့် delivery claim များ မပါရပါ။ Feature graphic တွင် Gwave green leaf logo၊ black/white/lime-green system နှင့် platform-focused copy သာ သုံးသင့်သည်။ Google Play preview asset guidance သည် screenshots ကို actual in-app experience အဖြစ်ပြရန်၊ text ကို အနည်းဆုံးထားရန်နှင့် asset များကို Google-owned promotional surfaces တွင် အသုံးပြုနိုင်ကြောင်း ရှင်းပြထားသည်။ [4]

## 7. Data Safety နှင့် privacy

Google Play Data safety form သည် app က data မည်သို့စုဆောင်း၊ မည်သို့မျှဝေ၊ မည်သို့ကာကွယ်သည်ကို developer က တိကျစွာ ကြေညာရန်လိုအပ်သည်။ Third-party SDK များ၏ data behavior ပါဝင်ပြီး declaration သည် store listing တွင် ပြသမည်ဖြစ်သည်။ မမှန်ကန်သော declaration သည် enforcement risk ဖြစ်နိုင်သည်။ [5]

Gwave companion build အတွက် APK၊ backend၊ analytics endpoint၊ OAuth flow နှင့် SDK list ကို စစ်ပြီးမှသာ အောက်ပါအချက်များကို ဖြေဆိုရမည်။

| Data အမျိုးအစား | ဆုံးဖြတ်ရန် |
|---|---|
| Email/name | Companion app က account လိုအပ်မှသာ စုဆောင်းရန် |
| Phone/address | Commerce build မဟုတ်လျှင် Android app မှ မစုဆောင်းရန် |
| Photos/files | Payment slip upload ကို မပါစေရန်၊ ပါလျှင် actual purpose ကို ဖြေဆိုရန် |
| Search/filter activity | Analytics events တကယ်ပို့ပါက declare လုပ်ရန် |
| Device identifiers | SDK နှင့် network behavior အတိုင်း ဖြေဆိုရန် |
| Crash/performance | Monitoring SDK ရှိမှသာ declare လုပ်ရန် |
| Encryption in transit | Production HTTPS နှင့် API configuration အမှန်တကယ် ရှိမှသာ claim လုပ်ရန် |
| Data deletion | အမှန်တကယ် deletion mechanism ရှိမှသာ “data can be deleted” ဟု ဖြေဆိုရန် |

“မည်သည့် data မျှ မစုဆောင်းပါ” ဟု အလွယ်တကူ မဖြေပါနှင့်။ Android build ၏ actual network traffic၊ analytics၊ OAuth နှင့် storage behavior ကို audit ပြုလုပ်ပြီးမှ form ဖြည့်ပါ။

## 8. အသက်ကန့်သတ်ချက်နှင့် content positioning

21+ gate ကို responsible-access notice အဖြစ် ထားနိုင်သော်လည်း 21+ gate သည် marijuana sale policy အတွက် exemption မဟုတ်ပါ။ App ၏ target audience၊ content rating နှင့် age-gate behavior ကို တစ်သမတ်တည်း ဖြေဆိုရမည်။ Strain knowledge တွင် medical diagnosis၊ treatment၊ cure၊ effect guarantee နှင့် individual health recommendation များ မပါရပါ။

Source-approved records နှင့် laboratory-verified COA records ကို စာသားနှင့် UI အဆင့်တွင် ခွဲခြားပြပါ။ “Approved” သည် staff/editorial approval ကို ဆိုလိုနိုင်ပြီး “lab-verified” သည် အမှန်တကယ် laboratory document ရှိမှသာ သုံးရမည်။ အထောက်အထားမရှိသော COA၊ review၊ rating နှင့် customer result မဖန်တီးရပါ။

## 9. ဆုံးဖြတ်ရမည့် ရွေးချယ်စရာများ

| ရွေးချယ်စရာ | အကျိုး | Risk/အားနည်းချက် | အကြံပြုချက် |
|---|---|---|---|
| A. Play companion app | Policy risk ကို လျှော့ပြီး brand/knowledge တန်ဖိုးကို ထိန်းနိုင် | Commerce မပါ၊ app နှစ်ခုခွဲရ | **အကောင်းဆုံးရွေးချယ်မှု** |
| B. Play အတွက် commerce-disabled flavor | Codebase ပြန်သုံးနိုင်၊ Web commerce သီးခြားထားနိုင် | Server/build boundary မမှန်လျှင် risk ကျန် | Architecture အားကောင်းမှ သုံးရန် |
| C. Commerce-enabled WebView APK | တည်ဆောက်ရလွယ် | Marijuana sale/cart/order policy risk အလွန်မြင့် | **မအကြံပြု** |
| D. Play မဟုတ်သော ဖြန့်ချိရေး | Commerce experience ကို ထိန်းသိမ်းနိုင် | User trust၊ device installation နှင့် distribution burden များ | Local legal/policy review ပြီးမှ သုံးရန် |

## 10. အကြံပြုထားသော လုပ်ဆောင်ချက်အစီအစဉ်

ပထမဦးစွာ owner သည် **Gwave Android Companion App** scope ကို အတည်ပြုရမည်။ ထို့နောက် Android build မှ cart၊ checkout၊ order mutation၊ payment-slip upload၊ restricted catalogue၊ delivery နှင့် staff/admin routes များကို ဖယ်ရှားရမည်။ Server သည် Play companion identity အတွက် restricted procedures များကို အမှန်တကယ် deny လုပ်ရမည်။

ထို့နောက် public brand၊ Knowledge Library၊ Help Center၊ Roadmap၊ bilingual switcher နှင့် public COA summary ကိုသာ QA ပြုလုပ်ပါ။ Store listing copy နှင့် screenshots များကို actual build မှ capture လုပ်ပြီး price၊ sale၊ medical claim၊ fake review နှင့် private data မပါကြောင်း စစ်ပါ။

ပြီးလျှင် privacy policy၊ Data safety၊ target audience၊ content rating၊ app access နှင့် support contact များကို actual runtime အတိုင်း ဖြေဆိုပါ။ Internal testing နှင့် closed testing ပြီးမှသာ Google Play policy review တင်ပါ။ Policy review မအောင်မြင်သေးမီ production public release မလုပ်ပါနှင့်။

## 11. မတင်မီ Gate Checklist

| Gate | အောင်မြင်မှုအခြေအနေ |
|---|---|
| Policy gate | Play build တွင် marijuana sale/cart/order/payment facilitation မရှိ |
| Architecture gate | Server က Android companion identity ကို စစ်ပြီး restricted mutation များ deny လုပ် |
| Content gate | Listing နှင့် screenshots သည် actual app ကိုသာ ပြ |
| Health-claim gate | Medical diagnosis၊ cure၊ treatment နှင့် guaranteed effects မရှိ |
| Data gate | APK/backend/SDK audit အတိုင်း Data safety form ဖြေ |
| Privacy gate | Public HTTPS privacy policy ရှိ |
| Access gate | Reviewer အတွက် public access သို့မဟုတ် safe test instructions ရှိ |
| Build gate | Syntax၊ TypeScript၊ tests၊ production AAB build အောင်မြင် |
| Legal gate | ဒေသဆိုင်ရာဥပဒေနှင့် qualified counsel review ပြီး |
| Release gate | Internal → closed → production testing အဆင့်လိုက် ပြီး |

## 12. လက်ရှိ project အပေါ် သတိပြုရန်

နောက်ဆုံး development log တွင် `client/src/pages/GwavePages.tsx` အတွင်း `Unexpected token, expected ","` syntax error တစ်ခု တွေ့ရှိထားပါသည်။ APK/AAB build နှင့် Play submission မတိုင်မီ ဤ code error ကို ပြင်ပြီး TypeScript check၊ Vitest နှင့် production build အောင်မြင်ကြောင်း ထပ်မံအတည်ပြုရမည်။

## နိဂုံးချုပ်

Gwave အတွက် အကောင်းဆုံးလမ်းကြောင်းမှာ **commerce-enabled website ကို ဆက်ထိန်းသိမ်းပြီး Google Play အတွက် commerce မပါသော Brand + Knowledge + Help + Trust companion app ကို သီးခြားထုတ်ခြင်း** ဖြစ်သည်။ ဤနည်းလမ်းသည် Gwave brand နှင့် Knowledge Library တန်ဖိုးကို ထိန်းသိမ်းပေးသော်လည်း Google Play marijuana-sale restriction ကို ကျော်လွှားမည်ဟု အာမမခံနိုင်ပါ။ Final app scope ကို policy review နှင့် legal review ပြီးမှသာ အတည်ပြုသင့်သည်။

### References

[1]: https://support.google.com/googleplay/android-developer/answer/16852659?hl=en "Developer Program Policy — Google Play Console Help"

[2]: https://support.google.com/googleplay/android-developer/answer/9878810?hl=en "Inappropriate Content — Google Play Console Help"

[3]: https://support.google.com/googleplay/android-developer/answer/13393723?hl=en "Best practices for your store listing — Google Play Console Help"

[4]: https://support.google.com/googleplay/android-developer/answer/9866151?hl=en "Add preview assets to showcase your app — Google Play Console Help"

[5]: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en "Provide information for Google Play's Data safety section — Google Play Console Help"

