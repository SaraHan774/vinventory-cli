package repository.inventory

import com.august.domain.model.HistoryType
import com.august.repository.inventory.HistoryFilterType
import com.august.repository.inventory.InventoryHistoryRepositoryImpl
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class InventoryHistoryRepositoryImplTest {
    private lateinit var repository: InventoryHistoryRepositoryImpl

    @BeforeEach
    fun setup() {
        repository = InventoryHistoryRepositoryImpl()
    }

    @Test
    fun `logChange should add a new history entry`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }
        val histories = repository.getAllHistories()

        assertEquals(1, histories.size)
        assertEquals("uuid-001", histories.first().id)
        assertEquals("wine-001", histories.first().wineId)
        assertEquals(HistoryType.STOCK_IN, histories.first().historyType)
        assertEquals(10, histories.first().quantityChanged)
        assertEquals("user-123", histories.first().modifiedBy)
    }

    @Test
    fun `getAllHistories should return all logged histories`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }
        repository.logChange("wine-002", HistoryType.STOCK_OUT, 5, "user-456") { "uuid-002" }

        val histories = repository.getAllHistories()
        assertEquals(2, histories.size)
    }

    @Test
    fun `getHistoriesByFilter should filter by id`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }
        repository.logChange("wine-002", HistoryType.STOCK_OUT, 5, "user-456") { "uuid-002" }

        val result = repository.getHistoriesByFilter(HistoryFilterType.Id("uuid-001"))
        assertEquals(1, result.size)
        assertEquals("uuid-001", result.first().id)
    }

    @Test
    fun `getHistoriesByFilter should filter by type`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }
        repository.logChange("wine-002", HistoryType.STOCK_OUT, 5, "user-456") { "uuid-002" }

        val result = repository.getHistoriesByFilter(HistoryFilterType.Type(HistoryType.STOCK_IN))
        assertEquals(1, result.size)
        assertEquals(HistoryType.STOCK_IN, result.first().historyType)
    }

    @Test
    fun `getHistoriesByFilter should return intersection of multiple filters`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }
        repository.logChange("wine-002", HistoryType.STOCK_OUT, 5, "user-123") { "uuid-002" }
        repository.logChange("wine-003", HistoryType.STOCK_IN, 15, "user-789") { "uuid-003" }

        val result = repository.getHistoriesByFilter(
            HistoryFilterType.Type(HistoryType.STOCK_IN),
            HistoryFilterType.ModifiedBy("user-123")
        )

        assertEquals(1, result.size)
        assertEquals("uuid-001", result.first().id)
    }

    @Test
    fun `getHistoriesByFilter should return empty list if no match`() {
        repository.logChange("wine-001", HistoryType.STOCK_IN, 10, "user-123") { "uuid-001" }

        val result = repository.getHistoriesByFilter(HistoryFilterType.Type(HistoryType.STOCK_OUT))
        assertTrue(result.isEmpty())
    }
}
