# Vinventory Backend (TypeScript)

TypeScript 기반 Express API 서버로 Supabase와 연동하여 와인 재고 관리 시스템의 백엔드를 제공합니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 환경 변수 설정

```bash
cp env.example .env
```

`.env` 파일을 편집하여 Supabase 설정을 입력하세요:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=8590
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📚 API 엔드포인트

### 헬스 체크
- `GET /health` - 서버 및 데이터베이스 연결 상태 확인

### API 정보
- `GET /api` - API 정보 및 사용 가능한 엔드포인트 목록

### 와인 관리
- `GET /api/v1/wines` - 와인 목록 조회 (필터링, 정렬, 페이지네이션 지원)
- `GET /api/v1/wines/:id` - 특정 와인 조회
- `POST /api/v1/wines` - 새 와인 생성
- `PUT /api/v1/wines/:id` - 와인 정보 업데이트
- `DELETE /api/v1/wines/:id` - 와인 삭제
- `GET /api/v1/wines/alerts/low-stock` - 저재고 와인 목록 조회

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase 클라이언트 설정
│   ├── middleware/
│   │   └── errorHandler.ts      # 에러 처리 미들웨어
│   ├── routes/
│   │   └── wineRoutes.ts        # 와인 API 라우트
│   ├── services/
│   │   └── wineService.ts       # 와인 비즈니스 로직
│   ├── types/
│   │   └── wine.ts              # TypeScript 타입 정의
│   └── index.ts                 # 메인 서버 파일
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 개발 스크립트

- `npm run dev` - 개발 서버 실행 (tsx watch)
- `npm run build` - TypeScript 컴파일
- `npm start` - 프로덕션 서버 실행
- `npm run clean` - 빌드 파일 정리

## 🌐 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | - |
| `SUPABASE_ANON_KEY` | Supabase 익명 키 | - |
| `PORT` | 서버 포트 | 8590 |
| `NODE_ENV` | 실행 환경 | development |
| `FRONTEND_URL` | 프론트엔드 URL (CORS) | http://localhost:5174 |

## 🔒 보안 기능

- **Helmet**: HTTP 헤더 보안 설정
- **CORS**: 크로스 오리진 요청 제어
- **입력 검증**: Zod를 사용한 스키마 검증
- **에러 처리**: 중앙화된 에러 핸들링

## 📊 모니터링

- **헬스 체크**: `/health` 엔드포인트로 서비스 상태 확인
- **로깅**: Morgan을 사용한 HTTP 요청 로깅
- **에러 추적**: 구조화된 에러 로깅 및 응답

## 🚀 배포

1. 환경 변수 설정
2. `npm run build` 실행
3. `npm start`로 프로덕션 서버 실행

## 🤝 기여

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성
