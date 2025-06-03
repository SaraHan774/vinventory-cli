package com.august.repository.inventory.v2

import com.august.domain.v2.Wine

interface IWineRepository {
    fun save(wine: Wine): Wine
    fun findById(id: String): Wine?
    fun delete(id: String)
    fun update(wine: Wine): Wine
    fun findAll(): List<Wine>
    
    // Search and filter methods
    fun searchByName(query: String): List<Wine>
    fun filterByVintageRange(startYear: Int, endYear: Int): List<Wine>
    fun filterByPriceRange(minPrice: Double, maxPrice: Double): List<Wine>
    fun filterByCountry(countryCode: String): List<Wine>
    fun findLowStock(threshold: Int = 5): List<Wine>
} 