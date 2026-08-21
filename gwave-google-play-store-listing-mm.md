# Gwave Google Play Store Listing နှင့် Screenshots လမ်းညွှန်

> **အရေးကြီးသော မတင်မီဆုံးဖြတ်ချက်** — Google Play ၏ လက်ရှိ Developer Program Policy အရ marijuana သို့မဟုတ် marijuana products ရောင်းချမှုကို လွယ်ကူစေသော app များကို တရားဝင်ဖြစ်/မဖြစ် မခွဲခြားဘဲ ခွင့်မပြုပါ။ In-app shopping cart ဖြင့် marijuana မှာယူနိုင်ခြင်းသည် policy risk ဖြစ်သည်။ [1] [2] ထို့ကြောင့် Gwave ၏ လက်ရှိ merchandise၊ restricted Seeds/Farm Products၊ order နှင့် payment-slip workflow များကို Android/Play build ထဲတွင် မထည့်ဘဲ **Brand + Knowledge + Help + Trust companion app** အဖြစ် ခွဲထုတ်ပြီး policy review ပြုလုပ်ရန် သို့မဟုတ် Google Play မဟုတ်သော တရားဝင်ဖြန့်ချိရေးလမ်းကြောင်းကို သီးခြားစဉ်းစားရန် လိုအပ်ပါသည်။ 21+ age gate တစ်ခုတည်းဖြင့် ဤ restriction ကို ကျော်လွှားနိုင်မည် မဟုတ်ပါ။

ဤစာတမ်းသည် Google Play Console တွင် တင်သွင်းမည့်အချက်များကို လမ်းညွှန်ပေးခြင်းဖြစ်ပြီး approval အာမခံချက် မဟုတ်ပါ။ Final submission မတိုင်မီ လက်ရှိ Google Play policy၊ ဒေသဆိုင်ရာဥပဒေ၊ privacy စည်းမျဉ်းနှင့် Google Play policy review channel တို့ဖြင့် အတည်ပြုပါ။

## 1. Gwave အတွက် အကြံပြုထားသော Play Store app scope

Play Store သို့ တင်ရန် အန္တရာယ်နည်းသော scope သည် cannabis ရောင်းဝယ်မှုကို မလုပ်ဆောင်ဘဲ အောက်ပါ public information features များကိုသာ ထည့်ထားသော companion app ဖြစ်သည်။

| Play build ထဲ ထည့်နိုင်သော အပိုင်း | Play build ထဲ မထည့်သင့်သော အပိုင်း |
|---|---|
| Gwave brand story နှင့် Brand Signal collection information | Marijuana/seed/farm product shopping cart |
| 21+ access guidance နှင့် responsible-use notice | Marijuana product ordering or checkout |
| Strain knowledge library နှင့် neutral educational metadata | Cannabis product purchase flow |
| Source-approved နှင့် lab-verified COA အခြေအနေ ခွဲခြားပြသခြင်း | Private COA document download or staff-only records |
| Help Center၊ User Guide၊ Roadmap/Trust | Payment-slip upload or payment confirmation |
| Public merchandise information၊ အကယ်၍ marijuana sale မပါလျှင် | Restricted product order၊ address capture နှင့် fulfillment flow |
| English/Myanmar language switcher | In-app link ဖြင့် marijuana ရောင်းချသည့် external checkout သို့ ခေါ်သွားခြင်း |

ဒီခွဲခြားမှုသည် technical hiding မဟုတ်ဘဲ Android release build တွင် server route၊ navigation၊ cart၊ upload၊ order mutation နှင့် payment action များကို တကယ်ပိတ်ထားသည့် architecture ဖြစ်ရမည်။ Store listing တွင်လည်း app က မလုပ်နိုင်သည့်အရာများကို “ရောင်းချသည်၊ မှာယူနိုင်သည်၊ delivery လုပ်သည်” ဟု မရေးရပါ။

## 2. Play Console တွင် ပြင်ဆင်ရမည့် အခြေခံအချက်များ

| အချက် | Gwave အတွက် ပြင်ဆင်ရန် |
|---|---|
| App name | `Gwave` — 30 characters အောက်၊ brand ကို တိတိကျကျ ကိုယ်စားပြုရန် [3] |
| Package ID | Android build ထဲရှိ `com.gwave.marketplace` ကို Play Console နှင့် တူညီစေရန် |
| Developer name | Gwave ၏ အမှန်တကယ် business/developer identity ကို သုံးရန် |
| App category | အမှန်တကယ် scope နှင့် ကိုက်ညီသော Education၊ Lifestyle သို့မဟုတ် အခြားသင့်တော်သော category ကို ရွေးရန် |
| Contact email | User support နှင့် policy reviewer ဆက်သွယ်ရန် လက်လှမ်းမီသော email |
| Privacy policy URL | HTTPS ဖြင့် public ဖတ်နိုင်ရမည်၊ app ထဲက data practices နှင့် တူညီရမည် |
| App access | Login လိုအပ်ပါက reviewer အတွက် Play Console App access form တွင် လမ်းညွှန်/စမ်းသပ်အကောင့် ပေးရန် |
| Target audience | Adult audience အဖြစ် သတ်မှတ်မည်ဆိုလျှင် app behavior၊ age gate နှင့် content ကို အမှန်တကယ် ကိုက်ညီစေရန် |
| Content rating | Questionnaire ကို app ၏ actual content အတိုင်း ဖြေဆိုရန် |
| Data safety | Account၊ contact၊ order-related data၊ uploads၊ analytics နှင့် SDK behavior အတိုင်း တိကျစွာ ဖြေဆိုရန် |
| Release | Signed AAB ကို အဓိကထားပြီး internal testing → closed testing → production အဆင့်လိုက် တင်ရန် |

Google Play သည် Store Listing စာသားများကို အမှန်တကယ် app functionality နှင့် ကိုက်ညီရန်၊ ရှင်းလင်းတိုတောင်းရန်နှင့် misleading claims မပြုရန် လိုအပ်သည်။ Short description ကို 80 characters သို့မဟုတ် ထိုထက်နည်းအောင်၊ full description ကို 4,000 characters အတွင်း ရေးနိုင်သည်။ [3]

## 3. Gwave Store Listing copy — အကြံပြုမူကြမ်း

### 3.1 App title

**English:** `Gwave`

**မြန်မာ:** Play listing title တွင် `Gwave` ကို brand name အဖြစ်ထားပြီး Myanmar အဓိပ္ပာယ်ကို description ထဲတွင် ရှင်းပြပါ။ Title ထဲတွင် `#1`၊ `Best`၊ `Free`၊ discount၊ price သို့မဟုတ် unsupported award claim မထည့်ပါနှင့်။ [3]

### 3.2 Short description — English မူကြမ်း

> **Explore Gwave’s brand, strain knowledge, and 21+ guidance.**

ဤစာကြောင်းသည် companion app scope ဖြင့်သာ သုံးရန်ဖြစ်ပြီး စာလုံးရေကို Play Console counter တွင် ထပ်မံစစ်ပါ။ “Buy seeds”၊ “Order cannabis”၊ “Fast delivery”၊ “Medical benefits” စသည့် စကားများ မထည့်ပါနှင့်။

### 3.3 Short description — မြန်မာမူကြမ်း

> **Gwave brand၊ strain knowledge နှင့် 21+ လမ်းညွှန်များကို လေ့လာပါ။**

Myanmar စာလုံးရေတွက်မှုကို Console counter တွင် စစ်ပြီး 80-character limit အတွင်း ရှိကြောင်း အတည်ပြုပါ။ မြန်မာစာသားရှည်လျှင် English နှင့် မြန်မာ language listing ကို သီးခြားတင်ရန် စဉ်းစားပါ။

### 3.4 Full description — မြန်မာမူကြမ်း

> **Gwave — Brand၊ Knowledge နှင့် Trust ကို တစ်နေရာတည်းတွင် လေ့လာရန် platform**
>
> Gwave သည် ၂၁ နှစ်အထက် အသုံးပြုသူများအတွက် brand story၊ lifestyle collection၊ strain knowledge နှင့် trust information များကို ရှင်းလင်းစွာ လေ့လာနိုင်ရန် ဖန်တီးထားသော companion experience ဖြစ်သည်။ English နှင့် Myanmar ဘာသာစကားများအကြား ပြောင်းလဲအသုံးပြုနိုင်ပြီး Help Center နှင့် User Guide များမှတစ်ဆင့် app ကို အသုံးပြုပုံကို လေ့လာနိုင်သည်။
>
> **အဓိကအင်္ဂါရပ်များ**
>
> • Gwave brand identity နှင့် Brand Signal collection အကြောင်း လေ့လာရန်
> • Strain knowledge library ကို THC၊ CBD နှင့် effect profile များအလိုက် ရှာဖွေရန်
> • Source-approved information နှင့် laboratory-verified COA information ကို အဓိပ္ပာယ်မရောထွေးအောင် ခွဲခြားဖတ်ရှုရန်
> • Help Center၊ User Guide၊ Roadmap နှင့် Trust information များကို ဖတ်ရှုရန်
> • English ↔ Myanmar language switcher ဖြင့် ကိုယ်နှစ်သက်ရာဘာသာစကားကို ရွေးချယ်ရန်
> • ၂၁+ access notice နှင့် privacy/data guidance များကို ရှင်းလင်းစွာ တွေ့မြင်ရန်
>
> Gwave သည် ဆေးဘက်ဆိုင်ရာ diagnosis သို့မဟုတ် treatment မဟုတ်ပါ။ Strain information သည် ပညာပေးအကြောင်းအရာအဖြစ်သာ အသုံးပြုရန်ဖြစ်ပြီး လူတစ်ဦးချင်းစီအပေါ် သက်ရောက်မှုကို အာမခံခြင်းမရှိပါ။ လက်ရှိ Android companion build တွင် marijuana သို့မဟုတ် cannabis product ordering၊ in-app cart၊ payment-slip upload နှင့် restricted product fulfillment မပါဝင်ပါ။ အသက်ကန့်သတ်ချက်၊ ဒေသဆိုင်ရာဥပဒေ နှင့် တာဝန်ယူမှုဆိုင်ရာစည်းမျဉ်းများကို လိုက်နာပါ။
>
> Support နှင့် privacy policy အတွက် app ထဲရှိ Help Center နှင့် official Gwave website ကို အသုံးပြုပါ။

Full description ထဲတွင် ဤမူကြမ်းကို Gwave ၏ အမှန်တကယ် Play-compliant build နှင့် တိတိကျကျ ကိုက်ညီအောင် ပြင်ဆင်ပါ။ Store listing များတွင် price promotion၊ ranking၊ anonymous testimonial၊ medical claim၊ “best” claim သို့မဟုတ် အခြား app/brand နှင့် ဆက်စပ်သကဲ့သို့ အဓိပ္ပာယ်ရစေသော စာသားများ မထည့်ရပါ။ [3]

## 4. Screenshot အစီအစဉ်

Google ၏ guidance အရ screenshots များသည် app အတွင်းရှိ အမှန်တကယ် experience ကို ပြသသင့်ပြီး text ကို အနည်းဆုံးသာ သုံးသင့်သည်။ Screenshot ထဲတွင် စာသားပါလျှင် ထောက်ပံ့သောဘာသာစကားအလိုက် သီးခြား screenshot များ ပြင်ဆင်နိုင်သည်။ [3] Preview assets များကို Main store listing ရှိ Graphics section မှ စီမံပြီး test tracks အားလုံးတွင် ပြသနိုင်သည်။ [4]

### 4.1 Phone screenshot set — အကြံပြု ၆ ပုံ

| အစဉ် | ပြသမည့် screen | Caption အကြံပြုချက် | မပြသရမည့်အချက် |
|---:|---|---|---|
| 1 | 21+ age gate | `Start with responsible access.` / `တာဝန်ယူမှုရှိသော access ဖြင့် စတင်ပါ` | Order၊ product price၊ sales CTA |
| 2 | Home / Brand Signal | `Wear the signal. Carry the standard.` | Marijuana product sale claim |
| 3 | Knowledge Library | `Explore strain knowledge.` / `Strain knowledge ကို လေ့လာပါ` | Medical treatment promise |
| 4 | THC/CBD/effect filters | `Find information with clear filters.` | “Effects guaranteed” ဟု မရေးရ |
| 5 | Verified COA summary | `See what is verified—and what is not.` | Private PDF key၊ staff record၊ unsupported lab claim |
| 6 | Help Center / Roadmap | `Know the platform. Understand the standard.` | Restricted checkout သို့မဟုတ် payment-slip workflow |

### 4.2 Tablet screenshot set

Tablet screenshot များတွင် Help Center၊ Knowledge Library နှင့် Roadmap ကို landscape layout ဖြင့် ပြသပါ။ Burmese စာသားရှည်များကို အနားကပ်မထားဘဲ safe area အတွင်းထားပြီး navigation၊ language switcher နှင့် headline ကို အလယ်ပိုင်းတွင် ထားပါ။ Tablet-specific asset များကို Console တွင် လိုအပ်/ထောက်ပံ့သည့် device category အတိုင်း တင်ပါ။

### 4.3 Screenshot design rules

Screenshot တစ်ပုံချင်းစီတွင် အဓိကအချက်တစ်ခုသာ ပြသပါ။ Caption များကို တိုတိုရေးပြီး device frame၊ fake review၊ fake rating၊ “#1”၊ “Best”၊ discount၊ price၊ “limited time”၊ “100% safe”၊ “medical cure” စသည့် စာသားများ မသုံးပါနှင့်။ App ထဲတွင် အမှန်တကယ် မရှိသော UI၊ မရှိသော COA record၊ မရှိသော user review နှင့် မရှိသော customer result ကို mock မလုပ်ပါနှင့်။ Google က graphics များကို Play နှင့် Google-owned promotional surfaces တွင် အသုံးပြုနိုင်ကြောင်း ဖော်ပြထားသောကြောင့် asset များသည် public-safe ဖြစ်ရမည်။ [4]

### 4.4 အကြံပြု target asset sizes

အောက်ပါ resolution များသည် design target အဖြစ် အသုံးပြုရန်ဖြစ်ပြီး Console ရှိ လက်ရှိ upload validator ကို နောက်ဆုံးအတည်ပြုချက်အဖြစ် သတ်မှတ်ပါ။

| Asset | ပြင်ဆင်ရန် target | Design rule |
|---|---:|---|
| High-resolution app icon | 512 × 512 px PNG | Gwave leaf logo ကို center safe area ထဲထားရန်၊ text အလွန်သေးမထည့်ရန် |
| Feature graphic | 1024 × 500 px | Black/white/lime green system၊ အရေးကြီးသောစာသားကို center safe area ထဲထားရန် |
| Phone portrait screenshot | 1080 × 1920 px | Android app screen ကို အပြည့်ပြသရန်၊ caption ကို တိုတိုထားရန် |
| Phone landscape screenshot | 1920 × 1080 px | Landscape screen အတွက်သာ သုံးရန် |
| Tablet screenshot | Device-supported aspect ratio | Actual tablet UI ဖြင့်သာ ပြင်ဆင်ရန်၊ phone screenshot ကို stretch မလုပ်ရန် |

PNG/JPEG format၊ file size နှင့် aspect ratio ကို upload မလုပ်မီ Play Console validator တွင် စစ်ပါ။ Feature graphic တွင် text အများကြီး မထည့်ပါနှင့်။ Google guidance အရ graphics များကို screen size အမျိုးမျိုးတွင် scale လုပ်သည့်အခါ အရေးကြီးသော elements များကို center နားတွင်ထားသင့်သည်။ [3]

## 5. App icon နှင့် Feature Graphic အကြံပြုချက်

Gwave ၏ လက်ရှိ green leaf logo ကို app icon အဖြစ် သုံးနိုင်သော်လည်း logo ownership နှင့် brand identity ကို အတည်ပြုပါ။ Icon သည် အခြား app တစ်ခုနှင့် မှားယွင်းရောထွေးနိုင်သောပုံ မဖြစ်ရပါ။ Feature graphic တွင် လက်ရှိ black/white/lime green palette၊ geometric grid နှင့် “Gwave — Brand + Knowledge + Trust” ကဲ့သို့ platform-focused line ကို သုံးပါ။ Marijuana product close-up၊ plant glamour shot၊ product bag၊ seed pack၊ order button၊ price tag နှင့် delivery promise များကို မသုံးပါနှင့်။ Google ၏ metadata/impersonation/IP policy များသည် icon၊ feature graphic နှင့် screenshot အားလုံးတွင် သက်ရောက်သည်။ [3]

## 6. Privacy Policy နှင့် Data Safety Form

Google Play Data safety section တွင် app က data မည်သို့ စုဆောင်း၊ မည်သူနှင့် မည်သို့ မျှဝေ၊ မည်သို့ ကာကွယ်သည်ကို developer က တိကျစွာ ဖြေဆိုရမည်။ Third-party SDK များ၏ data behavior လည်း ပါဝင်ပြီး form အချက်အလက်သည် store listing တွင် ပြသမည်ဖြစ်သည်။ မမှန်ကန်သော declaration သည် enforcement risk ဖြစ်နိုင်သည်။ [5]

Gwave Play companion build အတွက် အောက်ပါ matrix ကို production APK၊ backend routes၊ analytics config နှင့် SDK list ကို ပြန်စစ်ပြီးမှ ဖြည့်ပါ။

| Data category | Gwave တွင် ဖြစ်နိုင်သောအကြောင်းအရာ | Form တွင် မည်သို့ဆုံးဖြတ်မည် |
|---|---|---|
| Name/contact info | Account၊ support၊ order-related web flow ရှိမှသာ | Play build က account/order မသုံးလျှင် မစုဆောင်းကြောင်း သေချာစစ်ပါ |
| Email/phone/address | Web commerce backend တွင် ရှိနိုင် | Android build တွင် disabled ဖြစ်ပါက မကြေညာဘဲ၊ actual SDK/network behavior ကို စစ်ပါ |
| Photos/files | Payment slip upload သို့မဟုတ် user file upload | Play build တွင် upload route မပါလျှင် မပါရ၊ ပါလျှင် purpose/handling ကို တိကျစွာ ဖြေပါ |
| App activity | Analytics events၊ search/filter interactions | Analytics endpoint၊ SDK နှင့် event payload ကို audit လုပ်ပြီး ဖြေပါ |
| Device identifiers | Analytics/anti-abuse SDK ရှိမှသာ | SDK privacy documentation နှင့် network logs ကို စစ်ပါ |
| App info/performance | Crash/error monitoring ရှိမှသာ | Monitoring provider နှင့် SDK behavior အတိုင်း ဖြေပါ |
| Security | HTTPS၊ encrypted transit၊ access control | အမှန်တကယ် production configuration နှင့်ကိုက်ညီမှသာ claim ပြုလုပ်ပါ |
| Deletion | Account/data deletion mechanism ရှိမရှိ | မရှိပါက ရှိသည်ဟု မဖြေပါနှင့်၊ policy ထဲမှာ request process ထည့်ပါ |

“Data is encrypted in transit”၊ “data is deleted” နှင့် “no data shared” စသည့် checkbox များကို ခန့်မှန်းပြီး မရွေးပါနှင့်။ Actual APK behavior၊ backend၊ analytics နှင့် third-party libraries ကို audit ပြီးမှသာ ဖြေဆိုပါ။

## 7. App Content နှင့် Reviewer Access

Play Console App content section တွင် target audience၊ content rating၊ privacy policy၊ ads declaration၊ app access နှင့် data safety တို့ကို ဖြည့်ရမည်။ Gwave ၏ 21+ access gate ရှိသော်လည်း target audience declaration သည် app content နှင့် behavior တစ်ခုလုံးကို အခြေခံရမည်။ Cannabis-related educational content၊ adult-only access နှင့် restricted product references များကို policy review အတွက် ရှင်းလင်းစွာ ဖော်ပြပါ။

Reviewer သည် login မပါဘဲ public companion content ကို စမ်းနိုင်ရမည်။ Login လိုအပ်သော feature ရှိလျှင် Play Console App access form တွင် reviewer အတွက် test instructions နှင့် test account ကို ထည့်ပါ။ Private customer data၊ live payment account၊ staff/admin credential သို့မဟုတ် production secret ကို မပေးပါနှင့်။

## 8. Release အဆင့်များ

ပထမဦးစွာ internal testing တွင် signed AAB တင်ပြီး 21+ gate၊ language switcher၊ Help၊ Knowledge၊ Roadmap၊ navigation နှင့် offline/error states များကို စမ်းပါ။ ထို့နောက် closed testing တွင် Android device မျိုးစုံ၊ network အခြေအနေများနှင့် reviewer-safe content ကို စမ်းသပ်ပါ။ Store listing asset များသည် test tracks အားလုံးတွင် ပေါ်နိုင်သောကြောင့် test screenshot ထဲတွင် private data၊ debug URL သို့မဟုတ် development menu မပါစေရပါ။ [4]

Production မတင်မီအောက်ပါအချက်များကို အတည်ပြုပါ။

| စစ်ဆေးရန် | အောင်မြင်မှုအခြေအနေ |
|---|---|
| Policy scope | Play build ထဲတွင် marijuana sale/cart/order/payment facilitation မပါ |
| Package/signing | Package ID နှင့် release certificate မှန် |
| Listing copy | App behavior နှင့် တိတိကျကျ ကိုက်ညီ |
| Screenshots | Actual in-app screens၊ no fake review/COA/claim |
| Privacy | Public HTTPS privacy policy URL ရှိ |
| Data safety | APK/backend/SDK audit အတိုင်း ဖြေပြီး |
| App access | Reviewer လမ်းညွှန်ချက် သို့မဟုတ် test account ရှိ |
| Content rating | Actual content အတိုင်း ဖြေပြီး |
| Support | Support email၊ Help Center နှင့် contact path ရှိ |
| Build quality | Debug endpoint/log၊ test secrets၊ staging route မကျန် |

## 9. လက်ရှိ Gwave project အတွက် အရေးကြီးသော blocker

နောက်ဆုံး development log တွင် `client/src/pages/GwavePages.tsx` အတွင်း `Unexpected token, expected 
 syntax error ရှိကြောင်း project log တွင် တွေ့ရပါသည်။ နောက်ဆုံး production APK build မတိုင်မီ ဤ syntax error ကို ပြင်ပြီး TypeScript check၊ Vitest နှင့် production build အောင်မြင်ကြောင်း ထပ်မံစစ်ဆေးရမည်။ Android release ကို မပြုလုပ်ရသေးဘဲ Store Listing asset များသည် build အောင်မြင်ပြီး actual app screens ဖြင့်သာ ပြင်ဆင်သင့်ပါသည်။

## 10. အကောင်အထည်ဖော်ရန် အစီအစဉ်

ပထမအဆင့်တွင် Google Play policy အတိုင်း Play companion build ၏ scope ကို owner က အတည်ပြုပါ။ ဒုတိယအဆင့်တွင် cannabis sale၊ cart၊ payment နှင့် restricted order routes မပါသော Android flavor သို့မဟုတ် separate app build တည်ဆောက်ပါ။ တတိယအဆင့်တွင် syntax error ကို ပြင်ပြီး signed AAB ထုတ်ကာ internal testing လုပ်ပါ။ စတုတ္ထအဆင့်တွင် actual app screens ဖြင့် English နှင့် Myanmar screenshot sets ပြင်ဆင်ပါ။ နောက်ဆုံးတွင် Store Listing၊ App content၊ Data safety၊ privacy policy၊ reviewer access နှင့် release declaration များကို production behavior အတိုင်း ဖြေဆိုပြီး policy review ကို စောင့်ပါ။

## 11. အတိုချုပ် Upload Checklist

| အဆင့် | ပြီးစီးရမည့်အချက် |
|---:|---|
| 1 | Play-compliant app scope ကို အတည်ပြုခြင်း |
| 2 | Cannabis sale/cart/order/payment functions ကို Play build မှ ဖယ်ရှားခြင်း |
| 3 | `Gwave` app name၊ package ID၊ developer identity နှင့် support email သတ်မှတ်ခြင်း |
| 4 | Public HTTPS privacy policy URL ပြင်ဆင်ခြင်း |
| 5 | Content rating၊ target audience၊ app access နှင့် ads declarations ဖြည့်ခြင်း |
| 6 | Actual APK/AAB data flow ကို audit ပြီး Data safety form ဖြည့်ခြင်း |
| 7 | Gwave leaf icon၊ feature graphic နှင့် actual phone/tablet screenshots ပြင်ဆင်ခြင်း |
| 8 | English/Myanmar listing copy ကို Play character limits နှင့် policy အတိုင်း စစ်ခြင်း |
| 9 | Internal testing → closed testing → production အဆင့်လိုက် တင်ခြင်း |
| 10 | Policy review အောင်မြင်မှသာ public release ပြုလုပ်ခြင်း |

## References

[1]: https://support.google.com/googleplay/android-developer/answer/16852659?hl=en "Developer Program Policy — Google Play Console Help"

[2]: https://support.google.com/googleplay/android-developer/answer/9878810?hl=en "Inappropriate Content — Google Play Console Help"

[3]: https://support.google.com/googleplay/android-developer/answer/13393723?hl=en "Best practices for your store listing — Google Play Console Help"

[4]: https://support.google.com/googleplay/android-developer/answer/9866151?hl=en "Add preview assets to showcase your app — Google Play Console Help"

[5]: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en "Provide information for Google Play's Data safety section — Google Play Console Help"
