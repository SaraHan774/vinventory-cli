package com.august.backend.plugins

import com.august.domain.model.ErrorResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import org.slf4j.LoggerFactory

/**
 * 상태 페이지 플러그인 설정
 * 
 * HTTP 에러 상태에 대한 일관된 응답을 제공합니다.
 * Context7 Ktor 문서를 참조하여 구현했습니다.
 */
fun Application.configureStatusPages() {
    val logger = LoggerFactory.getLogger("StatusPages")
    
    install(StatusPages) {
        // 400 Bad Request
        exception<IllegalArgumentException> { call, cause ->
            logger.warn("Bad request: ${cause.message}", cause)
            call.respond(
                HttpStatusCode.BadRequest,
                ErrorResponse(
                    message = cause.message ?: "Bad request",
                    code = "BAD_REQUEST"
                )
            )
        }
        
        // 404 Not Found
        status(HttpStatusCode.NotFound) { call, status ->
            call.respond(
                status,
                ErrorResponse(
                    message = "Resource not found",
                    code = "NOT_FOUND"
                )
            )
        }
        
        // 500 Internal Server Error
        exception<Exception> { call, cause ->
            logger.error("Internal server error", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse(
                    message = "Internal server error",
                    code = "INTERNAL_ERROR"
                )
            )
        }
    }
}

