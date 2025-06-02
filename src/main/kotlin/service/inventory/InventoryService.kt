package com.august.service.inventory

import com.august.domain.Wine
import com.august.repository.IWineRepository
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
}