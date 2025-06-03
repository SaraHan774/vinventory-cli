package com.august.repository.db.migrations

import com.august.repository.db.BaseMigration
import com.august.repository.db.WineTable
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Transaction

class V0001Migration : BaseMigration() {
    init {
        requireVersion(version)
    }
    
    override val description: String = "Create initial wine table"

    override fun up(transaction: Transaction) {
        SchemaUtils.create(WineTable)
    }

    override fun down(transaction: Transaction) {
        SchemaUtils.drop(WineTable)
    }
} 