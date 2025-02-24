package com.august.service.inventory

import com.august.domain.model.Wine
import com.august.repository.inventory.InventoryHistoryRepository
import com.august.repository.inventory.InventoryRepository
import com.august.repository.inventory.InventoryRepositoryImpl
import com.august.service.alert.AlertService
import com.august.service.alert.ConsoleAlertService
import com.august.service.alert.ErrorHandler
import com.august.service.alert.InventoryServiceErrorHandler
import com.august.usecase.CheckLowStockUseCase

class InventoryService(
    private val inventoryRepository: InventoryRepository = InventoryRepositoryImpl(),
    private val errorHandler: ErrorHandler = InventoryServiceErrorHandler(),
    alertService: AlertService = ConsoleAlertService(),
) {
    private val checkLowStockUseCase = CheckLowStockUseCase(
        inventoryRepository = inventoryRepository,
        alertService = alertService,
        lowStockThreshold = 5
    )

    fun register(wine: Wine, modifiedBy: String) {
        try {
            val isSuccess = inventoryRepository.register(wine, modifiedBy)
            if (isSuccess.not()) throw IllegalStateException()
        } catch (e: Exception) {
            errorHandler.handle(e, message = "register failed!")
        }
    }

    fun delete(id: String, modifiedBy: String) {
        try {
            val isSuccess = inventoryRepository.delete(id, modifiedBy)
            if (isSuccess.not()) throw IllegalStateException()
        } catch (e: Exception) {
            errorHandler.handle(e, message = "delete failed!")
        }
    }

    fun store(id: String, quantity: Int, modifiedBy: String) {
        try {
            val isSuccess = inventoryRepository.store(id, quantity, modifiedBy)
            if (isSuccess) {
                checkLowStockUseCase.execute(id)
            }
        } catch (e: Exception) {
            errorHandler.handle(e, message = "store failed!")
        }
    }

    fun retrieve(id: String, quantity: Int, modifiedBy: String) {
        try {
            val isSuccess = inventoryRepository.retrieve(id, quantity, modifiedBy)
            if (isSuccess) {
                checkLowStockUseCase.execute(id)
            }
        } catch (e: Exception) {
            errorHandler.handle(e, message = "retrieve failed!")
        }
    }
}