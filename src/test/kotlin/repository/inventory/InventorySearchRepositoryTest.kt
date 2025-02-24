package repository.inventory

import com.august.domain.model.Wine
import com.august.repository.inventory.InventoryFilterType.*
import com.august.repository.inventory.InventorySearchRepositoryImpl
import com.august.repository.inventory.RangeFilter.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class InventorySearchRepositoryImplTest {
    private lateinit var repository: InventorySearchRepositoryImpl
    private lateinit var testWines: List<Wine>

    @BeforeEach
    fun setup() {
        repository = InventorySearchRepositoryImpl()
        testWines = listOf(
            Wine(id = "1", wineryName = "Chateau Margaux", countryCode = "FR", vintage = 2015, price = 500, quantity = 10),
            Wine(id = "2", wineryName = "Opus One", countryCode = "US", vintage = 2018, price = 700, quantity = 5),
            Wine(id = "3", wineryName = "Chateau Latour", countryCode = "FR", vintage = 2015, price = 300, quantity = 15),
            Wine(id = "4", wineryName = "Chateau Mouton", countryCode = "FR", vintage = 2020, price = 600, quantity = 8)
        )
    }

    @Test
    fun `와이너리 이름으로 검색하면 해당 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, WineryName("Chateau Margaux"))
        assertEquals(1, result.size)
        assertEquals("Chateau Margaux", result.first().wineryName)
    }

    @Test
    fun `국가 코드로 검색하면 해당 국가의 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, CountryCode("FR"))
        assertEquals(3, result.size)
        assertTrue(result.all { it.countryCode == "FR" })
    }

    @Test
    fun `빈티지(연도)로 검색하면 해당 연도의 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Vintage(Exact(2015)))
        assertEquals(2, result.size)
        assertTrue(result.all { it.vintage == 2015 })
    }

    @Test
    fun `빈티지 범위로 검색하면 해당 범위 내의 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Vintage(MinMax(2015, 2018)))
        assertEquals(3, result.size)
        assertTrue(result.all { it.vintage in 2015..2018 })
    }

    @Test
    fun `가격이 정확한 값과 일치하는 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Price(Exact(500)))
        assertEquals(1, result.size)
        assertEquals(500, result.first().price)
    }

    @Test
    fun `가격 범위 내의 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Price(MinMax(400, 700)))
        assertEquals(3, result.size)
        assertTrue(result.all { it.price in 400..700 })
    }

    @Test
    fun `수량이 정확한 값과 일치하는 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Quantity(Exact(10)))
        assertEquals(1, result.size)
        assertEquals(10, result.first().quantity)
    }

    @Test
    fun `수량 범위 내의 와인만 필터링되어야 한다`() {
        val result = repository.findWineByFilter(testWines, Quantity(MinMax(5, 15)))
        assertEquals(4, result.size)
        assertTrue(result.all { it.quantity in 5..15 })
    }

    @Test
    fun `다중 필터링을 적용하면 모든 조건을 만족하는 와인만 반환되어야 한다`() {
        val result = repository.findWineByFilter(testWines, CountryCode("FR"), Vintage(Exact(2015)), Price(MinMax(300, 500)))
        assertEquals(2, result.size)
        assertTrue(result.all { it.countryCode == "FR" && it.vintage == 2015 && it.price in 300..500 })
    }

    @Test
    fun `필터링 결과가 없는 경우 빈 리스트가 반환되어야 한다`() {
        val result = repository.findWineByFilter(testWines, WineryName("Nonexistent Winery"))
        assertTrue(result.isEmpty())
    }
}