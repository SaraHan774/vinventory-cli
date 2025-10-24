package com.august.api

import com.august.domain.v2.Wine
import com.august.domain.model.CreateWineRequest
import com.august.domain.model.UpdateWineRequest
import com.august.domain.model.UpdateWineQuantityRequest
import com.august.domain.model.ApiResponse
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory

/**
 * Backend API 클라이언트
 * 
 * Kotlin Backend API와 통신하기 위한 HTTP 클라이언트입니다.
 * CLI에서 Backend API를 호출하여 와인 데이터를 관리합니다.
 */
class WineApiClient(
    private val baseUrl: String = "http://localhost:8590",
    private val apiVersion: String = "v1"
) {
    
    private val logger = LoggerFactory.getLogger(WineApiClient::class.java)
    
    // HTTP 클라이언트 설정
    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
        install(Logging) {
            level = LogLevel.INFO
        }
        install(DefaultRequest) {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header(HttpHeaders.Accept, ContentType.Application.Json)
            header("X-Client-Type", "cli")
            header("X-Client-Version", "2.0.0")
        }
    }
    
    private val apiBaseUrl = "$baseUrl/api/$apiVersion"
    
    /**
     * API 연결 상태 확인
     */
    suspend fun checkConnection(): Boolean {
        return try {
            val response = httpClient.get("$baseUrl/health")
            response.status.isSuccess()
        } catch (e: Exception) {
            logger.error("API 연결 실패", e)
            false
        }
    }
    
    /**
     * 모든 와인 조회
     */
    suspend fun getAllWines(): List<Wine> {
        logger.info("모든 와인 조회 요청")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines").body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("${response.data.size}개의 와인 조회 완료")
                response.data
            } else {
                throw Exception("와인 목록 조회 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 목록 조회 실패", e)
            throw Exception("와인 목록을 조회할 수 없습니다: ${e.message}")
        }
    }
    
    /**
     * 특정 와인 조회
     */
    suspend fun getWineById(id: String): Wine {
        logger.info("와인 조회 요청: $id")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines/$id").body<ApiResponse<Wine>>()
            if (response.success && response.data != null) {
                logger.info("와인 조회 완료: ${response.data.name}")
                response.data
            } else {
                throw IllegalArgumentException("와인을 찾을 수 없습니다: $id - ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 조회 실패: $id", e)
            throw IllegalArgumentException("와인을 찾을 수 없습니다: $id")
        }
    }
    
    /**
     * 와인 생성
     */
    suspend fun createWine(wineData: CreateWineRequest): Wine {
        logger.info("와인 생성 요청: ${wineData.name}")
        return try {
            val response = httpClient.post("$apiBaseUrl/wines") {
                setBody(wineData)
            }.body<ApiResponse<Wine>>()
            if (response.success && response.data != null) {
                logger.info("와인 생성 완료: ${response.data.id}")
                response.data
            } else {
                throw Exception("와인 생성 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 생성 실패: ${wineData.name}", e)
            throw Exception("와인 생성에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 와인 업데이트
     */
    suspend fun updateWine(id: String, wineData: UpdateWineRequest): Wine {
        logger.info("와인 업데이트 요청: $id")
        return try {
            val response = httpClient.put("$apiBaseUrl/wines/$id") {
                setBody(wineData)
            }.body<ApiResponse<Wine>>()
            if (response.success && response.data != null) {
                logger.info("와인 업데이트 완료: $id")
                response.data
            } else {
                throw Exception("와인 업데이트 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 업데이트 실패: $id", e)
            throw Exception("와인 업데이트에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 와인 삭제
     */
    suspend fun deleteWine(id: String): Boolean {
        logger.info("와인 삭제 요청: $id")
        return try {
            val response = httpClient.delete("$apiBaseUrl/wines/$id").body<ApiResponse<Any>>()
            if (response.success) {
                logger.info("와인 삭제 완료: $id")
                true
            } else {
                throw Exception("와인 삭제 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 삭제 실패: $id", e)
            throw Exception("와인 삭제에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 와인 수량 업데이트
     */
    suspend fun updateWineQuantity(id: String, quantityData: UpdateWineQuantityRequest): Wine {
        logger.info("와인 수량 업데이트 요청: $id, +${quantityData.quantity}")
        return try {
            val response = httpClient.put("$apiBaseUrl/wines/$id/quantity") {
                setBody(quantityData)
            }.body<ApiResponse<Wine>>()
            if (response.success && response.data != null) {
                logger.info("와인 수량 업데이트 완료: $id, 새로운 수량: ${response.data.quantity}")
                response.data
            } else {
                throw Exception("와인 수량 업데이트 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 수량 업데이트 실패: $id", e)
            throw Exception("와인 수량 업데이트에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 이름으로 와인 검색
     */
    suspend fun searchWinesByName(query: String): List<Wine> {
        logger.info("와인 검색 요청: $query")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines") {
                parameter("name", query)
            }.body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("검색 결과: ${response.data.size}개의 와인")
                response.data
            } else {
                throw Exception("와인 검색 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("와인 검색 실패: $query", e)
            throw Exception("와인 검색에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 빈티지 범위로 와인 필터링
     */
    suspend fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine> {
        logger.info("빈티지 범위 검색: $startYear-$endYear")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines") {
                parameter("vintage_min", startYear)
                parameter("vintage_max", endYear)
            }.body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("빈티지 범위 검색 결과: ${response.data.size}개의 와인")
                response.data
            } else {
                throw Exception("빈티지 범위 검색 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("빈티지 범위 검색 실패: $startYear-$endYear", e)
            throw Exception("빈티지 범위 검색에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 가격 범위로 와인 필터링
     */
    suspend fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine> {
        logger.info("가격 범위 검색: $minPrice-$maxPrice")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines") {
                parameter("price_min", minPrice)
                parameter("price_max", maxPrice)
            }.body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("가격 범위 검색 결과: ${response.data.size}개의 와인")
                response.data
            } else {
                throw Exception("가격 범위 검색 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("가격 범위 검색 실패: $minPrice-$maxPrice", e)
            throw Exception("가격 범위 검색에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 국가 코드로 와인 필터링
     */
    suspend fun findWinesByCountry(countryCode: String): List<Wine> {
        logger.info("국가별 검색: $countryCode")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines") {
                parameter("country_code", countryCode)
            }.body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("국가별 검색 결과: ${response.data.size}개의 와인")
                response.data
            } else {
                throw Exception("국가별 검색 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("국가별 검색 실패: $countryCode", e)
            throw Exception("국가별 검색에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 재고 부족 와인 조회
     */
    suspend fun findLowStockWines(threshold: Int = 5): List<Wine> {
        logger.info("재고 부족 와인 검색: threshold=$threshold")
        return try {
            val response = httpClient.get("$apiBaseUrl/wines/alerts/low-stock") {
                parameter("threshold", threshold)
            }.body<ApiResponse<List<Wine>>>()
            if (response.success && response.data != null) {
                logger.info("재고 부족 와인 검색 결과: ${response.data.size}개의 와인")
                response.data
            } else {
                throw Exception("재고 부족 와인 검색 실패: ${response.message}")
            }
        } catch (e: Exception) {
            logger.error("재고 부족 와인 검색 실패: threshold=$threshold", e)
            throw Exception("재고 부족 와인 검색에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * HTTP 클라이언트 종료
     */
    fun close() {
        runBlocking {
            httpClient.close()
        }
    }
}
