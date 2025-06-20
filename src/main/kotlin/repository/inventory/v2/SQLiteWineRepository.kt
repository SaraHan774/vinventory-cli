package com.august.repository.inventory.v2

import com.august.domain.v2.Wine
import com.august.repository.db.WineTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

class SQLiteWineRepository : IWineRepository {
    override fun save(wine: Wine): Wine = transaction {
        WineTable.insert {
            it[id] = UUID.fromString(wine.id)
            it[name] = wine.name
            it[countryCode] = wine.countryCode
            it[vintage] = wine.vintage
            it[price] = wine.price
            it[quantity] = wine.quantity
        }
        wine
    }

    override fun findById(id: String): Wine? = transaction {
        WineTable.selectAll()
            .where { WineTable.id eq UUID.fromString(id) }
            .singleOrNull()
            ?.toWine()
    }

    override fun delete(id: String): Unit = transaction {
        WineTable.deleteWhere { WineTable.id eq UUID.fromString(id) }
        Unit
    }

    override fun update(wine: Wine): Wine = transaction {
        WineTable.update({ WineTable.id eq UUID.fromString(wine.id) }) {
            it[name] = wine.name
            it[countryCode] = wine.countryCode
            it[vintage] = wine.vintage
            it[price] = wine.price
            it[quantity] = wine.quantity
        }
        wine
    }

    override fun findAll(): List<Wine> = transaction {
        WineTable.selectAll().map { it.toWine() }
    }

    override fun searchByName(query: String): List<Wine> = transaction {
        WineTable.selectAll()
            .where { WineTable.name like "%${query}%" }
            .map { it.toWine() }
    }

    override fun filterByVintageRange(startYear: Int, endYear: Int): List<Wine> = transaction {
        WineTable.selectAll()
            .where { 
                WineTable.vintage greaterEq startYear and (WineTable.vintage lessEq endYear)
            }
            .map { it.toWine() }
    }

    override fun filterByPriceRange(minPrice: Double, maxPrice: Double): List<Wine> = transaction {
        WineTable.selectAll()
            .where {
                WineTable.price greaterEq minPrice and (WineTable.price lessEq maxPrice)
            }
            .map { it.toWine() }
    }

    override fun filterByCountry(countryCode: String): List<Wine> = transaction {
        WineTable.selectAll()
            .where { WineTable.countryCode eq countryCode.uppercase() }
            .map { it.toWine() }
    }

    override fun findLowStock(threshold: Int): List<Wine> = transaction {
        WineTable.selectAll()
            .where { WineTable.quantity lessEq threshold }
            .map { it.toWine() }
    }

    private fun ResultRow.toWine(): Wine = Wine(
        id = this[WineTable.id].value.toString(),
        name = this[WineTable.name],
        countryCode = this[WineTable.countryCode],
        vintage = this[WineTable.vintage],
        price = this[WineTable.price],
        quantity = this[WineTable.quantity]
    )
} 