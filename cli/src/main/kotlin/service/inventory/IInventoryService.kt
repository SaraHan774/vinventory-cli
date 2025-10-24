package com.august.service.inventory

import com.august.domain.v2.Wine

/**
 * 재고 관리 서비스 인터페이스
 * 
 * Backend API를 통해 와인 재고를 관리하는 서비스의 인터페이스입니다.
 * 모든 메서드는 suspend 함수로 정의되어 비동기 처리를 지원합니다.
 */
interface IInventoryService {
    suspend fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine
    suspend fun deleteWine(id: String)
    suspend fun addWine(id: String, quantity: Int)
    suspend fun retrieveWine(id: String): Wine
    suspend fun getAllWines(): List<Wine>
    
    // 검색 및 필터링 메서드들
    suspend fun searchWinesByName(query: String): List<Wine>
    suspend fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine>
    suspend fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine>
    suspend fun findWinesByCountry(countryCode: String): List<Wine>
    suspend fun findLowStockWines(threshold: Int = 5): List<Wine>
} 