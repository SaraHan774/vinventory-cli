package com.august.service

import com.august.domain.model.HistoryType
import com.august.domain.model.InventoryHistory

object InventoryHistoryRepositoryImpl: InventoryHistoryRepository {
    private val changeLog = mutableListOf<InventoryHistory>()

    override fun logChange(
        wineId: String,
        historyType: HistoryType,
        quantityChanged: Int,
        modifiedBy: String,
        idGenerator : () -> String
    ) {
        changeLog.add(
            InventoryHistory(
                id = idGenerator(),
                wineId = wineId,
                historyType = historyType,
                quantityChanged = quantityChanged,
                modifiedBy = modifiedBy,
                timestamp = System.currentTimeMillis()
            )
        )
    }

    override fun getAllHistories(): List<InventoryHistory> {
        return changeLog
    }

    override fun getHistoriesByFilter(filter: HistoryFilterType): List<InventoryHistory> {
        // TODO : Not Implemented
        return changeLog
    }
}