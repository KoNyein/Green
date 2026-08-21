plugins {
    id("com.android.application")
}

android {
    namespace = "com.gwave.marketplace"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.gwave.marketplace"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            // Configure the release signing properties locally or through CI secrets.
            // Never commit a keystore or passwords to this repository.
            val keystorePath = providers.gradleProperty("GWAVE_RELEASE_STORE_FILE").orNull
            val keystorePassword = providers.gradleProperty("GWAVE_RELEASE_STORE_PASSWORD").orNull
            val keyAlias = providers.gradleProperty("GWAVE_RELEASE_KEY_ALIAS").orNull
            val keyPassword = providers.gradleProperty("GWAVE_RELEASE_KEY_PASSWORD").orNull
            if (keystorePath != null && keystorePassword != null && keyAlias != null && keyPassword != null) {
                signingConfig = signingConfigs.create("releaseConfigured") {
                    storeFile = file(keystorePath)
                    storePassword = keystorePassword
                    this.keyAlias = keyAlias
                    this.keyPassword = keyPassword
                }
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.13.0")
}
