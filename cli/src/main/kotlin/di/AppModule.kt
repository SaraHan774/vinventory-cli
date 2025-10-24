package di

import org.koin.dsl.module
import com.august.service.inventory.ApiInventoryService
import com.august.service.inventory.IInventoryService
import com.august.api.WineApiClient
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.InventoryServiceErrorHandler
import io.github.cdimascio.dotenv.dotenv

val appModule = module {
    // 환경 변수 설정
    single { 
        dotenv {
            ignoreIfMissing = true
        }
    }
    
    // API 클라이언트 설정
    single {
        val dotenv = get<io.github.cdimascio.dotenv.Dotenv>()
        val baseUrl = dotenv["API_BASE_URL"] 
            ?: System.getenv("API_BASE_URL") 
            ?: "http://localhost:8590"
        WineApiClient(baseUrl = baseUrl)
    }

    // API 기반 서비스
    single<IInventoryService> { ApiInventoryService(get()) }
    
    // 알림 서비스
    single { ConsoleAlertService() }
    single { InventoryServiceErrorHandler() }
} 