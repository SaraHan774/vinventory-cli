plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}
rootProject.name = "vinventory"

// 멀티모듈 프로젝트 구조 설정
include("shared")     // 공통 도메인 모델
include("backend")    // Ktor REST API 서버
include("frontend")   // React + Vite 앱 (빌드 설정만 포함)
include("cli")        // 기존 CLI 앱

