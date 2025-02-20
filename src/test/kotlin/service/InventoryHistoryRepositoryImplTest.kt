package service

import com.august.domain.model.HistoryType
import com.august.domain.model.Wine
import com.august.service.InventoryHistoryRepositoryImpl
import com.august.service.InventoryRepository
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import kotlin.test.assertTrue

class InventoryHistoryRepositoryImplTest {
    @Test
    fun logChange() {
        val historyRepository = InventoryHistoryRepositoryImpl // object 객체를 테스트 ?
        historyRepository.logChange(
            wineId = "1",
            quantityChanged = 10,
            historyType = HistoryType.StockIn,
            modifiedBy = "Sara"
        )
        assertTrue { historyRepository.getAllHistories().size == 1 }
    }

    @Test
    fun getHistory() {
    }
}