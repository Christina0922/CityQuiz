plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.geniusbrain.cityquiz"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.geniusbrain.cityquiz"
        minSdk = 24
        targetSdk = 36

        // ✅ 구글 플레이에 AAB 업데이트할 때마다 반드시 증가해야 합니다.
        // 예: 1 -> 2 -> 3 -> 4 ...
        versionCode = 6

        // ✅ 사용자에게 보이는 버전 표기(권장: 같이 올리기)
        versionName = "1.0.6"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        val keystoreFile = file("../keystore/cityquiz.jks")
        if (keystoreFile.exists()) {
            create("release") {
                storeFile = keystoreFile
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "cityquiz123"
                keyAlias = System.getenv("KEY_ALIAS") ?: "cityquiz"
                keyPassword = System.getenv("KEY_PASSWORD") ?: "cityquiz123"
            }
            // externalOverride는 안드로이드 스튜디오 GUI에서 설정된 경우를 대비
            create("externalOverride") {
                storeFile = keystoreFile
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "cityquiz123"
                keyAlias = System.getenv("KEY_ALIAS") ?: "cityquiz"
                keyPassword = System.getenv("KEY_PASSWORD") ?: "cityquiz123"
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // keystore 파일이 존재할 때만 signing config 적용
            val keystoreFile = file("../keystore/cityquiz.jks")
            if (keystoreFile.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)

    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}
