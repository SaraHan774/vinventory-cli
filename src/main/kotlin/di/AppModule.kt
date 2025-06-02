package di

import org.koin.dsl.module
import com.august.service.inventory.InventoryService
import com.august.service.inventory.IInventoryService
import com.august.repository.WineRepository
import com.august.repository.IWineRepository
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.InventoryServiceErrorHandler

val appModule = module {
    // Repositories
    single<IWineRepository> { WineRepository() }

    // Services
    single<IInventoryService> { InventoryService(get()) }
    single { ConsoleAlertService() }
    single { InventoryServiceErrorHandler() }
} 