package com.august.service.inventory

import com.august.domain.v2.Wine

interface IInventoryService {
    fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine
    fun deleteWine(id: String)
    fun addWine(id: String, quantity: Int)
    fun retrieveWine(id: String): Wine
    fun getAllWines(): List<Wine>
    
    // Search and filter methods
    fun searchWinesByName(query: String): List<Wine>
    fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine>
    fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine>
    fun findWinesByCountry(countryCode: String): List<Wine>
    fun findLowStockWines(threshold: Int = 5): List<Wine>
} 