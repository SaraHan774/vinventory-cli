package com.august.backend.repository.db

import org.jetbrains.exposed.sql.Transaction

/**
 * 데이터베이스 마이그레이션 인터페이스
 * 
 * 모든 마이그레이션 클래스가 구현해야 하는 인터페이스입니다.
 */
interface Migration {
    val version: String
    val description: String
    
    /**
     * 마이그레이션 적용 (up)
     * 
     * @param transaction 트랜잭션 컨텍스트
     */
    fun up(transaction: Transaction)
    
    /**
     * 마이그레이션 롤백 (down)
     * 
     * @param transaction 트랜잭션 컨텍스트
     */
    fun down(transaction: Transaction)
}

/**
 * 베이스 마이그레이션 추상 클래스
 * 
 * 마이그레이션 클래스의 공통 기능을 제공합니다.
 */
abstract class BaseMigration : Migration {
    override val version: String
        get() = this::class.simpleName?.replace("Migration", "") 
            ?: throw IllegalStateException("Migration class name must end with 'Migration'")
            
    /**
     * 버전 형식 검증
     * 
     * @param version 검증할 버전 문자열
     * @throws IllegalStateException 버전 형식이 올바르지 않은 경우
     */
    protected fun requireVersion(version: String) {
        if (!version.matches(Regex("V\\d{4}"))) {
            throw IllegalStateException("Migration version must be in format 'V' followed by 4 digits, e.g. V0001")
        }
    }
}

