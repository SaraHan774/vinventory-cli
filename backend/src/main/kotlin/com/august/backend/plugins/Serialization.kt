package com.august.backend.plugins

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.json.Json

/**
 * JSON 직렬화 플러그인 설정
 * 
 * Ktor 서버에서 JSON 요청/응답을 처리하기 위한 설정입니다.
 * Context7 Ktor 문서를 참조하여 구현했습니다.
 */
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            // JSON 직렬화 설정
            prettyPrint = true  // 개발 시 가독성을 위한 예쁜 출력
            isLenient = true    // JSON 파싱 시 유연한 처리
            ignoreUnknownKeys = true  // 알 수 없는 키 무시
        })
    }
}

