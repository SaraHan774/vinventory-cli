package com.august.view

object InputView {
    val viewEvents = mutableListOf<ViewEvent>()

    fun printMenu() {
        println("""
            1. Register Wine
            2. Delete Wine
            3. Add Wine
            4. Retrieve Wine
            5. Exit
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
            5 -> System.exit(0)
            else -> println("Invalid option")
        }
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

