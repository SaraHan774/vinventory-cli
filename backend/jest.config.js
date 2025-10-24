module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/__tests__/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/setup.ts',
    '<rootDir>/src/__tests__/mocks/'
  ],
  testTimeout: 15000,
  verbose: true,
  // Context7 Jest 모범 사례 적용
  injectGlobals: false, // @jest/globals 사용을 위해 false로 설정
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  // 병렬 테스트 실행 최적화
  maxWorkers: '50%',
  // 메모리 사용량 최적화
  detectOpenHandles: true,
  forceExit: true
};
