# Gwave Native Android Shell

ဒီ directory သည် Gwave production website ကို native Android WebView shell ဖြင့် ထုပ်ပိုးရန် အသုံးပြုမည့် Android Studio/Gradle project ဖြစ်ပါသည်။ App သည် `https://gwavemktplce-7yjbfgj4.manus.space` ကိုသာ WebView အတွင်း ဖွင့်ပြီး GitHub, Discord, payment provider နှင့် အခြား third-party URL များကို Android အပြင်ဘက် browser/app သို့ လွှဲပေးပါသည်။ WebView မှာ JavaScript နှင့် DOM storage ကိုသာ လိုအပ်သလောက် ဖွင့်ထားပြီး JavaScript bridge မထည့်ထားပါ။

## Owner decisions required before release

| Setting | Current value | Owner action |
| --- | --- | --- |
| Application ID | `com.gwave.marketplace` | Confirm or replace before first Play Console upload; it cannot be changed for the same app listing. |
| Production origin | `https://gwavemktplce-7yjbfgj4.manus.space` | Replace only after a stable custom domain is selected. |
| Version | `1.0.0` / code `1` | Increment `versionCode` for every update. |
| Signing | Placeholder Gradle properties | Use Play App Signing with a separately protected upload key. |
| Google Cloud project | Not configured | Provide the project ID only if native Google APIs are later added. |

## Open and run locally

Install Android Studio with an Android SDK that supports `compileSdk = 35`, then open `/android-app` as an existing Gradle project. Connect an emulator or physical device, accept the 21+ gate in the app, and verify login, knowledge records, product detail, checkout, payment-slip upload, Discord external navigation, back navigation, screen rotation, and offline/error behavior.

If a Gradle wrapper is not present, Android Studio can generate it. From the `android-app` directory, use a locally installed compatible Gradle version to run `gradle wrapper --gradle-version 8.7`. Do not commit a keystore, passwords, or local SDK paths.

## Debug APK

```bash
cd android-app
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The debug application ID is `com.gwave.marketplace.debug`. The `Run` action in Android Studio creates a development artifact intended for adb; use `assembleDebug` when you need a directly installable debug APK.

## Release APK and Play Store AAB

For a locally signed release artifact, keep the keystore outside the repository and pass signing values through Gradle properties or CI secrets:

```bash
cd android-app
./gradlew :app:assembleRelease \
  -PGWAVE_RELEASE_STORE_FILE=/secure/keys/gwave-upload.jks \
  -PGWAVE_RELEASE_STORE_PASSWORD="$GWAVE_RELEASE_STORE_PASSWORD" \
  -PGWAVE_RELEASE_KEY_ALIAS="$GWAVE_RELEASE_KEY_ALIAS" \
  -PGWAVE_RELEASE_KEY_PASSWORD="$GWAVE_RELEASE_KEY_PASSWORD"

./gradlew :app:bundleRelease \
  -PGWAVE_RELEASE_STORE_FILE=/secure/keys/gwave-upload.jks \
  -PGWAVE_RELEASE_STORE_PASSWORD="$GWAVE_RELEASE_STORE_PASSWORD" \
  -PGWAVE_RELEASE_KEY_ALIAS="$GWAVE_RELEASE_KEY_ALIAS" \
  -PGWAVE_RELEASE_KEY_PASSWORD="$GWAVE_RELEASE_KEY_PASSWORD"
```

The APK is written under `app/build/outputs/apk/release/`; the bundle is written under `app/build/outputs/bundle/release/`. Inspect release artifacts with Android Studio APK Analyzer and verify the certificate with `apksigner verify --verbose app/build/outputs/apk/release/app-release.apk`.

For Google Play, upload the signed `.aab`, enable Play App Signing, and retain the upload key separately from Google’s app-signing key. New Play apps should use Android App Bundles rather than publishing a standalone APK. A signed APK is still useful for direct QA and controlled distribution.

## Create the upload key

Run this on a secure workstation, not in the repository and not in chat:

```bash
keytool -genkeypair -v \
  -keystore /secure/keys/gwave-upload.jks \
  -alias gwave-upload \
  -keyalg RSA -keysize 4096 -validity 10000
```

Back up the keystore in an encrypted secret manager. Record the SHA-256 certificate fingerprint in the project’s operational runbook. Never commit `*.jks`, `*.keystore`, passwords, or signing reports.

## Security behavior implemented

The manifest requests only `INTERNET`, disables cleartext traffic, and disables backup. The Activity accepts only the Gwave HTTPS origin inside WebView; all other HTTP(S) origins and schemes such as `mailto:`, `tel:`, and Discord links are opened with an external Android handler. Safe Browsing hits are sent back to safety. No `addJavascriptInterface` bridge is used. Cookies and DOM storage are enabled because Manus OAuth and the existing web application require session persistence.

This is a WebView shell, not a fully offline native rewrite. The app requires an active network connection and the production Gwave domain must remain available. If a true native implementation is required later, the catalogue, checkout, OAuth, payment-slip, and 3D showroom flows should be migrated incrementally rather than duplicating the backend.

## GitHub Actions CI/CD

The workflow at `../.github/workflows/android.yml` builds a debug APK automatically for pull requests and pushes to `main` whenever `android-app/**` changes. It also supports a manual signed AAB build from the Actions tab when the `release` input is set to `true`. Debug artifacts are retained for 14 days; release AAB artifacts and the R8 mapping file are retained for 30 days.

Create a protected GitHub environment named `android-release`, then add these repository or environment secrets. The environment should require reviewer approval before the release job can run.

| Secret | Value |
| --- | --- |
| `ANDROID_UPLOAD_KEYSTORE_BASE64` | Base64 encoding of the upload `.jks` file, created locally with `base64 -w 0 gwave-upload.jks`. |
| `GWAVE_RELEASE_STORE_PASSWORD` | Keystore password. |
| `GWAVE_RELEASE_KEY_ALIAS` | Usually `gwave-upload`. |
| `GWAVE_RELEASE_KEY_PASSWORD` | Private key password. |

Never put these values in workflow YAML, commits, logs, or pull-request comments. The release job decodes the keystore into the temporary GitHub runner directory, uses it for the AAB build, and does not upload the keystore as an artifact.

To start a release build, open **Actions > Android build > Run workflow**, choose the `main` branch, set `release` to `true`, and approve the protected `android-release` environment if GitHub requests approval. The workflow does not publish directly to Google Play; download the signed AAB artifact and upload it through Play Console internal testing first. Automatic Play publishing can be added later only after a Google Play service-account credential and a deliberate publishing approval policy are configured.

## Release QA checklist

1. Confirm the app opens the production HTTPS origin and does not permit cleartext HTTP.
2. Confirm the mandatory 21+ acknowledgement remains visible and is not bypassed by app restart.
3. Confirm Manus OAuth callback and session cookies work inside the WebView.
4. Confirm external Discord, mail, phone, and payment links open outside the WebView.
5. Confirm strain records show complete public fields without raw source URLs.
6. Confirm payment-slip upload, staff review, and order-status flows remain server-authorized.
7. Test Android back navigation, rotation, process recreation, slow network, no network, TalkBack, and small-screen layouts.
8. Increment `versionCode`, build a signed AAB, inspect it, upload it to Play Console internal testing, and test the resulting Play-installed build before production rollout.

## References

[1]: https://developer.android.com/develop/ui/views/layout/webapps/webview "Android Developers: Build web apps in WebView"
[2]: https://developer.android.com/studio/publish/app-signing "Android Developers: Sign your app"
[3]: https://developer.android.com/guide/app-bundle "Android Developers: About Android App Bundles"
[4]: https://developer.android.com/build/build-for-release "Android Developers: Build your app for release to users"
