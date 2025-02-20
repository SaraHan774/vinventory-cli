package com.august.domain.model

data class InventoryRecord(
    val wineId: Int,
    val recordType: InventoryRecordType,
    val time: String,
    val quantity: Int,
    val modifiedBy: String, // 담당자 이름
)

enum class InventoryRecordType {
    STORE, RETRIEVE
}