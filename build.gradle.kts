import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

// 루트 프로젝트 빌드 설정
// 멀티모듈 프로젝트의 공통 설정을 정의합니다.

plugins {
    kotlin("jvm") version "2.0.20" apply false
    kotlin("plugin.serialization") version "2.0.20" apply false
}

group = "com.august"
version = "1.0-SNAPSHOT"

// 모든 서브프로젝트에 공통 설정 적용
subprojects {
    repositories {
        mavenCentral()
    }
    
    // JVM 툴체인 설정으로 호환성 문제 해결
    plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinPluginWrapper> {
        tasks.withType<KotlinCompile>().configureEach {
            compilerOptions {
                jvmTarget.set(JvmTarget.JVM_17)
                freeCompilerArgs.addAll("-Xjsr305=strict")
            }
        }
    }
    
    // Java 컴파일러도 JVM 17로 설정
    plugins.withType<JavaPlugin> {
        configure<JavaPluginExtension> {
            toolchain {
                languageVersion.set(JavaLanguageVersion.of(17))
            }
        }
    }
}
