package com.august.cli

import com.august.domain.v2.Wine
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
        println("Welcome to Vinventory CLI!")

        while (true) {
            try {
                InputView.printMenu()
                print("> ")  // Prompt symbol
                val input = readLine()?.trim()

                if (input.isNullOrBlank()) {
                    println("Please enter a valid option.")
                    continue
                }

                if (input == "6") {
                    println("Exiting application...")
                    break
                }

                if (input in listOf("1", "2", "3", "4", "5")) {
                    InputView.selectMenu(input)

                    if (InputView.viewEvents.isEmpty()) {
                        println("No action was triggered by input '$input'.")
                        continue
                    }

                    processEvents()
                } else {
                    println("Invalid option. Please enter a number between 1 and 6.")
                }
            } catch (e: Exception) {
                alertService.sendAlert("An error occurred: ${e.message}")
                errorHandler.handle(e)
            }
        }
    }

    private fun processEvents() {
        // Process any view events
        for (event in InputView.viewEvents) {
            try {
                when (event) {
                    is ViewEvent.RegisterWine -> {
                        inventoryService.registerWine(
                            name = event.name,
                            countryCode = event.countryCode,
                            vintage = event.vintage,
                            price = event.price,
                            quantity = event.quantity
                        )
                        println("Wine registered successfully")
                    }
                    is ViewEvent.DeleteWine -> {
                        inventoryService.deleteWine(event.id)
                        println("Wine deleted successfully")
                    }
                    is ViewEvent.AddWine -> {
                        inventoryService.addWine(event.id, event.quantity)
                        println("Wine quantity updated successfully")
                    }
                    is ViewEvent.RetrieveWine -> {
                        val wine = inventoryService.retrieveWine(event.id)
                        println("Retrieved wine: $wine")
                    }
                    is ViewEvent.SearchWinesByName -> {
                        val wines = inventoryService.searchWinesByName(event.query)
                        printWines("Search results:", wines)
                    }
                    is ViewEvent.FilterByVintage -> {
                        val wines = inventoryService.findWinesByVintageRange(event.startYear, event.endYear)
                        printWines("Wines from ${event.startYear} to ${event.endYear}:", wines)
                    }
                    is ViewEvent.FilterByPrice -> {
                        val wines = inventoryService.findWinesByPriceRange(event.minPrice, event.maxPrice)
                        printWines("Wines between $${event.minPrice} and $${event.maxPrice}:", wines)
                    }
                    is ViewEvent.FilterByCountry -> {
                        val wines = inventoryService.findWinesByCountry(event.countryCode)
                        printWines("Wines from ${event.countryCode}:", wines)
                    }
                    is ViewEvent.ShowLowStockWines -> {
                        val wines = inventoryService.findLowStockWines()
                        printWines("Low stock wines:", wines)
                    }
                    is ViewEvent.ListAllWines -> {
                        val wines = inventoryService.getAllWines()
                        printWines("All wines:", wines)
                    }
                }
            } catch (e: Exception) {
                alertService.sendAlert("Error processing event: ${e.message}")
                errorHandler.handle(e)
            }
        }
        
        // Clear events after processing
        InputView.viewEvents.clear()
    }

    private fun printWines(header: String, wines: List<Wine>) {
        println("\n$header")
        if (wines.isEmpty()) {
            println("No wines found")
            return
        }
        wines.forEach { wine ->
            println("""
                ID: ${wine.id}
                Name: ${wine.name}
                Country: ${wine.countryCode}
                Vintage: ${wine.vintage}
                Price: $${wine.price}
                Quantity: ${wine.quantity}
                ${"-".repeat(40)}
            """.trimIndent())
        }
    }
}

fun main() {
    startKoin {
        modules(appModule)
    }
    
    Application().run()
}
