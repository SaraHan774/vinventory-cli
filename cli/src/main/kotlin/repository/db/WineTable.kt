package com.august.repository.db

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Column

object WineTable : UUIDTable("wines") {
    val name: Column<String> = varchar("name", 255)
    val countryCode: Column<String> = varchar("country_code", 2)
    val vintage: Column<Int> = integer("vintage")
    val price: Column<Double> = double("price")
    val quantity: Column<Int> = integer("quantity")
} 