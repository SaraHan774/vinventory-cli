package com.august.service

import com.august.domain.model.HistoryType
import com.august.domain.model.Wine
import java.util.concurrent.TimeUnit
import java.util.concurrent.locks.ReentrantLock

class InventoryRepositoryImpl(
    private val inventoryHistoryRepository: InventoryHistoryRepository = InventoryHistoryRepositoryImpl(),
) : InventoryRepository {
    private val wines = mutableListOf<Wine>() // TODO : 구체적인 Wine 모델에 얽혀있는 CRUD 클래스. 추상화 한다면 다양한 모델에 대해 재사용 가능하지 않을까?
    private val lock = ReentrantLock() // 동시성 제어를 위한 락 추가

    override fun register(wine: Wine, modifiedBy: String): Boolean {
        return withTryLock {
            if (wines.any { it.id == wine.id }) { // 중복 방지
                throw IllegalStateException("Register failed : duplicate wine already exists.")
            }
            inventoryHistoryRepository.logChange(
                wineId = wine.id,
                historyType = HistoryType.STOCK_IN,
                quantityChanged = wine.quantity,
                modifiedBy = modifiedBy
            )
            wines.add(wine)
        }
    }

    override fun delete(id: String, modifiedBy: String): Boolean {
        return withTryLock {
            val wine = findWineById(id) ?: throw WineNotFoundException("Cannot find wine ID : $id")
            inventoryHistoryRepository.logChange(
                wineId = id,
                historyType = HistoryType.STOCK_OUT,
                quantityChanged = -wine.quantity,
                modifiedBy = modifiedBy
            )
            return@withTryLock wines.remove(wine)
        }
    }

    override fun store(id: String, quantity: Int, modifiedBy: String): Boolean {
        return withTryLock {
            val (wine, index) = findWineAndIndexById(id)
            inventoryHistoryRepository.logChange(
                wineId = id,
                historyType = HistoryType.STOCK_IN,
                quantityChanged = quantity,
                modifiedBy = modifiedBy,
            )
            return@withTryLock adjustQuantity(index, wine, wine.quantity + quantity)
        }
    }

    override fun retrieve(id: String, quantity: Int, modifiedBy: String): Boolean {
        return withTryLock {
            val (wine, index) = findWineAndIndexById(id)
            val adjustedQuantity = wine.quantity - quantity
            if (adjustedQuantity < 0) {
                // 예외가 발생한 경우 원래 상태를 유지하는가? 출고 후 데이터가 실제로 어떻게 변화하는가?
                throw NotEnoughStockException(stockLeft = wine.quantity)
            }
            inventoryHistoryRepository.logChange(
                wineId = id,
                historyType = HistoryType.STOCK_OUT,
                quantityChanged = quantity,
                modifiedBy = modifiedBy,
            )
            return@withTryLock adjustQuantity(index, wine, adjustedQuantity)
        }
    }


    override fun getAll(): List<Wine> {
        // 단순히 리스트를 반환하는 것이지만, 리스트가 변경될 때 정확한 데이터를 리턴하는지 검증할 필요가 있다.
        // 데이터가 추가되거나 삭제된 후 getAll이 올바른 상태를 유지하는지 확인해야 함
        return wines
    }

    private fun findWineById(id: String): Wine? {
        return wines.find { it.id == id } // 순회 1
    }

    private fun findWineAndIndexById(id: String): Pair<Wine, Int> {
        val result = wines.withIndex().find {
            it.value.id == id
        }
        if (result == null) throw WineNotFoundException("Cannot find wine with ID : $id")
        return result.value to result.index
    }

    private fun adjustQuantity(index: Int, wine: Wine, quantity: Int): Boolean {
        wines[index] = wine.copy(quantity = quantity)
        return true
    }

    private fun withTryLock(block: () -> Boolean): Boolean {
        if (lock.tryLock(1, TimeUnit.SECONDS).not()) return false
        try {
            return block()
        } finally {
            lock.unlock()
        }
    }
}

class WineNotFoundException(message: String) : IllegalStateException(message)

class NotEnoughStockException(
    private val stockLeft: Int, message: String = "Not enough items. Only $stockLeft items left.",
) : IllegalStateException(message)