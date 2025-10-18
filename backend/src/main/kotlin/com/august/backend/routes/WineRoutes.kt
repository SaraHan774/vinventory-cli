package com.august.backend.routes

import com.august.domain.model.*
import com.august.backend.service.IInventoryService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.slf4j.LoggerFactory

/**
 * 와인 관련 REST API 라우트
 * 
 * Context7 Ktor 문서를 참조하여 구현한 RESTful API 엔드포인트입니다.
 * 
 * @property inventoryService 재고 관리 서비스
 */
fun Route.wineRoutes(inventoryService: IInventoryService) {
    val logger = LoggerFactory.getLogger("WineRoutes")
    
    route("/api/wines") {
        // GET /api/wines - 모든 와인 조회
        get {
            try {
                val wines = inventoryService.getAllWines()
                logger.info("Retrieved ${wines.size} wines")
                call.respond(HttpStatusCode.OK, wines)
            } catch (e: Exception) {
                logger.error("Failed to retrieve wines", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to retrieve wines"))
            }
        }
        
        // POST /api/wines - 새 와인 등록
        post {
            try {
                val request = call.receive<CreateWineRequest>()
                
                // 입력 검증
                validateWineRequest(request)
                
                val wine = inventoryService.registerWine(
                    name = request.name,
                    countryCode = request.countryCode,
                    vintage = request.vintage,
                    price = request.price,
                    quantity = request.quantity
                )
                
                logger.info("Created wine: ${wine.id}")
                call.respond(HttpStatusCode.Created, wine)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid wine request: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid request"))
            } catch (e: Exception) {
                logger.error("Failed to create wine", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to create wine"))
            }
        }
        
        // GET /api/wines/{id} - 특정 와인 조회
        get("/{id}") {
            try {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Wine ID is required")
                val wine = inventoryService.retrieveWine(id)
                logger.info("Retrieved wine: $id")
                call.respond(HttpStatusCode.OK, wine)
            } catch (e: IllegalArgumentException) {
                logger.warn("Wine not found: ${call.parameters["id"]}")
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Wine not found"))
            } catch (e: Exception) {
                logger.error("Failed to retrieve wine", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to retrieve wine"))
            }
        }
        
        // PUT /api/wines/{id} - 와인 정보 업데이트
        put("/{id}") {
            try {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Wine ID is required")
                val request = call.receive<UpdateWineRequest>()
                
                // 기존 와인 조회
                val existingWine = inventoryService.retrieveWine(id)
                
                // 업데이트할 필드만 적용
                val updatedWine = existingWine.copy(
                    name = request.name ?: existingWine.name,
                    countryCode = request.countryCode ?: existingWine.countryCode,
                    vintage = request.vintage ?: existingWine.vintage,
                    price = request.price ?: existingWine.price,
                    quantity = request.quantity ?: existingWine.quantity
                )
                
                // 실제 와인 업데이트 수행
                inventoryService.updateWine(updatedWine)
                
                logger.info("Updated wine: $id")
                call.respond(HttpStatusCode.OK, updatedWine)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid update request: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid request"))
            } catch (e: Exception) {
                logger.error("Failed to update wine", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to update wine"))
            }
        }
        
        // DELETE /api/wines/{id} - 와인 삭제
        delete("/{id}") {
            try {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Wine ID is required")
                inventoryService.deleteWine(id)
                logger.info("Deleted wine: $id")
                call.respond(HttpStatusCode.OK, SuccessResponse(true, "Wine deleted successfully"))
            } catch (e: IllegalArgumentException) {
                logger.warn("Wine not found: ${call.parameters["id"]}")
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Wine not found"))
            } catch (e: Exception) {
                logger.error("Failed to delete wine", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to delete wine"))
            }
        }
        
        // PUT /api/wines/{id}/quantity - 와인 수량 업데이트
        put("/{id}/quantity") {
            try {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Wine ID is required")
                val request = call.receive<UpdateWineQuantityRequest>()
                
                inventoryService.addWine(id, request.quantity)
                
                val updatedWine = inventoryService.retrieveWine(id)
                logger.info("Updated wine quantity: $id, added: ${request.quantity}")
                call.respond(HttpStatusCode.OK, updatedWine)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid quantity update: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid request"))
            } catch (e: Exception) {
                logger.error("Failed to update wine quantity", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to update wine quantity"))
            }
        }
        
        // GET /api/wines/search?query=... - 이름으로 와인 검색
        get("/search") {
            try {
                val query = call.request.queryParameters["query"] 
                    ?: throw IllegalArgumentException("Search query is required")
                
                val wines = inventoryService.searchWinesByName(query)
                logger.info("Search results for '$query': ${wines.size} wines")
                call.respond(HttpStatusCode.OK, wines)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid search query: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid search query"))
            } catch (e: Exception) {
                logger.error("Failed to search wines", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to search wines"))
            }
        }
        
        // GET /api/wines/filter - 다양한 조건으로 와인 필터링
        get("/filter") {
            try {
                val vintageStart = call.request.queryParameters["vintageStart"]?.toIntOrNull()
                val vintageEnd = call.request.queryParameters["vintageEnd"]?.toIntOrNull()
                val minPrice = call.request.queryParameters["minPrice"]?.toDoubleOrNull()
                val maxPrice = call.request.queryParameters["maxPrice"]?.toDoubleOrNull()
                val country = call.request.queryParameters["country"]
                
                val wines = when {
                    vintageStart != null && vintageEnd != null -> {
                        inventoryService.findWinesByVintageRange(vintageStart, vintageEnd)
                    }
                    minPrice != null && maxPrice != null -> {
                        inventoryService.findWinesByPriceRange(minPrice, maxPrice)
                    }
                    country != null -> {
                        inventoryService.findWinesByCountry(country)
                    }
                    else -> {
                        throw IllegalArgumentException("At least one filter parameter is required")
                    }
                }
                
                logger.info("Filter results: ${wines.size} wines")
                call.respond(HttpStatusCode.OK, wines)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid filter parameters: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid filter parameters"))
            } catch (e: Exception) {
                logger.error("Failed to filter wines", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to filter wines"))
            }
        }
        
        // GET /api/wines/low-stock - 재고 부족 와인 조회
        get("/low-stock") {
            try {
                val threshold = call.request.queryParameters["threshold"]?.toIntOrNull() ?: 5
                val wines = inventoryService.findLowStockWines(threshold)
                logger.info("Low stock wines (threshold: $threshold): ${wines.size} wines")
                call.respond(HttpStatusCode.OK, wines)
            } catch (e: IllegalArgumentException) {
                logger.warn("Invalid threshold: ${e.message}")
                call.respond(HttpStatusCode.BadRequest, ErrorResponse(e.message ?: "Invalid threshold"))
            } catch (e: Exception) {
                logger.error("Failed to get low stock wines", e)
                call.respond(HttpStatusCode.InternalServerError, ErrorResponse("Failed to get low stock wines"))
            }
        }
    }
}

/**
 * 와인 생성 요청 검증
 * 
 * @param request 검증할 와인 생성 요청
 * @throws IllegalArgumentException 검증 실패 시
 */
private fun validateWineRequest(request: CreateWineRequest) {
    if (request.name.isBlank()) {
        throw IllegalArgumentException("Wine name cannot be empty")
    }
    if (request.countryCode.isBlank() || request.countryCode.length != 2) {
        throw IllegalArgumentException("Country code must be exactly 2 characters")
    }
    if (request.vintage < 1900 || request.vintage > 2030) {
        throw IllegalArgumentException("Vintage must be between 1900 and 2030")
    }
    if (request.price < 0) {
        throw IllegalArgumentException("Price cannot be negative")
    }
    if (request.quantity < 0) {
        throw IllegalArgumentException("Quantity cannot be negative")
    }
}

