package com.august.backend.repository.db

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

/**
 * 마이그레이션 추적 테이블
 * 
 * 적용된 마이그레이션의 이력을 관리하는 테이블입니다.
 */
object MigrationTable : Table("migrations") {
    val version = varchar("version", 50)
    val description = varchar("description", 200)
    val appliedAt = datetime("applied_at")
    
    override val primaryKey = PrimaryKey(version)
}

