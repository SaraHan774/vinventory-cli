package com.august.repository.inventory.v2

import com.august.domain.v2.Wine

class WineRepository : IWineRepository {
    private val wines = mutableMapOf<String, Wine>()

    override fun save(wine: Wine): Wine {
        wines[wine.id] = wine
        return wine
    }

    override fun findById(id: String): Wine? {
        return wines[id]
    }

    override fun delete(id: String) {
        wines.remove(id)
    }

    override fun update(wine: Wine): Wine {
        wines[wine.id] = wine
        return wine
    }

    override fun findAll(): List<Wine> {
        return wines.values.toList()
    }

    override fun searchByName(query: String): List<Wine> {
        return wines.values.filter { 
            it.name.contains(query, ignoreCase = true)
        }
    }

    override fun filterByVintageRange(startYear: Int, endYear: Int): List<Wine> {
        return wines.values.filter {
            it.vintage in startYear..endYear
        }
    }

    override fun filterByPriceRange(minPrice: Double, maxPrice: Double): List<Wine> {
        return wines.values.filter {
            it.price in minPrice..maxPrice
        }
    }

    override fun filterByCountry(countryCode: String): List<Wine> {
        return wines.values.filter {
            it.countryCode.equals(countryCode, ignoreCase = true)
        }
    }

    override fun findLowStock(threshold: Int): List<Wine> {
        return wines.values.filter {
            it.quantity <= threshold
        }
    }
} 