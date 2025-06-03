package com.august.repository.inventory.v1

import com.august.domain.model.v1.HistoryType
import com.august.domain.model.v1.InventoryHistory

class InventoryHistoryRepositoryImpl : InventoryHistoryRepository {
    private val changeLog = mutableListOf<InventoryHistory>()

    override fun logChange(
        wineId: String,
        historyType: HistoryType,
        quantityChanged: Int,
        modifiedBy: String,
        idGenerator: () -> String,
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

    override fun getHistoriesByFilter(vararg filterTypes: HistoryFilterType): List<InventoryHistory> {
        return filterTypes.map { filter ->
            findHistories(filter)
        }.reduce { acc, list ->
            acc.intersect(list.toSet()).toList()
        }
    }

    private fun findHistories(filterType: HistoryFilterType): List<InventoryHistory> {
        return when (filterType) {
            is HistoryFilterType.Id -> {
                changeLog.filter { it.id == filterType.id }
            }

            is HistoryFilterType.Type -> {
                changeLog.filter { it.historyType == filterType.type }
            }

            is HistoryFilterType.WineId -> {
                changeLog.filter { it.wineId == filterType.id }
            }

            is HistoryFilterType.Quantity -> {
                changeLog.filter { it.quantityChanged == filterType.quantity }
            }

            is HistoryFilterType.ModifiedBy -> {
                changeLog.filter { it.modifiedBy == filterType.name }
            }
        }
    }
}