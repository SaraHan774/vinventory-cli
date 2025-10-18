package com.august.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

/**
 * CORS (Cross-Origin Resource Sharing) 플러그인 설정
 * 
 * 프론트엔드(React)에서 백엔드 API를 호출할 수 있도록 CORS를 허용합니다.
 * Context7 Ktor 문서를 참조하여 구현했습니다.
 */
fun Application.configureCORS() {
    install(CORS) {
        // 허용할 Origin 설정
        allowHost("localhost:5173", schemes = listOf("http"))  // Vite 개발 서버
        allowHost("localhost:3000", schemes = listOf("http"))  // Create React App 개발 서버
        allowHost("localhost:8590", schemes = listOf("http"))  // 백엔드 서버
        
        // 허용할 HTTP 메서드
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Options)
        
        // 허용할 헤더
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.Accept)
        
        // 쿠키 허용
        allowCredentials = true
        
        // preflight 요청 캐시 시간 (초)
        maxAgeInSeconds = 1 * 60 * 60  // 1시간
    }
}

