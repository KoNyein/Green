# Gwave Production Server — Environment Variables နှင့် Security Setup

> **အသုံးပြုရန်သတိပြုချက်** — ဤစာတမ်းသည် Gwave codebase ၏ လက်ရှိ configuration အပေါ် အခြေခံထားသော production preparation checklist ဖြစ်ပါသည်။ Cannabis၊ seed/farm product၊ payment နှင့် data-protection စည်းမျဉ်းများသည် နိုင်ငံနှင့် ဒေသအလိုက် ကွာခြားနိုင်သောကြောင့် production မတင်မီ သက်ဆိုင်ရာ ဥပဒေပညာရှင်၊ accounting/payment provider နှင့် hosting provider တို့ဖြင့် ပြန်လည်စစ်ဆေးသင့်ပါသည်။

## 1. Production မတင်မီ အဓိကအချက်

Gwave သည် public merchandise၊ restricted Seeds/Farm Products၊ strain knowledge၊ COA workflow၊ customer orders နှင့် private payment-slip documents များ ပါဝင်သော full-stack system ဖြစ်သည်။ ထို့ကြောင့် production configuration ကို **public browser configuration**၊ **server-only secret** နှင့် **deployment/CI secret** ဟူ၍ သုံးမျိုးခွဲထားရမည်။

`VITE_` ဖြင့်စသော variable များသည် browser bundle ထဲသို့ ပါနိုင်သောကြောင့် password၊ JWT secret၊ database URL၊ private S3 key သို့မဟုတ် server API key များကို `VITE_` prefix အောက်တွင် မထားရပါ။ `JWT_SECRET`၊ `DATABASE_URL` နှင့် `BUILT_IN_FORGE_API_KEY` များကို client-side code ထဲ မထည့်ရပါ။

## 2. Environment Variables စာရင်း

### 2.1 Server-only variables — အရေးကြီးသော secrets

| Variable | လိုအပ်မှု | အသုံးပြုပုံ | လုံခြုံရေးအချက် |
|---|---:|---|---|
| `DATABASE_URL` | မဖြစ်မနေ | MySQL/TiDB database connection | Production database အတွက် SSL/TLS သုံးပြီး secret manager ထဲတွင်သာ သိမ်းပါ။ Git ထဲ မထည့်ပါနှင့်။ |
| `JWT_SECRET` | မဖြစ်မနေ | Session cookie signing နှင့် authentication | အရှည်ကြီး၊ ခန့်မှန်းမရသော random value သုံးပါ။ Development နှင့် production secret မတူရပါ။ |
| `OAUTH_SERVER_URL` | မဖြစ်မနေ | Manus OAuth backend URL | သတ်မှတ်ထားသော HTTPS endpoint ကိုသာ အသုံးပြုပါ။ |
| `BUILT_IN_FORGE_API_URL` | လိုအပ် | Server-side built-in Forge API endpoint | Production endpoint နှင့်သာ ချိတ်ဆက်ပါ။ |
| `BUILT_IN_FORGE_API_KEY` | လိုအပ် | Notification၊ storage နှင့် built-in server APIs | Server process ထဲတွင်သာ သုံးပါ။ Logs၊ browser response နှင့် error message များတွင် မဖော်ပြပါနှင့်။ |
| `OWNER_OPEN_ID` | လိုအပ် | Owner notification နှင့် owner-level workflow identification | Owner account တစ်ခုတည်းကို သတ်မှတ်ပြီး access ကို ပြန်စစ်ပါ။ |
| `OWNER_NAME` | လိုအပ်နိုင် | Owner notification display name | Secret မဟုတ်သော်လည်း server configuration အဖြစ် စီမံပါ။ |
| `GWAVE_PROFILE_REVIEW_REQUIRED` | အခြေအနေအလိုက် | Profile review safeguard ကို ဖွင့်/ပိတ်ရန် | Production တွင် လုပ်ငန်းမူဝါဒအတိုင်း သတ်မှတ်ပြီး default behavior ကို စာတမ်းတင်ပါ။ |
| `NODE_ENV` | မဖြစ်မနေ | Runtime ကို production mode သို့ သတ်မှတ်ရန် | `production` ဟု သတ်မှတ်ပါ။ Development diagnostics များ မဖွင့်ထားရပါ။ |

`server/_core/env.ts` တွင် လက်ရှိ code က `VITE_APP_ID`၊ `JWT_SECRET`၊ `DATABASE_URL`၊ `OAUTH_SERVER_URL`၊ `OWNER_OPEN_ID`၊ `BUILT_IN_FORGE_API_URL` နှင့် `BUILT_IN_FORGE_API_KEY` ကို တိုက်ရိုက်ဖတ်ယူထားပါသည်။ ထို့ကြောင့် အဆိုပါ variable များသည် production deployment တွင် မဖြစ်မနေ မှန်ကန်စွာရှိရမည်။

### 2.2 Browser-visible configuration — secret မဟုတ်သော values

| Variable | အသုံးပြုပုံ | လုံခြုံရေးအချက် |
|---|---|---|
| `VITE_APP_ID` | Manus OAuth application identity | Public identifier အဖြစ် သတ်မှတ်နိုင်သော်လည်း app တစ်ခုနှင့် တစ်ခု မရောပါနှင့်။ |
| `VITE_APP_TITLE` | Browser title၊ metadata နှင့် app name | Secret မဟုတ်ပါ။ Gwave brand name ကို တစ်သမတ်တည်း သုံးပါ။ |
| `VITE_APP_LOGO` | App logo နှင့် brand metadata | Public asset URL သာ သုံးပါ။ Private storage URL မသုံးပါနှင့်။ |
| `VITE_OAUTH_PORTAL_URL` | User login portal သို့ redirect | HTTPS URL သာ သုံးပြီး phishing domain မဖြစ်ကြောင်း စစ်ပါ။ |
| `VITE_FRONTEND_FORGE_API_URL` | Client-side built-in API proxy endpoint | Server secret မဟုတ်သော public proxy endpoint သာ ဖြစ်ရမည်။ |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend တွင် ခွင့်ပြုထားသော built-in API access | ဤတန်ဖိုးကို secret ဟု မယူဆပါနှင့်။ Server-only action များကို frontend key ဖြင့် မကာကွယ်ပါနှင့်။ |
| `VITE_ANALYTICS_ENDPOINT` | Analytics event endpoint | PII မပို့ဘဲ consent/privacy policy နှင့် ကိုက်ညီစွာ သုံးပါ။ |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics site identifier | Public identifier ဖြစ်နိုင်သော်လည်း production site နှင့် မှန်ကန်စွာ ချိတ်ပါ။ |

### 2.3 Infrastructure မှာ လိုအပ်နိုင်သော variables

အောက်ပါအမည်များသည် လက်ရှိ `env.ts` တွင် တိုက်ရိုက်ဖတ်ယူထားသော built-in variables မဟုတ်နိုင်ပါ။ Hosting provider သို့မဟုတ် custom deployment architecture တောင်းဆိုမှသာ ထည့်ပါ။ မလိုအပ်ဘဲ variable အသစ်များ မဖန်တီးပါနှင့်။

| Variable | အသုံးပြုရန်အခြေအနေ |
|---|---|
| `APP_URL` သို့မဟုတ် `PUBLIC_APP_URL` | OAuth callback၊ canonical URL၊ email link နှင့် social metadata အတွက် hosting layer က လိုအပ်လျှင် သုံးရန် |
| `CORS_ORIGIN` | Separate frontend/backend domain များရှိလျှင် origin ကို allowlist ပြုလုပ်ရန် |
| `LOG_LEVEL` | Production log verbosity ကို `info` သို့မဟုတ် `warn` အဖြစ် ထိန်းရန် |
| `SENTRY_DSN` သို့မဟုတ် monitoring DSN | Error monitoring service ကို သုံးမည်ဆိုမှသာ ထည့်ရန်၊ customer data မပို့ရန် |
| `GOOGLE_CLOUD_PROJECT_ID` | Android build၊ cloud deployment သို့မဟုတ် Google services အတွက် CI/build configuration တွင် သုံးရန် |
| `ANDROID_APPLICATION_ID` | APK/AAB package identity အတွက် build configuration တွင် သုံးရန် |

Database၊ S3/storage နှင့် built-in Forge credentials များသည် Manus-managed environment မှ auto-injected ဖြစ်ပါက ကိုယ်တိုင် hard-code မလုပ်ဘဲ management configuration မှသာ စီမံပါ။ Storage file bytes ကို database ထဲ မသိမ်းဘဲ S3 reference နှင့် metadata ကိုသာ အသုံးပြုရမည်။

## 3. Secret Management စည်းမျဉ်း

Production secret များကို `.env` file၊ GitHub repository၊ frontend source၊ screenshot၊ analytics event သို့မဟုတ် error response ထဲ မထည့်ပါနှင့်။ Secret manager သို့မဟုတ် hosting platform ၏ Secrets panel တွင် production environment အတွက် သီးခြားသိမ်းပါ။ Development၊ staging နှင့် production တွင် `JWT_SECRET`၊ database credential နှင့် API key များကို မတူညီစေရပါ။

Secret တစ်ခု ပေါက်ကြားသွားနိုင်သည်ဟု သံသယရှိပါက အဆိုပါ secret ကို ချက်ချင်း rotate လုပ်ပြီး session များ invalidate လုပ်ပါ။ Rotation ပြီးနောက် OAuth callback၊ owner alerts၊ payment-slip retrieval နှင့် database access များကို ပြန်လည်စမ်းသပ်ရမည်။ Secret rotation record ထဲတွင် မူရင်း secret ကို မရေးဘဲ rotation အချိန်၊ owner နှင့် affected service ကိုသာ မှတ်တမ်းတင်ပါ။

## 4. Authentication နှင့် Access Control

Gwave တွင် 21+ acknowledgement ကို authentication နှင့် မရောထွေးစေရပါ။ Age gate သည် access control ဖြစ်ပြီး user သည် သက်ဆိုင်ရာဥပဒေများကို လိုက်နာမည်ဟု explicit acknowledgement ပြုလုပ်ရမည်။ Restricted Seeds/Farm Products channel သည် sign-in၊ account-level acknowledgement နှင့် server-side validation များနောက်တွင်သာ ရှိရမည်။ Client-side button ကို ဖျောက်ထားခြင်းတစ်ခုတည်းကို security control အဖြစ် မယူဆရပါ။

Production တွင် အောက်ပါအချက်များကို စစ်ဆေးပါ။

| စစ်ဆေးရန် | လိုအပ်ချက် |
|---|---|
| Session cookie | HTTPS အောက်တွင် `Secure`၊ `HttpOnly` နှင့် သင့်တော်သော `SameSite` policy သုံးရန် |
| OAuth redirect | Production domain ကိုသာ allowlist ပြုလုပ်ရန်၊ localhost callback မကျန်စေရန် |
| Role control | `admin` နှင့် `staff` permission များကို server procedure အဆင့်တွင် စစ်ဆေးရန် |
| Admin route | Unauthenticated user သည် dashboard data မမြင်ရရန်၊ sign-in boundary ကို စစ်ရန် |
| COA access | Draft၊ rejected record၊ private document key များ public API response တွင် မပါစေရန် |
| Payment slips | Staff-only retrieval၊ signed URL expiry နှင့် audit event များ ရှိရန် |
| Order state | Client က ပေးပို့သော next status ကို မယုံဘဲ server workflow validator ဖြင့် စစ်ရန် |

## 5. Database နှင့် Storage Security

`DATABASE_URL` သည် TLS/SSL database connection ကို အသုံးပြုရမည်။ Production database user ကို အနည်းဆုံးလိုအပ်သော permission ပဲ ပေးပါ။ Application runtime user နှင့် migration/admin user ကို ခွဲထားနိုင်လျှင် ပိုမိုကောင်းမွန်သည်။ Destructive migration မလုပ်မီ schema၊ backup နှင့် rollback plan ကို ပြန်စစ်ပါ။

Payment slip၊ COA PDF နှင့် အခြား private document များကို public bucket သို့ မတင်ပါနှင့်။ Object key ကို database တွင် သိမ်းနိုင်သော်လည်း raw file bytes ကို database column ထဲ မသိမ်းပါနှင့်။ Download link များကို time-limited signed URL ဖြင့်သာ ထုတ်ပေးပြီး requester role၊ audit record နှင့် expiry ကို စစ်ဆေးပါ။

Backup တွင် database data နှင့် S3 metadata နှစ်မျိုးစလုံး ပါဝင်ရမည်။ Restore စမ်းသပ်မှု မရှိသော backup ကို အပြည့်အဝယုံကြည်ခြင်း မပြုပါနှင့်။ At least one staging restore test ကို launch မတိုင်မီ ပြုလုပ်ပါ။

## 6. Network နှင့် Application Security

Production domain တွင် HTTPS ကို မဖြစ်မနေ ဖွင့်ပြီး HTTP ကို HTTPS သို့ redirect လုပ်ပါ။ DNS၊ TLS certificate၊ renewal process နှင့် canonical host ကို စစ်ဆေးပါ။ Reverse proxy သို့မဟုတ် platform layer တွင် request size limit ထားပြီး payment-slip upload အတွက် file type၊ size၊ filename normalization နှင့် malware scanning policy ထည့်ပါ။

CORS ကို `*` မထားဘဲ ခွင့်ပြုထားသော production origin များကိုသာ allowlist ပြုလုပ်ပါ။ Admin၊ auth၊ upload နှင့် contact endpoint များတွင် rate limiting ထည့်ပါ။ SQL injection၊ XSS၊ CSRF၊ open redirect၊ IDOR နှင့် broken access-control test များကို pre-launch security review တွင် ထည့်သွင်းပါ။ User-provided title၊ news body၊ contact message နှင့် file metadata များကို raw HTML အဖြစ် မယုံကြည်ဘဲ sanitize/escape ပြုလုပ်ပါ။

## 7. Privacy၊ Analytics နှင့် Logging

Analytics တွင် email၊ phone၊ full address၊ payment-slip URL၊ COA private key၊ access token သို့မဟုတ် raw customer message များ မပို့ပါနှင့်။ Order funnel ကို anonymous event ID၊ product category နှင့် status transition လောက်ဖြင့် တိုင်းတာပါ။ Privacy policy တွင် age acknowledgement၊ order data၊ payment evidence၊ support communication၊ retention period နှင့် data deletion request တို့ကို ရှင်းပြပါ။

Production logs တွင် secret၊ cookie၊ OAuth token၊ signed URL၊ full address နှင့် payment data မပါစေရပါ။ Log တွင် timestamp၊ request ID၊ route၊ actor role၊ result နှင့် error class များကိုသာ ထည့်ပါ။ Owner alert များထဲတွင် payment slip ကို attachment အဖြစ် မပို့ဘဲ order reference နှင့် review link အတိုင်းအတာဖြင့်သာ ပို့ပါ။

## 8. Deployment Checklist

### Pre-deploy

1. Production domain၊ DNS နှင့် TLS certificate ကို ပြင်ဆင်ပါ။
2. Secret manager ထဲတွင် server-only variables များ ထည့်ပြီး variable name များကို source code နှင့် တိုက်စစ်ပါ။
3. Database migration ကို staging တွင် စမ်းပြီး schema နှင့် application version ကို ကိုက်ညီစေပါ။
4. S3/storage bucket policy ကို private ဖြစ်ကြောင်း စစ်ပါ။
5. OAuth production callback နှင့် logout flow ကို စမ်းပါ။
6. 21+ gate၊ restricted channel၊ admin boundary၊ COA public omission နှင့် private-slip authorization ကို စမ်းပါ။
7. TypeScript check၊ Vitest suite နှင့် production build ကို run ပါ။

### Post-deploy smoke test

| Test flow | မျှော်လင့်ရလဒ် |
|---|---|
| Homepage ကို unauthenticated ဝင်ခြင်း | 21+ gate အရင်ပြသရမည် |
| Age acknowledgement မလုပ်ဘဲ Store/restricted path ဝင်ခြင်း | Access မရရမည် |
| English/Myanmar switch ပြောင်းခြင်း | UI labels ပြောင်းပြီး preference ဆက်ရှိရမည် |
| Public strain detail ဖတ်ခြင်း | Source status နှင့် approved COA summary သာ ပြရမည် |
| Customer order ဖန်တီးခြင်း | Email/phone/address နှင့် order reference မှန်ကန်ရမည် |
| Payment slip upload | Private storage၊ staff queue နှင့် owner alert အလုပ်လုပ်ရမည် |
| Admin/COA ကို unauthenticated ဝင်ခြင်း | Sign-in boundary သို့ ရောက်ရမည် |
| Staff signed link အသုံးပြုခြင်း | Role၊ audit နှင့် expiry စည်းမျဉ်းများ အလုပ်လုပ်ရမည် |

## 9. APK/Android အတွက် ခွဲခြားစီမံရန်အချက်များ

APK/AAB build အတွက် Google Cloud Project ID၊ Android application/package ID၊ app signing key၊ keystore password၊ Firebase/Google service configuration နှင့် Play Console account configuration များသည် **server runtime variables မဟုတ်ဘဲ build/deployment secrets** ဖြစ်သည်။ ထိုတန်ဖိုးများကို mobile source code၊ public repository သို့မဟုတ် APK ထဲတွင် မထည့်ပါနှင့်။ Keystore နှင့် signing password ကို သီးခြား secret manager/CI credential အဖြစ် ထိန်းသိမ်းပြီး release build access ကို လူနည်းစုသာ ရရှိစေပါ။

Android app တွင် production HTTPS endpoint ကိုသာ သုံးပါ။ Debug endpoint၊ localhost URL၊ test OAuth callback၊ development API key နှင့် unrestricted WebView setting များ မကျန်စေရပါ။ APK release မတိုင်မီ 21+ gate၊ language switcher၊ login၊ checkout၊ upload၊ order tracking နှင့် logout ကို physical Android device တွင် စမ်းပါ။

## 10. Production အတည်ပြုလက်မှတ် Checklist

Production ကို အများပြည်သူထံ ဖွင့်မည့်အချိန်တွင် အောက်ပါအချက်များကို owner၊ technical operator နှင့် compliance reviewer တို့က အတည်ပြုလက်မှတ်ထိုးထားသင့်သည်။

| အပိုင်း | အတည်ပြုရန် |
|---|---|
| Environment | Required variables အားလုံးရှိပြီး staging secret မကျန် |
| Authentication | OAuth callback၊ cookie security နှင့် role boundary မှန်ကန် |
| Commerce | Order၊ upload၊ status transition နှင့် notification စမ်းပြီး |
| Privacy | Policy၊ retention နှင့် analytics data minimization စစ်ပြီး |
| Storage | Private object policy၊ signed URL expiry နှင့် restore test ပြီး |
| Monitoring | Error alert၊ uptime check နှင့် owner escalation ရှိ |
| Android | Release package identity၊ signing နှင့် production endpoint မှန် |
| Compliance | သက်ဆိုင်ရာ ဒေသ၏ အသက်ကန့်သတ်၊ ရောင်းဝယ်ရေး၊ payment နှင့် advertising စည်းမျဉ်းများကို ပြန်လည်စစ်ပြီး |

## နောက်ဆုံးအကြံပြုချက်

အရင်ဆုံး production server ကို တိုက်ရိုက်မတင်ဘဲ **staging environment တစ်ခု** ထားပြီး အထက်ပါ smoke test အားလုံးကို စမ်းသင့်ပါသည်။ ထို့နောက် production secret များကို ထည့်သွင်းပြီး database/storage backup နှင့် restore ကို စမ်းကာမှ launch လုပ်ပါ။ လက်ရှိ Gwave တွင် 21+ gate၊ private payment-slip workflow၊ COA boundary နှင့် bilingual UI အခြေခံများ ရှိပြီးသားဖြစ်သော်လည်း authenticated staff/admin visual audit နှင့် real approved COA record test များကို production မတင်မီ ပြီးစီးအောင် လုပ်သင့်ပါသည်။
