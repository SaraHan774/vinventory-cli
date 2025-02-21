package service

import com.august.domain.model.HistoryType
import com.august.domain.model.InventoryHistory
import com.august.domain.model.Wine
import com.august.service.HistoryFilterType
import com.august.service.InventoryHistoryRepository
import com.august.service.InventoryHistoryRepositoryImpl
import com.august.service.InventoryRepository
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import kotlin.test.assertTrue

class InventoryHistoryRepositoryImplTest {
    private lateinit var sut: InventoryHistoryRepository

    @Test
    fun logChange() {
        sut = InventoryHistoryRepositoryImpl()
        sut.logChange(
            wineId = "wine-001",
            historyType = HistoryType.StockIn,
            quantityChanged = 10,
            modifiedBy = "user-123",
            idGenerator = { "fixed-uuid-1234" }
        )

        val history = sut.getAllHistories()
        assertEquals(1, history.size)
        assertEquals("fixed-uuid-1234", history.first().id)
    }

    @Test
    fun filterHistoriesTest() {
        val filterTypes = listOf(
            HistoryFilterType.Type(HistoryType.StockIn),
            HistoryFilterType.Type(HistoryType.StockOut),
            HistoryFilterType.Id("fixed-uuid-1234"),
            HistoryFilterType.WineId("wine-001"),
            HistoryFilterType.Quantity(10),
            HistoryFilterType.ModifiedBy("user-123")
        )
        // TODO 테스트 작성
    }
}