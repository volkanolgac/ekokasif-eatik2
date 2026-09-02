plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.ekokasif.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ekokasif.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    kotlinOptions {
        jvmTarget = "21"
    }
    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.webkit)
}

tasks.register("copyWebAssets") {
    doLast {
        val distDir = file("${rootDir}/dist")
        val assetsDir = file("${projectDir}/src/main/assets")
        if (distDir.exists()) {
            assetsDir.mkdirs()
            copy {
                from(distDir)
                into(assetsDir)
            }
        }
    }
}

tasks.named("preBuild") {
    dependsOn("copyWebAssets")
}
