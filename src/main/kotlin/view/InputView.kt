package com.august.view

object InputView {
    val viewEvents = mutableListOf<ViewEvent>()

    fun printMenu() {
        println("Hello, what can I do for you?")
        println("(A) Manage Inventory")
        println("(B) Search Inventory")
        println("(C) Look up Inventory History")
    }

    fun selectMenu() {
        val input = readln()
        when (input) {
            "A" -> {
                println("1. Register Wine")
                println("2. Delete Wine")
                println("3. Add Wine")
                println("4. Retrieve Wine")
            }

            "B" -> {
                println("Not Supported Yet!")
            }

            "C" -> {
                println("Not Supported Yet!")
            }
        }
    }

    fun selectInventoryManagementMenu() {
        val input = readln()
        when (input) {
            "1" -> {
                println("Enter wine details:")
                print("Winery Name: ")
                val name = readln()
                print("Country Code: ")
                val country = readln()
                print("Vintage: ")
                val vintage = readln()
                print("Price: ")
                val price = readln()
                print("Quantity: ")
                val quantity = readln()



            }

            "2" -> {

            }

            "3" -> {

            }

            "4" -> {

            }
        }
    }
}

sealed class ViewEvent {
    class RegisterWine : ViewEvent()
    class DeleteWine : ViewEvent()
    class AddWine: ViewEvent()
    class RetrieveWine : ViewEvent()
}