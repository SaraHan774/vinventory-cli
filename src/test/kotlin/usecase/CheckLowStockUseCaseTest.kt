package usecase

import com.august.domain.model.v1.Wine
import com.august.repository.inventory.v1.InventoryRepository
import com.august.service.alert.AlertService
import com.august.usecase.CheckLowStockUseCase
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CheckLowStockUseCaseTest {
    private lateinit var sut: CheckLowStockUseCase
    private lateinit var inventoryRepository: InventoryRepository
    private lateinit var alertService: AlertService


    @BeforeEach
    fun setUp() {
        inventoryRepository = mockk<InventoryRepository>(relaxed = true)
        alertService = mockk<AlertService>(relaxed = true)
        sut = CheckLowStockUseCase(
            inventoryRepository = inventoryRepository,
            alertService = alertService,
            lowStockThreshold = LOW_STOCK_THRESHOLD
        )
    }

    @Test
    fun `given lowStockThreshold 보다 작은 수량의 와인, when execute, then sendAlert 함수가 호출된다`() {
        every { inventoryRepository.getById("1") } returns stubWine(
            id = "1", quantity = LOW_STOCK_THRESHOLD - 1,
        )
        sut.execute("1")
        verify(exactly = 1) { alertService.sendAlert(any()) }
    }

    @Test
    fun `given lowStockThreshold 와 같은 수량의 와인, when execute, then sendAlert 함수 호출된다`() {
        every { inventoryRepository.getById("1") } returns stubWine(
            id = "1", quantity = LOW_STOCK_THRESHOLD,
        )
        sut.execute("1")
        verify(exactly = 1) { alertService.sendAlert(any()) }
    }

    @Test
    fun `given lowStockThreshold 보다 큰 수량의 와인, when execute, then sendAlert 함수 호출 되지 않는다`() {
        every { inventoryRepository.getById("1") } returns stubWine(
            id = "1", quantity = LOW_STOCK_THRESHOLD + 1,
        )
        sut.execute("1")
        verify(exactly = 0) { alertService.sendAlert(any()) }
    }

    @Test
    fun `given 주어진 windId, when getById 실패, then sendAlert 함수 호출 되지 않는다`() {
        every { inventoryRepository.getById("1") } returns null
        sut.execute("1")
        verify(exactly = 0) { alertService.sendAlert(any()) }
        // confirmVerified(alertService) // ensure no other calls were made --> 이게 언제 필요할까?
    }

    private fun stubWine(id: String, quantity: Int): Wine {
        return Wine(
            id = id,
            quantity = quantity,
            wineryName = "", countryCode = "", vintage = 0, price = 0, // ignore other values
        )
    }

    companion object {
        private const val LOW_STOCK_THRESHOLD = 1
    }
}