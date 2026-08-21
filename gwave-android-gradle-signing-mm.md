# Gwave Android APK — Gradle Build Configuration နှင့် Signing Keystore လမ်းညွှန်

> **အရေးကြီးသော assumption** — လက်ရှိ Gwave သည် React/Vite full-stack web project ဖြစ်သောကြောင့် Android package မထုတ်မီ Capacitor wrapper သို့မဟုတ် သီးခြား Android WebView shell တစ်ခုကို ရွေးရမည်။ အောက်ပါ configuration သည် **Capacitor Android wrapper** ကို အဓိကထားရေးသားထားပြီး၊ native Android project ရှိပြီးသားဆိုလျှင် Gradle အပိုင်းများကို တိုက်ရိုက်အသုံးပြုနိုင်သည်။ APK/AAB signing သည် application identity နှင့် release key ကို အတည်ပြုသည့် လုံခြုံရေးအဆင့်ဖြစ်သည်။ Android official guidance အရ app signing သည် app identity နှင့် update trust chain အတွက် အရေးကြီးပါသည်။ [1] [2]

## 1. အရင်ဆုံး သတ်မှတ်ရမည့် Android Identity

| Setting | Gwave အတွက် နမူနာ | မှတ်ချက် |
|---|---|---|
| Application name | `Gwave` | User-facing app name |
| Package/Application ID | `com.gwave.marketplace` | Production တွင် တစ်ကြိမ်သတ်မှတ်ပြီး မပြောင်းသင့်ပါ |
| Version code | `1`, `2`, `3` … | Google Play update အတွက် အမြဲတိုးရမည် |
| Version name | `1.0.0`, `1.0.1` … | User-facing semantic version |
| Production URL | `https://your-production-domain.example` | `localhost` သို့မဟုတ် staging URL မသုံးရ |
| Minimum SDK | လုပ်ငန်းလိုအပ်ချက်အတိုင်း | Device support နှင့် security updates ကို ချိန်ညှိရမည် |
| Target/Compile SDK | လက်ရှိ stable Android SDK | Release မတိုင်မီ Android official compatibility ကို ပြန်စစ်ရမည် |

`com.gwave.marketplace` သည် နမူနာသာဖြစ်သည်။ Google Play Console၊ domain၊ package ID နှင့် signing identity တို့ကို အစကတည်းက တစ်သမတ်တည်း သတ်မှတ်ပါ။ Package ID ပြောင်းလဲခြင်းသည် app အသစ်တစ်ခုအဖြစ် သတ်မှတ်ခံရနိုင်သောကြောင့် production မတင်မီ owner က အတည်ပြုသင့်သည်။

## 2. Capacitor Wrapper တည်ဆောက်ခြင်း

Gwave web app ကို Android app အဖြစ် wrapper လုပ်မည်ဆိုလျှင် project root တွင် Capacitor dependencies ထည့်ပြီး web build output ကို Android project ထဲသို့ sync လုပ်ပါ။ သင့် project ၏ package manager နှင့် Node version ကို lockfile အတိုင်း အသုံးပြုပါ။

```bash
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/android
pnpm exec cap init Gwave com.gwave.marketplace --web-dir dist/public
pnpm exec cap add android
```

Vite build output directory သည် project configuration အရ `dist/public` မဟုတ်ပါက `capacitor.config.ts` တွင် မှန်ကန်သော directory ကို သတ်မှတ်ပါ။ ဥပမာ —

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gwave.marketplace',
  appName: 'Gwave',
  webDir: 'dist/public',
  server: {
    // Production တွင် မသုံးပါနှင့်။ Local development အတွက်သာ အသုံးပြုပါ။
    // url: 'http://10.0.2.2:3000',
    cleartext: false,
  },
};

export default config;
```

Production APK တွင် remote server URL ကို hard-code လုပ်ထားသော development `server.url` မပါရပါ။ Production web assets ကို bundle ထဲ ထည့်နိုင်သကဲ့သို့ trusted HTTPS domain ကို web app configuration အရ သုံးနိုင်သည်။ မည်သည့်ပုံစံကိုရွေးရွေး authentication callback၊ upload၊ cookies နှင့် deep link behavior ကို Android device ပေါ်တွင် သီးခြားစမ်းသပ်ပါ။

## 3. `android/app/build.gradle.kts` Configuration

Capacitor version နှင့် Android Gradle Plugin version အပေါ်မူတည်၍ generated file ၏ အမည်များကွာနိုင်သည်။ Generated project ၏ version ကို မပြောင်းဘဲ အောက်ပါ structure ကို reference အဖြစ် အသုံးပြုပါ။

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    namespace = "com.gwave.marketplace"
    compileSdk = 35 // လက်ရှိ stable SDK နှင့် project compatibility ကို ပြန်စစ်ပါ

    defaultConfig {
        applicationId = "com.gwave.marketplace"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            isMinifyEnabled = false
        }

        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
```

`compileSdk`၊ `targetSdk` နှင့် Java/Gradle version များကို အထက်ပါနံပါတ်အတိုင်း မျက်စိမှိတ်မသုံးဘဲ generated Capacitor project နှင့် လက်ရှိ Android Studio/AGP compatibility matrix အတိုင်း သတ်မှတ်ပါ။ Android build variants များကို debug/release သီးခြားခွဲ၍ သတ်မှတ်နိုင်ပြီး၊ official Android documentation တွင် build types နှင့် variants များ၏ အလုပ်လုပ်ပုံကို ဖော်ပြထားပါသည်။ [3]

## 4. Signing Configuration ကို လုံခြုံစွာ ထည့်ခြင်း

Keystore password၊ key password နှင့် keystore file path ကို `build.gradle.kts` ထဲ hard-code မလုပ်ပါနှင့်။ Local development တွင် `~/.gradle/gradle.properties` သို့မဟုတ် environment variables သုံးပါ။ CI/CD တွင် repository secret manager မှ inject လုပ်ပါ။

```kotlin
import java.util.Properties

val signingProperties = Properties()
val signingFile = rootProject.file("signing.properties")
if (signingFile.exists()) {
    signingFile.inputStream().use { signingProperties.load(it) }
}

android {
    signingConfigs {
        create("release") {
            storeFile = signingProperties["storeFile"]?.toString()?.let(::file)
            storePassword = signingProperties["storePassword"]?.toString()
            keyAlias = signingProperties["keyAlias"]?.toString()
            keyPassword = signingProperties["keyPassword"]?.toString()
        }
    }
}
```

Local-only `signing.properties` ဥပမာ —

```properties
storeFile=/secure/local/path/gwave-upload-keystore.jks
storePassword=USE_A_SECRET_MANAGER_VALUE
keyAlias=gwave-release
keyPassword=USE_A_SECRET_MANAGER_VALUE
```

အောက်ပါ file များကို `.gitignore` ထဲ မဖြစ်မနေ ထည့်ပါ။

```gitignore
android/signing.properties
android/*.jks
android/*.keystore
*.keystore
*.jks
```

`signing.properties` သည် source control ထဲ မဝင်သင့်ပါ။ CI တွင် file တစ်ခုအဖြစ် ခဏတည်ဆောက်ပြီး build ပြီးလျှင် ဖျက်နိုင်သည်။ Keystore ကို artifact အဖြစ် upload မလုပ်ဘဲ encrypted secret storage တွင် သိမ်းပါ။

## 5. Signing Keystore ဖန်တီးခြင်း

Java JDK 17 နှင့် `keytool` ရှိကြောင်း စစ်ဆေးပါ။ Keystore ကို project folder ထဲ မဖန်တီးဘဲ secure directory တစ်ခုတွင် ဖန်တီးပါ။

```bash
java -version
keytool -version
mkdir -p "$HOME/secure/gwave-android"

keytool -genkeypair \
  -v \
  -keystore "$HOME/secure/gwave-android/gwave-upload-keystore.jks" \
  -alias gwave-release \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000 \
  -storetype PKCS12 \
  -dname "CN=Gwave, OU=Mobile, O=Gwave, L=Yangon, ST=Yangon, C=MM"
```

Command run ချိန်တွင် keystore password နှင့် key password ကို interactive အဖြစ် ထည့်ပါ။ Password များကို command history၊ shell script၊ screenshot၊ chat သို့မဟုတ် Git commit ထဲ မရေးပါနှင့်။ `C=MM`၊ location နှင့် organization name များကို အမှန်တကယ် business identity အတိုင်း ပြောင်းပါ။

Keystore ကို ဖန်တီးပြီးနောက် certificate fingerprint ကို မှတ်တမ်းတင်ပါ။

```bash
keytool -list -v \
  -keystore "$HOME/secure/gwave-android/gwave-upload-keystore.jks" \
  -alias gwave-release
```

အနည်းဆုံး SHA-256 fingerprint၊ alias၊ keystore type နှင့် creation date ကို password မပါဘဲ secure asset register ထဲတွင် မှတ်တမ်းတင်ပါ။ Keystore ပျောက်ဆုံးခြင်း သို့မဟုတ် password မေ့ခြင်းသည် future update signing ကို ထိခိုက်နိုင်သောကြောင့် encrypted backup နှစ်နေရာထားပြီး access ကို လူနည်းစုသာ ပေးပါ။

## 6. APK နှင့် AAB Build Commands

Web app ကို အရင် build လုပ်ပြီး Android assets ကို sync လုပ်ပါ။

```bash
pnpm run build
pnpm exec cap sync android
```

Debug APK — local device testing အတွက်သာ ဖြစ်သည်။

```bash
cd android
./gradlew assembleDebug
```

Release APK — direct installation/testing အတွက် ဖြစ်သည်။

```bash
cd android
./gradlew assembleRelease
```

Google Play upload အတွက် Android App Bundle ကို အဓိကသုံးပါ။

```bash
cd android
./gradlew bundleRelease
```

ပုံမှန် output path များမှာ —

```text
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```

Google Play ဖြန့်ချိမည်ဆိုလျှင် Play App Signing ကို သုံးရန်စဉ်းစားပါ။ Google ၏ Play App Signing workflow တွင် upload key နှင့် app signing key ကို ခွဲခြားစီမံနိုင်ပြီး signing key ကို Google-managed infrastructure တွင် ထိန်းသိမ်းနိုင်သည်။ [4]

## 7. `AndroidManifest.xml` လုံခြုံရေး

Gwave သည် production API ကို HTTPS ဖြင့်သာ ခေါ်ရမည်။ AndroidManifest တွင် Internet permission လိုအပ်နိုင်သော်လည်း cleartext HTTP ကို ခွင့်မပြုပါနှင့်။

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="Gwave"
        android:usesCleartextTraffic="false"
        android:allowBackup="false"
        android:supportsRtl="true">
        <!-- Capacitor generated activity configuration remains here. -->
    </application>
</manifest>
```

Actual generated Capacitor manifest နှင့် merge result ကို Android Studio တွင် စစ်ပါ။ `allowBackup` policy သည် business data နှင့် device backup requirements အပေါ် မူတည်သောကြောင့် compliance/security review ဖြင့် အတည်ပြုပါ။ Debug build တွင်သာ local HTTP လိုအပ်ပါက debug-specific network security config ခွဲသုံးပြီး release build ထဲ မပါစေရပါ။

## 8. Gwave-specific Release Configuration

APK ထဲသို့ ထည့်မည့် production endpoint သည် HTTPS domain ဖြစ်ရမည်။ အောက်ပါအချက်များကို release build မတိုင်မီ စစ်ပါ။

| အချက် | Release requirement |
|---|---|
| API/base URL | Production HTTPS URL သာ ဖြစ်ရမည် |
| OAuth callback | Production domain နှင့် package/deep-link configuration ကိုက်ညီရမည် |
| 21+ gate | App စတင်ချိန်တွင် ဆက်လက်အလုပ်လုပ်ရမည် |
| Restricted products | Sign-in နှင့် acknowledgement boundary မလျော့ရ |
| Payment upload | Private storage၊ signed retrieval နှင့် expiry ဆက်ရှိရမည် |
| Language | English/Myanmar switcher နှင့် persistence အလုပ်လုပ်ရမည် |
| Analytics | PII၊ payment data နှင့် private document URL မပို့ရ |
| Debugging | Debug logs၊ test endpoint နှင့် dev menu မပါရ |

## 9. CI/CD တွင် Signing Secret ထည့်သွင်းခြင်း

CI platform တွင် အောက်ပါ secret များကို encrypted secret အဖြစ် ထည့်ပါ။

| CI secret | အသုံးပြုပုံ |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Keystore binary ကို base64 ဖြင့် ခဏပြန်တည်ဆောက်ရန် |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `gwave-release` |
| `ANDROID_KEY_PASSWORD` | Key password |
| `GWAVE_PRODUCTION_URL` | Release build တွင် သုံးမည့် production endpoint |

CI step နမူနာ —

```bash
mkdir -p android/secure
printf '%s' "$ANDROID_KEYSTORE_BASE64" | base64 --decode > android/secure/gwave-upload-keystore.jks

cat > android/signing.properties <<EOF
storeFile=$PWD/secure/gwave-upload-keystore.jks
storePassword=$ANDROID_KEYSTORE_PASSWORD
keyAlias=$ANDROID_KEY_ALIAS
keyPassword=$ANDROID_KEY_PASSWORD
EOF

pnpm run build
pnpm exec cap sync android
cd android
./gradlew bundleRelease
rm -f signing.properties secure/gwave-upload-keystore.jks
```

CI log ထဲတွင် secret masking အလုပ်လုပ်ကြောင်း စစ်ပါ။ `set -x` မသုံးပါနှင့်။ Artifact upload ပြီးနောက် temporary keystore နှင့် properties file မကျန်ကြောင်း cleanup step ဖြင့် စစ်ပါ။ Production signing key ကို pull request build များတွင် မသုံးဘဲ protected release branch သို့မဟုတ် manual approval နောက်မှသာ အသုံးပြုပါ။

## 10. APK/AAB Verification

Build ပြီးနောက် package identity၊ version၊ certificate နှင့် endpoint ကို စစ်ပါ။

```bash
apkanalyzer manifest application-id android/app/build/outputs/apk/release/app-release.apk
apkanalyzer manifest version-code android/app/build/outputs/apk/release/app-release.apk
apkanalyzer manifest version-name android/app/build/outputs/apk/release/app-release.apk

apksigner verify --verbose --print-certs \
  android/app/build/outputs/apk/release/app-release.apk
```

စစ်ဆေးရမည့်အချက်များမှာ `com.gwave.marketplace` application ID မှန်ကန်မှု၊ version code တိုးထားမှု၊ SHA-256 certificate fingerprint မှန်ကန်မှု၊ v2/v3 signing scheme အလုပ်လုပ်မှု၊ release build တွင် cleartext traffic မရှိမှုနှင့် debug suffix မပါမှုတို့ ဖြစ်သည်။

Physical Android device တွင် အောက်ပါ smoke test ကို ပြုလုပ်ပါ။

| Test | မျှော်လင့်ရလဒ် |
|---|---|
| App install/update | Existing app ကို package ID မပြောင်းဘဲ update လုပ်နိုင်ရမည် |
| 21+ gate | Explicit acknowledgement မရှိဘဲ public app experience မဖွင့်ရ |
| Language switch | English ↔ Myanmar ပြောင်းပြီး app restart နောက် preference ဆက်ရှိရမည် |
| OAuth | Login၊ logout နှင့် callback loop မဖြစ်ရ |
| Store/Knowledge | Search၊ filters နှင့် source/COA distinction မှန်ရမည် |
| Checkout | Email၊ phone၊ address နှင့် order reference မှန်ရမည် |
| Slip upload | Upload error၊ progress နှင့် private retrieval boundary စမ်းရမည် |
| Network loss | Error state ရှင်းလင်းပြီး sensitive data မဖော်ပြရ |
| Back navigation | WebView history နှင့် app back behavior မပျက်ရ |

## 11. Keystore လုံခြုံရေးအတွက် မဖြစ်မနေလိုက်နာရန်

Keystore ကို Git၊ Google Drive public link၊ chat attachment၊ APK asset၊ Docker image သို့မဟုတ် team shared folder ထဲ မထည့်ပါနှင့်။ Encrypted password manager/secret manager ထဲတွင် သိမ်းပြီး backup owner နှင့် recovery procedure သတ်မှတ်ပါ။ Keystore password နှင့် alias ကို source code ထဲ မရေးပါနှင့်။ Developer တစ်ဦးထွက်ခွာသွားခြင်း၊ password leak ဖြစ်ခြင်း သို့မဟုတ် CI compromise ဖြစ်ခြင်းရှိပါက key access revoke/rotate plan ရှိရမည်။

Play App Signing ကို အသုံးပြုမည်ဆိုလျှင် upload key ကို CI တွင်သုံးပြီး Google-managed app signing key နှင့် ခွဲထားပါ။ Google Play Console တွင် package ID၊ signing certificate၊ upload certificate နှင့် Play App Signing status ကို တစ်နေရာတည်းတွင် မှတ်တမ်းတင်ပါ။

## 12. Gwave အတွက် အကောင်အထည်ဖော်ရမည့် အစီအစဉ်

ပထမအဆင့်တွင် package ID နှင့် production domain ကို owner က အတည်ပြုရမည်။ ဒုတိယအဆင့်တွင် Capacitor Android project ကို generated template ဖြင့် ဖန်တီးပြီး debug build ဖြင့် device test ပြုလုပ်ရမည်။ တတိယအဆင့်တွင် release keystore ကို secure environment တွင် ဖန်တီးပြီး fingerprint ကို မှတ်တမ်းတင်ရမည်။ စတုတ္ထအဆင့်တွင် CI signing secret များ ထည့်ပြီး release AAB/APK ထုတ်ရမည်။ နောက်ဆုံးတွင် APK signature၊ production endpoint၊ 21+ gate၊ login၊ order၊ payment-slip၊ language switcher နှင့် staff boundary များကို စစ်ဆေးပြီးမှ ဖြန့်ချိသင့်ပါသည်။

## References

[1]: https://developer.android.com/studio/publish/app-signing "Sign your app — Android Developers"

[2]: https://source.android.com/docs/security/features/apksigning "App signing — Android Open Source Project"

[3]: https://developer.android.com/build/build-variants "Configure build variants — Android Developers"

[4]: https://support.google.com/googleplay/android-developer/answer/9842756 "Use Play App Signing — Google Play Console Help"
