package com.august.service.inventory

import com.august.api.WineApiClient
import com.august.domain.v2.Wine
import com.august.domain.model.CreateWineRequest
import com.august.domain.model.UpdateWineRequest
import com.august.domain.model.UpdateWineQuantityRequest
import org.slf4j.LoggerFactory

/**
 * API 기반 재고 관리 서비스
 * 
 * Backend API를 통해 와인 재고를 관리하는 서비스입니다.
 * CLI에서 Backend API를 호출하여 데이터를 관리합니다.
 */
class ApiInventoryService(
    private val apiClient: WineApiClient
) : IInventoryService {
    
    private val logger = LoggerFactory.getLogger(ApiInventoryService::class.java)
    
    override suspend fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine {
        logger.info("와인 등록 요청: $name")
        return try {
            val wineData = CreateWineRequest(
                name = name,
                country_code = countryCode,
                vintage = vintage,
                price = price,
                quantity = quantity
            )
            val wine = apiClient.createWine(wineData)
            logger.info("와인 등록 완료: ${wine.id}")
            wine
        } catch (e: Exception) {
            logger.error("와인 등록 실패: $name", e)
            throw e
        }
    }
    
    override suspend fun deleteWine(id: String) {
        logger.info("와인 삭제 요청: $id")
        try {
            apiClient.deleteWine(id)
            logger.info("와인 삭제 완료: $id")
        } catch (e: Exception) {
            logger.error("와인 삭제 실패: $id", e)
            throw e
        }
    }
    
    override suspend fun addWine(id: String, quantity: Int) {
        logger.info("와인 수량 추가 요청: $id, +$quantity")
        try {
            val quantityData = UpdateWineQuantityRequest(quantity = quantity)
            val updatedWine = apiClient.updateWineQuantity(id, quantityData)
            logger.info("와인 수량 추가 완료: $id, 새로운 수량: ${updatedWine.quantity}")
        } catch (e: Exception) {
            logger.error("와인 수량 추가 실패: $id", e)
            throw e
        }
    }
    
    override suspend fun retrieveWine(id: String): Wine {
        logger.info("와인 조회 요청: $id")
        return try {
            val wine = apiClient.getWineById(id)
            logger.info("와인 조회 완료: ${wine.name}")
            wine
        } catch (e: Exception) {
            logger.error("와인 조회 실패: $id", e)
            throw e
        }
    }
    
    override suspend fun getAllWines(): List<Wine> {
        logger.info("모든 와인 조회 요청")
        return try {
            val wines = apiClient.getAllWines()
            logger.info("${wines.size}개의 와인 조회 완료")
            wines
        } catch (e: Exception) {
            logger.error("와인 목록 조회 실패", e)
            throw e
        }
    }
    
    override suspend fun searchWinesByName(query: String): List<Wine> {
        logger.info("와인 검색 요청: $query")
        return try {
            val wines = apiClient.searchWinesByName(query)
            logger.info("검색 결과: ${wines.size}개의 와인")
            wines
        } catch (e: Exception) {
            logger.error("와인 검색 실패: $query", e)
            throw e
        }
    }
    
    override suspend fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine> {
        logger.info("빈티지 범위 검색: $startYear-$endYear")
        return try {
            val wines = apiClient.findWinesByVintageRange(startYear, endYear)
            logger.info("빈티지 범위 검색 결과: ${wines.size}개의 와인")
            wines
        } catch (e: Exception) {
            logger.error("빈티지 범위 검색 실패: $startYear-$endYear", e)
            throw e
        }
    }
    
    override suspend fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine> {
        logger.info("가격 범위 검색: $minPrice-$maxPrice")
        return try {
            val wines = apiClient.findWinesByPriceRange(minPrice, maxPrice)
            logger.info("가격 범위 검색 결과: ${wines.size}개의 와인")
            wines
        } catch (e: Exception) {
            logger.error("가격 범위 검색 실패: $minPrice-$maxPrice", e)
            throw e
        }
    }
    
    override suspend fun findWinesByCountry(countryCode: String): List<Wine> {
        logger.info("국가별 검색: $countryCode")
        return try {
            val wines = apiClient.findWinesByCountry(countryCode)
            logger.info("국가별 검색 결과: ${wines.size}개의 와인")
            wines
        } catch (e: Exception) {
            logger.error("국가별 검색 실패: $countryCode", e)
            throw e
        }
    }
    
    override suspend fun findLowStockWines(threshold: Int): List<Wine> {
        logger.info("재고 부족 와인 검색: threshold=$threshold")
        return try {
            val wines = apiClient.findLowStockWines(threshold)
            logger.info("재고 부족 와인 검색 결과: ${wines.size}개의 와인")
            wines
        } catch (e: Exception) {
            logger.error("재고 부족 와인 검색 실패: threshold=$threshold", e)
            throw e
        }
    }
}
