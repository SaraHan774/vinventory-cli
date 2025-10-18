package com.august.backend.repository.db.migrations

import com.august.backend.repository.db.BaseMigration
import com.august.backend.repository.db.WineTable
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Transaction

/**
 * 첫 번째 마이그레이션: 와인 테이블 생성
 * 
 * wines 테이블을 데이터베이스에 생성합니다.
 */
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

