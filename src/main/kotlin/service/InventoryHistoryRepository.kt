package com.august.service

import com.august.domain.model.HistoryType
import com.august.domain.model.InventoryHistory
import java.util.*

interface InventoryHistoryRepository {
    fun logChange(
        wineId: String,
        historyType: HistoryType,
        quantityChanged: Int,
        modifiedBy: String,
        idGenerator: () -> String = { UUID.randomUUID().toString() },
    )

    fun getAllHistories(): List<InventoryHistory>
    fun getHistoriesByFilter(filter: HistoryFilterType): List<InventoryHistory>
}

sealed class HistoryFilterType {
    data class ModifiedBy(val name: String) : HistoryFilterType()
}