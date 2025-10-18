// CLI 모듈: 기존 커맨드라인 인터페이스
// 터미널에서 실행 가능한 와인 재고 관리 CLI 앱입니다.

plugins {
    kotlin("jvm")
    application
}

group = "com.august"
version = "1.0-SNAPSHOT"

application {
    mainClass.set("com.august.cli.MainKt")
}

dependencies {
    // Shared 모듈 의존성 (공통 도메인 모델 사용)
    implementation(project(":shared"))
    
    // 코루틴
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    
    // 의존성 주입
    implementation("io.insert-koin:koin-core:3.5.3")
    
    // 데이터베이스
    implementation("org.jetbrains.exposed:exposed-core:0.48.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.48.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.48.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.48.0")
    implementation("org.xerial:sqlite-jdbc:3.45.1.0")
    
    // 로깅
    implementation("org.slf4j:slf4j-api:2.0.12")
    implementation("ch.qos.logback:logback-classic:1.4.14")
    
    // 테스트
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

tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.august.cli.MainKt"
    }
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
}

tasks.named<JavaExec>("run") {
    standardInput = System.`in`
}

