// mobile/build.gradle.kts
// React Native 모바일 앱 빌드 설정

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.vinventory.mobile"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.vinventory.mobile"
        minSdk = 21
        targetSdk = 34
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
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    // React Native 관련 의존성은 package.json에서 관리
    // 여기서는 Android 네이티브 의존성만 관리
    
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}

// React Native 관련 태스크들
tasks.register("npmInstall") {
    group = "react native"
    description = "Install npm dependencies"
    doLast {
        exec {
            workingDir = projectDir
            commandLine("npm", "install")
        }
    }
}

tasks.register("startMetro") {
    group = "react native"
    description = "Start Metro bundler"
    dependsOn("npmInstall")
    doLast {
        exec {
            workingDir = projectDir
            commandLine("npx", "expo", "start")
        }
    }
}

tasks.register("buildAndroid") {
    group = "react native"
    description = "Build Android APK"
    dependsOn("npmInstall")
    doLast {
        exec {
            workingDir = projectDir
            commandLine("npx", "expo", "build:android")
        }
    }
}

tasks.register("buildIOS") {
    group = "react native"
    description = "Build iOS app"
    dependsOn("npmInstall")
    doLast {
        exec {
            workingDir = projectDir
            commandLine("npx", "expo", "build:ios")
        }
    }
}
