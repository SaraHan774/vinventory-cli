// Shared 모듈: 공통 도메인 모델 및 DTO
// Backend와 CLI 모듈에서 공통으로 사용하는 데이터 클래스를 정의합니다.

plugins {
    kotlin("jvm")
    kotlin("plugin.serialization")
}

group = "com.august"
version = "1.0-SNAPSHOT"

dependencies {
    // Kotlin 직렬화 (JSON 변환용)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
    
    // 코루틴 (비동기 처리)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
}

