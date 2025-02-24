package com.august.repository.inventory

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
    fun getHistoriesByFilter(vararg filterTypes: HistoryFilterType): List<InventoryHistory>
}

sealed class HistoryFilterType {
    data class WineId(val id: String): HistoryFilterType()
    data class Type(val type: HistoryType): HistoryFilterType()
    data class Quantity(val quantity: Int): HistoryFilterType()
    data class ModifiedBy(val name: String) : HistoryFilterType()
    data class Id(val id: String): HistoryFilterType()
}