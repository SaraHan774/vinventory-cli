package com.august.domain.model

data class InventoryHistory(
    val id: String,
    val wineId: String,
    val historyType: HistoryType,
    val timestamp: Long,
    val quantityChanged: Int,
    val modifiedBy: String, // 담당자 이름
)

enum class HistoryType {
    STOCK_IN, STOCK_OUT
}