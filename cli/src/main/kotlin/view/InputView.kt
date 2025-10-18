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

    fun selectMenu(input: String) {
        when (input) {
            "1" -> handleRegisterWine()
            "2" -> handleDeleteWine()
            "3" -> handleAddWine()
            "4" -> handleRetrieveWine()
            "5" -> handleSearchAndFilter()
            else -> println("Invalid option")
        }
    }

    private fun handleSearchAndFilter() {
        var validInput = false
        while (!validInput) {
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

            when (readLine()?.trim()?.toIntOrNull()) {
                1 -> {
                    handleSearchByName()
                    validInput = true
                }
                2 -> {
                    handleFilterByVintage()
                    validInput = true
                }
                3 -> {
                    handleFilterByPrice()
                    validInput = true
                }
                4 -> {
                    handleFilterByCountry()
                    validInput = true
                }
                5 -> {
                    viewEvents.add(ViewEvent.ShowLowStockWines)
                    validInput = true
                }
                6 -> {
                    viewEvents.add(ViewEvent.ListAllWines)
                    validInput = true
                }
                7 -> {
                    validInput = true
                }
                else -> println("Invalid option. Please try again.")
            }
        }
    }

    private fun handleSearchByName() {
        while (true) {
            println("Enter search query:")
            val query = readLine()?.trim()
            if (!query.isNullOrEmpty()) {
                viewEvents.add(ViewEvent.SearchWinesByName(query))
                return
            }
            println("Invalid input. Please try again.")
        }
    }

    private fun handleFilterByVintage() {
        while (true) {
            println("Enter start year:")
            val startYear = readLine()?.trim()?.toIntOrNull()
            if (startYear == null) {
                println("Invalid year. Please enter a number.")
                continue
            }

            println("Enter end year:")
            val endYear = readLine()?.trim()?.toIntOrNull()
            if (endYear == null) {
                println("Invalid year. Please enter a number.")
                continue
            }

            if (startYear > endYear) {
                println("Start year must be less than or equal to end year.")
                continue
            }

            viewEvents.add(ViewEvent.FilterByVintage(startYear, endYear))
            return
        }
    }

    private fun handleFilterByPrice() {
        while (true) {
            println("Enter minimum price:")
            val minPrice = readLine()?.trim()?.toDoubleOrNull()
            if (minPrice == null || minPrice < 0) {
                println("Invalid price. Please enter a positive number.")
                continue
            }

            println("Enter maximum price:")
            val maxPrice = readLine()?.trim()?.toDoubleOrNull()
            if (maxPrice == null || maxPrice < 0) {
                println("Invalid price. Please enter a positive number.")
                continue
            }

            if (minPrice > maxPrice) {
                println("Minimum price must be less than or equal to maximum price.")
                continue
            }

            viewEvents.add(ViewEvent.FilterByPrice(minPrice, maxPrice))
            return
        }
    }

    private fun handleFilterByCountry() {
        while (true) {
            println("Enter country code (e.g., FR, IT, ES):")
            val countryCode = readLine()?.trim()?.uppercase()
            if (!countryCode.isNullOrEmpty() && countryCode.length == 2) {
                viewEvents.add(ViewEvent.FilterByCountry(countryCode))
                return
            }
            println("Invalid country code. Please enter a 2-letter code.")
        }
    }

    private fun handleRegisterWine() {
        while (true) {
            println("Enter wine name:")
            val name = readLine()?.trim()
            if (name.isNullOrEmpty()) {
                println("Name cannot be empty. Please try again.")
                continue
            }

            println("Enter country code:")
            val countryCode = readLine()?.trim()?.uppercase()
            if (countryCode.isNullOrEmpty() || countryCode.length != 2) {
                println("Invalid country code. Please enter a 2-letter code.")
                continue
            }

            println("Enter vintage year:")
            val vintage = readLine()?.trim()?.toIntOrNull()
            if (vintage == null || vintage < 1800 || vintage > 2024) {
                println("Invalid vintage year. Please enter a year between 1800 and 2024.")
                continue
            }

            println("Enter price:")
            val price = readLine()?.trim()?.toDoubleOrNull()
            if (price == null || price < 0) {
                println("Invalid price. Please enter a positive number.")
                continue
            }

            println("Enter quantity:")
            val quantity = readLine()?.trim()?.toIntOrNull()
            if (quantity == null || quantity < 0) {
                println("Invalid quantity. Please enter a positive number.")
                continue
            }

            viewEvents.add(ViewEvent.RegisterWine(name, countryCode, vintage, price, quantity))
            return
        }
    }

    private fun handleDeleteWine() {
        while (true) {
            println("Enter wine ID to delete:")
            val id = readLine()?.trim()
            if (!id.isNullOrEmpty()) {
                viewEvents.add(ViewEvent.DeleteWine(id))
                return
            }
            println("Invalid ID. Please try again.")
        }
    }

    private fun handleAddWine() {
        while (true) {
            println("Enter wine ID:")
            val id = readLine()?.trim()
            if (id.isNullOrEmpty()) {
                println("Invalid ID. Please try again.")
                continue
            }

            println("Enter quantity to add:")
            val quantity = readLine()?.trim()?.toIntOrNull()
            if (quantity == null || quantity <= 0) {
                println("Invalid quantity. Please enter a positive number.")
                continue
            }

            viewEvents.add(ViewEvent.AddWine(id, quantity))
            return
        }
    }

    private fun handleRetrieveWine() {
        while (true) {
            println("Enter wine ID to retrieve:")
            val id = readLine()?.trim()
            if (!id.isNullOrEmpty()) {
                viewEvents.add(ViewEvent.RetrieveWine(id))
                return
            }
            println("Invalid ID. Please try again.")
        }
    }
}

