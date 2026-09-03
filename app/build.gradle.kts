import java.io.FileInputStream
import java.security.KeyStore

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

fun findKeystoreFile(): File? {
    val candidates = listOf(
        project.findProperty("android.injected.signing.store.file")?.toString(),
        project.findProperty("RELEASE_STORE_FILE")?.toString(),
        project.findProperty("KEYSTORE_PATH")?.toString(),
        System.getenv("ANDROID_KEYSTORE_PATH"),
        System.getenv("KEYSTORE_PATH"),
        System.getenv("STORE_FILE"),
        System.getenv("RELEASE_KEYSTORE_PATH"),
        System.getenv("RELEASE_STORE_FILE"),
        System.getenv("SIGNING_KEY_FILE"),
        System.getenv("SIGNING_KEYSTORE_PATH")
    )
    for (candidate in candidates) {
        if (!candidate.isNullOrBlank()) {
            val f = file(candidate)
            if (f.exists() && f.isFile) return f
        }
    }
    val tmpDir = File("/tmp")
    if (tmpDir.exists() && tmpDir.isDirectory) {
        val jksFiles = tmpDir.listFiles { _, name ->
            (name.endsWith(".jks") || name.endsWith(".keystore")) && !name.contains("debug")
        }
        if (!jksFiles.isNullOrEmpty()) {
            return jksFiles.first()
        }
    }
    return null
}

fun resolveStorePassword(): String {
    val candidates = listOf(
        project.findProperty("android.injected.signing.store.password")?.toString(),
        project.findProperty("RELEASE_STORE_PASSWORD")?.toString(),
        project.findProperty("KEYSTORE_PASSWORD")?.toString(),
        System.getenv("ANDROID_KEYSTORE_PASSWORD"),
        System.getenv("KEYSTORE_PASSWORD"),
        System.getenv("STORE_PASSWORD"),
        System.getenv("RELEASE_STORE_PASSWORD"),
        System.getenv("RELEASE_KEYSTORE_PASSWORD"),
        System.getenv("SIGNING_STORE_PASSWORD"),
        System.getenv("SIGNING_KEY_STORE_PASSWORD")
    )
    for (candidate in candidates) {
        if (!candidate.isNullOrBlank()) return candidate
    }
    return ""
}

fun resolveRealAlias(keystoreFile: File, storePass: String, requestedAlias: String?): String? {
    if (!requestedAlias.isNullOrBlank() && requestedAlias != "androiddebugkey") {
        return requestedAlias
    }
    val types = listOf(KeyStore.getDefaultType(), "JKS", "PKCS12", "BKS")
    for (type in types) {
        try {
            val ks = KeyStore.getInstance(type)
            FileInputStream(keystoreFile).use { fis ->
                ks.load(fis, storePass.toCharArray())
            }
            val aliases = ks.aliases().toList()
            if (!requestedAlias.isNullOrBlank() && aliases.contains(requestedAlias)) {
                return requestedAlias
            }
            for (alias in aliases) {
                if (ks.isKeyEntry(alias)) {
                    return alias
                }
            }
            if (aliases.isNotEmpty()) {
                return aliases.first()
            }
        } catch (_: Exception) {
        }
    }
    return requestedAlias.takeIf { !it.isNullOrBlank() }
}

fun resolveKeyPassword(storePass: String): String {
    val candidates = listOf(
        project.findProperty("android.injected.signing.key.password")?.toString(),
        project.findProperty("RELEASE_KEY_PASSWORD")?.toString(),
        project.findProperty("KEY_PASSWORD")?.toString(),
        System.getenv("ANDROID_KEY_PASSWORD"),
        System.getenv("KEY_PASSWORD"),
        System.getenv("RELEASE_KEY_PASSWORD"),
        System.getenv("SIGNING_KEY_PASSWORD")
    )
    for (candidate in candidates) {
        if (!candidate.isNullOrBlank()) return candidate
    }
    return storePass
}

android {
    namespace = "com.ekokasif.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.ekokasif.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 2
        versionName = "2.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            val keystoreFile = findKeystoreFile()
            if (keystoreFile != null) {
                storeFile = keystoreFile
                val storePass = resolveStorePassword()
                storePassword = storePass
                val rawAlias = listOf(
                    project.findProperty("android.injected.signing.key.alias")?.toString(),
                    project.findProperty("RELEASE_KEY_ALIAS")?.toString(),
                    project.findProperty("KEY_ALIAS")?.toString(),
                    System.getenv("ANDROID_KEY_ALIAS"),
                    System.getenv("KEY_ALIAS"),
                    System.getenv("RELEASE_KEY_ALIAS"),
                    System.getenv("SIGNING_KEY_ALIAS")
                ).firstOrNull { !it.isNullOrBlank() }

                val realAlias = resolveRealAlias(keystoreFile, storePass, rawAlias) ?: rawAlias ?: ""
                keyAlias = realAlias
                keyPassword = resolveKeyPassword(storePass)
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
            signingConfig = signingConfigs.getByName("release")
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
