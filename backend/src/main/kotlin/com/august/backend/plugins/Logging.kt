package com.august.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import org.slf4j.event.Level

/**
 * 로깅 플러그인 설정
 * 
 * HTTP 요청/응답을 로깅하여 디버깅과 모니터링을 지원합니다.
 */
fun Application.configureLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}