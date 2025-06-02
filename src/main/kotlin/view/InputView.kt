package com.august.view

object InputView {
    val viewEvents = mutableListOf<ViewEvent>()

    fun printMenu() {
        println("""
            1. Register Wine
            2. Delete Wine
            3. Add Wine
            4. Retrieve Wine
            5. Search & Filter Options
            6. Exit
            Choose an option:
        """.trimIndent())
    }

    fun selectMenu() {
        val input = readLine()
        if (input.isNullOrBlank()) {
            println("Please enter a valid option")
            return
        }

        when (input.toIntOrNull()) {
            1 -> handleRegisterWine()
            2 -> handleDeleteWine()
            3 -> handleAddWine()
            4 -> handleRetrieveWine()
            5 -> handleSearchAndFilter()
            6 -> System.exit(0)
            else -> println("Invalid option")
        }
    }

    private fun handleSearchAndFilter() {
        println("""
            Search & Filter Options:
            1. Search by name
            2. Filter by vintage range
            3. Filter by price range
            4. Filter by country
            5. Show low stock wines
            6. List all wines
            7. Back to main menu
            Choose an option:
        """.trimIndent())

        when (readLine()?.toIntOrNull()) {
            1 -> handleSearchByName()
            2 -> handleFilterByVintage()
            3 -> handleFilterByPrice()
            4 -> handleFilterByCountry()
            5 -> viewEvents.add(ViewEvent.ShowLowStockWines)
            6 -> viewEvents.add(ViewEvent.ListAllWines)
            7 -> return
            else -> println("Invalid option")
        }
    }

    private fun handleSearchByName() {
        println("Enter search query:")
        val query = readLine() ?: return
        viewEvents.add(ViewEvent.SearchWinesByName(query))
    }

    private fun handleFilterByVintage() {
        println("Enter start year:")
        val startYear = readLine()?.toIntOrNull() ?: return
        println("Enter end year:")
        val endYear = readLine()?.toIntOrNull() ?: return
        viewEvents.add(ViewEvent.FilterByVintage(startYear, endYear))
    }

    private fun handleFilterByPrice() {
        println("Enter minimum price:")
        val minPrice = readLine()?.toDoubleOrNull() ?: return
        println("Enter maximum price:")
        val maxPrice = readLine()?.toDoubleOrNull() ?: return
        viewEvents.add(ViewEvent.FilterByPrice(minPrice, maxPrice))
    }

    private fun handleFilterByCountry() {
        println("Enter country code (e.g., FR, IT, ES):")
        val countryCode = readLine() ?: return
        viewEvents.add(ViewEvent.FilterByCountry(countryCode))
    }

    private fun handleRegisterWine() {
        println("Enter wine name:")
        val name = readLine() ?: return
        println("Enter country code:")
        val countryCode = readLine() ?: return
        println("Enter vintage year:")
        val vintage = readLine()?.toIntOrNull() ?: return
        println("Enter price:")
        val price = readLine()?.toDoubleOrNull() ?: return
        println("Enter quantity:")
        val quantity = readLine()?.toIntOrNull() ?: return

        viewEvents.add(ViewEvent.RegisterWine(name, countryCode, vintage, price, quantity))
    }

    private fun handleDeleteWine() {
        println("Enter wine ID to delete:")
        val id = readLine() ?: return
        viewEvents.add(ViewEvent.DeleteWine(id))
    }

    private fun handleAddWine() {
        println("Enter wine ID:")
        val id = readLine() ?: return
        println("Enter quantity to add:")
        val quantity = readLine()?.toIntOrNull() ?: return
        viewEvents.add(ViewEvent.AddWine(id, quantity))
    }

    private fun handleRetrieveWine() {
        println("Enter wine ID to retrieve:")
        val id = readLine() ?: return
        viewEvents.add(ViewEvent.RetrieveWine(id))
    }
}

