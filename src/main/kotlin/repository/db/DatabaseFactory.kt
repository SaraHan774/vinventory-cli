package com.august.repository.db

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

object DatabaseFactory {
    fun init(dbPath: String = "vinventory.db") {
        val dbFile = File(dbPath)
        val url = "jdbc:sqlite:${dbFile.absolutePath}"
        
        Database.connect(url, "org.sqlite.JDBC")
        
        transaction {
            SchemaUtils.create(WineTable)
        }
    }
} 