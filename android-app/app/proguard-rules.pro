# Gwave uses a WebView shell without a JavaScript bridge.
# Keep Android framework entry points and WebView classes discoverable to R8.
-keep class com.gwave.marketplace.MainActivity { *; }
-keep class android.webkit.** { *; }
