package di

import org.koin.dsl.module
import com.august.service.inventory.InventoryService
import com.august.service.inventory.IInventoryService
import com.august.repository.inventory.v2.SQLiteWineRepository
import com.august.repository.inventory.v2.IWineRepository
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.InventoryServiceErrorHandler
import com.august.repository.db.DatabaseFactory

val appModule = module {
    // Initialize database first
    single(createdAtStart = true) { 
        DatabaseFactory.init()
        Unit  // Return Unit since we don't need the result
    }

    // Repositories - depend on database initialization
    single<IWineRepository> {
        get<Unit>() // This ensures database is initialized first
        SQLiteWineRepository()
    }

    // Services
    single<IInventoryService> { InventoryService(get()) }
    single { ConsoleAlertService() }
    single { InventoryServiceErrorHandler() }
} 