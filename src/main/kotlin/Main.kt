package com.august

import com.august.service.inventory.IInventoryService
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.InventoryServiceErrorHandler
import com.august.view.InputView
import com.august.view.ViewEvent
import di.appModule
import org.koin.core.context.startKoin
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class Application : KoinComponent {
    private val inventoryService: IInventoryService by inject()
    private val alertService: ConsoleAlertService by inject()
    private val errorHandler: InventoryServiceErrorHandler by inject()

    fun run() {
        while(true) {
            try {
                InputView.printMenu()
                InputView.selectMenu()
                
                // Process any view events
                for (event in InputView.viewEvents) {
                    when (event) {
                        is ViewEvent.RegisterWine -> {
                            inventoryService.registerWine(
                                name = event.name,
                                countryCode = event.countryCode,
                                vintage = event.vintage,
                                price = event.price,
                                quantity = event.quantity
                            )
                        }
                        is ViewEvent.DeleteWine -> {
                            inventoryService.deleteWine(event.id)
                        }
                        is ViewEvent.AddWine -> {
                            inventoryService.addWine(event.id, event.quantity)
                        }
                        is ViewEvent.RetrieveWine -> {
                            val wine = inventoryService.retrieveWine(event.id)
                            println("Retrieved wine: $wine")
                        }
                    }
                }
                
                // Clear events after processing
                InputView.viewEvents.clear()
                
            } catch (e: Exception) {
                alertService.sendAlert("An error occurred: ${e.message}")
                errorHandler.handle(e)
            }
        }
    }
}

fun main() {
    startKoin {
        modules(appModule)
    }
    
    Application().run()
}
