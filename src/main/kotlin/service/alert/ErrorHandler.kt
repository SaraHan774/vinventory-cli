package com.august.service.alert


interface ErrorHandler {
    fun handle(e: Exception, message: String = "")
}

// TODO : 이게 맞는건가 ..
class InventoryServiceErrorHandler: ErrorHandler {
    override fun handle(e: Exception, message: String) {
        println("[ERROR][InventoryService] $message, exception thrown: ${e.javaClass.name} - ${e.message}")
    }
}