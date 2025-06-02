package com.august.service.inventory

import com.august.domain.Wine

interface IInventoryService {
    fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine
    fun deleteWine(id: String)
    fun addWine(id: String, quantity: Int)
    fun retrieveWine(id: String): Wine
    fun getAllWines(): List<Wine>
} 