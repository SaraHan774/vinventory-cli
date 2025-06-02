package di

import org.koin.dsl.module
import com.august.service.inventory.InventoryService
import com.august.service.inventory.IInventoryService
import com.august.repository.SQLiteWineRepository
import com.august.repository.IWineRepository
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.InventoryServiceErrorHandler
import com.august.repository.db.DatabaseFactory

val appModule = module {
    // Initialize database
    single { 
        DatabaseFactory.init()
    }

    // Repositories
    single<IWineRepository> { SQLiteWineRepository() }

    // Services
    single<IInventoryService> { InventoryService(get()) }
    single { ConsoleAlertService() }
    single { InventoryServiceErrorHandler() }
} 