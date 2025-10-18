package com.august.repository.db

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object MigrationTable : Table("migrations") {
    val version = varchar("version", 50)
    val description = varchar("description", 200)
    val appliedAt = datetime("applied_at")
    
    override val primaryKey = PrimaryKey(version)
} 