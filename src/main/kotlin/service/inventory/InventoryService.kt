package com.august.service.inventory

import com.august.domain.v2.Wine
import com.august.repository.inventory.v2.IWineRepository
import java.util.UUID

class InventoryService(
    private val wineRepository: IWineRepository
) : IInventoryService {
    
    override fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine {
        val wine = Wine(
            id = UUID.randomUUID().toString(),
            name = name,
            countryCode = countryCode,
            vintage = vintage,
            price = price,
            quantity = quantity
        )
        return wineRepository.save(wine)
    }

    override fun deleteWine(id: String) {
        wineRepository.delete(id)
    }

    override fun addWine(id: String, quantity: Int) {
        val wine = wineRepository.findById(id) ?: throw IllegalArgumentException("Wine not found")
        val updatedWine = wine.copy(quantity = wine.quantity + quantity)
        wineRepository.update(updatedWine)
    }

    override fun retrieveWine(id: String): Wine {
        return wineRepository.findById(id) ?: throw IllegalArgumentException("Wine not found")
    }

    override fun getAllWines(): List<Wine> {
        return wineRepository.findAll()
    }

    override fun searchWinesByName(query: String): List<Wine> {
        return wineRepository.searchByName(query)
    }

    override fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine> {
        if (startYear > endYear) {
            throw IllegalArgumentException("Start year must be less than or equal to end year")
        }
        return wineRepository.filterByVintageRange(startYear, endYear)
    }

    override fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine> {
        if (minPrice > maxPrice) {
            throw IllegalArgumentException("Minimum price must be less than or equal to maximum price")
        }
        if (minPrice < 0 || maxPrice < 0) {
            throw IllegalArgumentException("Price cannot be negative")
        }
        return wineRepository.filterByPriceRange(minPrice, maxPrice)
    }

    override fun findWinesByCountry(countryCode: String): List<Wine> {
        return wineRepository.filterByCountry(countryCode)
    }

    override fun findLowStockWines(threshold: Int): List<Wine> {
        if (threshold < 0) {
            throw IllegalArgumentException("Threshold cannot be negative")
        }
        return wineRepository.findLowStock(threshold)
    }
}