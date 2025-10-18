// Backend 모듈: Ktor REST API 서버
// 와인 재고 관리 REST API를 제공하는 백엔드 서버입니다.

plugins {
    kotlin("jvm")
    kotlin("plugin.serialization")
    application
}

group = "com.august"
version = "1.0-SNAPSHOT"

application {
    mainClass.set("com.august.backend.ApplicationKt")
}

dependencies {
    // Shared 모듈 의존성
    implementation(project(":shared"))
    
    // Ktor 서버 코어 및 엔진
    val ktorVersion = "3.0.3"
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    
    // Ktor 플러그인들
    implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")  // JSON 직렬화
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")  // kotlinx.serialization 통합
    implementation("io.ktor:ktor-server-cors:$ktorVersion")                  // CORS 설정
    implementation("io.ktor:ktor-server-call-logging:$ktorVersion")          // 로깅
    implementation("io.ktor:ktor-server-status-pages:$ktorVersion")          // 에러 핸들링
    
    // 데이터베이스 (기존 설정 유지)
    implementation("org.jetbrains.exposed:exposed-core:0.48.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.48.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.48.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.48.0")
    implementation("org.xerial:sqlite-jdbc:3.45.1.0")
    
    // 의존성 주입
    implementation("io.insert-koin:koin-core:3.5.3")
    implementation("io.insert-koin:koin-ktor:3.5.3")
    
    // 로깅
    implementation("org.slf4j:slf4j-api:2.0.12")
    implementation("ch.qos.logback:logback-classic:1.4.14")
    
    // 코루틴
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    
    // 테스트
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")
    testImplementation("io.mockk:mockk:1.13.16")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("io.insert-koin:koin-test:3.5.3") {
        exclude(group = "org.jetbrains.kotlin", module = "kotlin-test-junit")
    }
}

tasks.test {
    useJUnitPlatform()
}

