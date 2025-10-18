package com.august.backend

import com.august.backend.plugins.*
import com.august.backend.repository.SQLiteWineRepository
import com.august.backend.repository.db.DatabaseFactory
import com.august.backend.routes.wineRoutes
import com.august.backend.service.InventoryService
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin

/**
 * Ktor 백엔드 애플리케이션 메인 클래스
 * 
 * Context7 Ktor 문서를 참조하여 구현한 REST API 서버입니다.
 * 
 * 주요 기능:
 * - 와인 재고 관리 REST API
 * - JSON 직렬화/역직렬화
 * - CORS 지원 (프론트엔드 연동)
 * - 로깅 및 에러 핸들링
 * - 의존성 주입 (Koin)
 */
fun main() {
    embeddedServer(Netty, port = 8590, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

/**
 * Ktor 애플리케이션 모듈 설정
 * 
 * @param application Ktor 애플리케이션 인스턴스
 */
fun Application.module() {
    // 데이터베이스 초기화
    DatabaseFactory.init()
    
    // 의존성 주입 설정
    install(Koin) {
        modules(appModule)
    }
    
    // 플러그인 설정
    configureSerialization()  // JSON 직렬화
    configureCORS()          // CORS 설정
    configureLogging()       // 로깅
    configureStatusPages()   // 에러 핸들링
    
    // 라우팅 설정
    routing {
        // 헬스 체크 엔드포인트
        get("/health") {
            call.respond(mapOf("status" to "OK", "service" to "Wine Inventory API"))
        }
        
        // 와인 관련 API 라우트
        val inventoryService = com.august.backend.service.InventoryService(
            com.august.backend.repository.SQLiteWineRepository()
        )
        wineRoutes(inventoryService)
    }
}

/**
 * Koin 의존성 주입 모듈
 * 
 * 서비스와 레포지토리 간의 의존성을 설정합니다.
 */
val appModule = module {
    // 레포지토리
    single<com.august.backend.repository.IWineRepository> { SQLiteWineRepository() }
    
    // 서비스
    single<com.august.backend.service.IInventoryService> { InventoryService(get()) }
}

