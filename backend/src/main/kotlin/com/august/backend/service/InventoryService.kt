package com.august.backend.service

import com.august.domain.model.Wine
import com.august.backend.repository.IWineRepository
import java.util.UUID

/**
 * 재고 관리 서비스 구현
 * 
 * 와인 재고 관리를 위한 비즈니스 로직을 제공합니다.
 * 
 * @property wineRepository 와인 레포지토리
 */
class InventoryService(
    private val wineRepository: IWineRepository
) : IInventoryService {
    
    override fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine {
        // UUID를 이용한 고유 ID 생성
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
        // 기존 와인 조회
        val wine = wineRepository.findById(id) ?: throw IllegalArgumentException("Wine not found")
        
        // 수량 업데이트 (음수면 차감)
        val updatedWine = wine.copy(quantity = wine.quantity + quantity)
        
        // 재고가 음수가 되지 않도록 검증
        if (updatedWine.quantity < 0) {
            throw IllegalArgumentException("Resulting quantity cannot be negative")
        }
        
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

