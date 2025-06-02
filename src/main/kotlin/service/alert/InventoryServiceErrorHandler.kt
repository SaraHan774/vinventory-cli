package com.august.service.alert

class InventoryServiceErrorHandler {
    fun handle(error: Exception) {
        println("ERROR: ${error.message}")
    }
} 