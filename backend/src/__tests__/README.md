# 백엔드 API 테스트 가이드

이 문서는 Vinventory 백엔드 API의 테스트 구조와 실행 방법을 설명합니다.

## 테스트 구조

```
src/__tests__/
├── setup.ts                    # Jest 전역 설정
├── mocks/
│   └── supabaseMock.ts         # Supabase Mock 유틸리티
├── services/
│   └── wineService.test.ts     # WineService 단위 테스트
├── routes/
│   └── wineRoutes.test.ts      # WineRoutes 통합 테스트
├── integration/
│   └── api.test.ts             # 전체 API E2E 테스트
└── README.md                   # 이 파일
```

## 테스트 유형

### 1. 단위 테스트 (Unit Tests)
- **위치**: `services/wineService.test.ts`
- **목적**: WineService 클래스의 개별 메서드 테스트
- **특징**: Supabase Mock을 사용하여 데이터베이스 의존성 제거
- **커버리지**: 모든 서비스 메서드의 성공/실패 시나리오

### 2. 통합 테스트 (Integration Tests)
- **위치**: `routes/wineRoutes.test.ts`
- **목적**: Express 라우터의 HTTP 엔드포인트 테스트
- **특징**: Supertest를 사용한 실제 HTTP 요청/응답 테스트
- **커버리지**: 모든 API 엔드포인트의 성공/실패 시나리오

### 3. E2E 테스트 (End-to-End Tests)
- **위치**: `integration/api.test.ts`
- **목적**: 전체 애플리케이션의 완전한 플로우 테스트
- **특징**: 실제 Express 앱을 사용한 전체 요청/응답 플로우
- **커버리지**: CRUD 플로우, 에러 처리, 보안 헤더, 성능 테스트

## 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### 특정 테스트 파일 실행
```bash
# 단위 테스트만 실행
npm test -- services/wineService.test.ts

# 통합 테스트만 실행
npm test -- routes/wineRoutes.test.ts

# E2E 테스트만 실행
npm test -- integration/api.test.ts
```

### 테스트 커버리지 확인
```bash
npm run test:coverage
```

### 테스트 감시 모드
```bash
npm run test:watch
```

## 테스트 작성 가이드

### Context7 Jest 모범 사례 적용

1. **명시적 Import 사용**
   ```typescript
   import { describe, expect, test, beforeEach, jest } from '@jest/globals';
   ```

2. **타입 안전한 Mock 사용**
   ```typescript
   const mockService = jest.mocked(service);
   ```

3. **비동기 테스트**
   ```typescript
   test('비동기 작업 테스트', async () => {
     const result = await asyncFunction();
     expect(result).toBe(expectedValue);
   });
   ```

4. **Supertest 사용**
   ```typescript
   const response = await request(app)
     .get('/api/v1/wines')
     .expect(200);
   ```

### 테스트 구조

```typescript
describe('테스트 그룹', () => {
  beforeEach(() => {
    // 각 테스트 전 설정
  });

  test('구체적인 테스트 케이스', async () => {
    // Given: 테스트 데이터 준비
    // When: 테스트 실행
    // Then: 결과 검증
  });
});
```

## Mock 전략

### Supabase Mock
- 실제 데이터베이스 연결 없이 테스트
- 다양한 응답 시나리오 시뮬레이션
- 에러 상황 테스트 가능

### Service Mock
- 의존성 격리를 통한 단위 테스트
- 특정 메서드의 동작 제어
- 에러 시나리오 테스트

## 테스트 데이터

### Mock 데이터
- `mockWines`: 테스트용 와인 데이터 배열
- `createMockWine()`: 동적 Mock 데이터 생성
- `mockSuccessfulResponse()`: 성공 응답 Mock
- `mockErrorResponse()`: 에러 응답 Mock

## 성능 고려사항

### Jest 설정 최적화
- `maxWorkers: '50%'`: CPU 코어의 50% 사용
- `detectOpenHandles: true`: 메모리 누수 감지
- `forceExit: true`: 테스트 완료 후 강제 종료

### 테스트 격리
- 각 테스트는 독립적으로 실행
- Mock 상태 초기화
- 데이터베이스 상태 격리

## 디버깅

### 테스트 실패 시
1. 테스트 로그 확인
2. Mock 설정 검증
3. 의존성 상태 확인
4. 타입 에러 검사

### 로그 활성화
```bash
# 상세 로그와 함께 테스트 실행
npm test -- --verbose

# 특정 테스트만 실행
npm test -- --testNamePattern="특정 테스트명"
```

## CI/CD 통합

### GitHub Actions 예시
```yaml
- name: Run Tests
  run: |
    npm install
    npm run test:coverage
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## 문제 해결

### 일반적인 문제들

1. **타입 에러**: `@jest/globals` import 확인
2. **Mock 에러**: Mock 설정 및 초기화 확인
3. **타임아웃**: `testTimeout` 설정 조정
4. **메모리 누수**: `detectOpenHandles` 설정 확인

### 성능 개선

1. **병렬 실행**: `maxWorkers` 설정 조정
2. **테스트 분리**: 관련 없는 테스트 그룹 분리
3. **Mock 최적화**: 불필요한 Mock 제거
4. **데이터 최적화**: 테스트 데이터 크기 최소화
