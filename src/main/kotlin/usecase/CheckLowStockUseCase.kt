package com.august.usecase

import com.august.repository.inventory.InventoryRepository
import com.august.service.alert.AlertService

class CheckLowStockUseCase(
    private val inventoryRepository: InventoryRepository,
    private val alertService: AlertService,
    private val lowStockThreshold: Int = 5,
) {
    fun execute(wineId: String) {
        // 재고가 10개 있는데, 10개를 꺼낸다고 할때, low stock 이라는 알림이 켜지는게 맞나?
        // 일단 그냥 return 해버리자.
        val wine = inventoryRepository.getById(wineId) ?: return
        if (wine.quantity <= lowStockThreshold) {
            alertService.sendAlert("Low stock alert : $wineId")
        }
    }
}