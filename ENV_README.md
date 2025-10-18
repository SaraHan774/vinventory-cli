# 🔧 환경 변수 관리 가이드

이 문서는 Vinventory 프로젝트의 환경 변수 파일 관리 방법을 설명합니다.

## 📁 파일 구조

```
vinventory-cli/
├── .env.example          # 📝 예시 파일 (Git에 포함)
├── .env.local           # 🔒 실제 환경 변수 (Git에서 제외)
├── .gitignore           # ✅ 환경 변수 파일들 제외 설정
├── frontend/
│   └── vite.config.ts   # 🔧 루트의 환경 변수 파일 사용 설정
└── backend/
    └── (필요시 별도 환경 변수 파일)
```

## 🎯 환경 변수 파일 종류

### 1. `.env.example` (예시 파일)
- **목적**: 팀원들이 참고할 수 있는 환경 변수 예시
- **Git 포함**: ✅ 포함됨
- **내용**: 실제 값 대신 예시 값이나 플레이스홀더

### 2. `.env.local` (로컬 개발용)
- **목적**: 로컬 개발 환경에서 사용하는 실제 환경 변수
- **Git 포함**: ❌ 제외됨 (보안상 중요)
- **내용**: 실제 API 키, 데이터베이스 URL 등

### 3. 기타 환경별 파일
- `.env.development` - 개발 환경용
- `.env.production` - 프로덕션 환경용
- `.env.test` - 테스트 환경용

## 🚀 설정 방법

### 1. 초기 설정

```bash
# 1. 예시 파일을 복사하여 로컬 환경 변수 파일 생성
cp .env.example .env.local

# 2. .env.local 파일을 편집하여 실제 값으로 변경
nano .env.local
```

### 2. 환경 변수 파일 내용

#### `.env.local` 예시
```bash
# Supabase 설정
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# 백엔드 설정 (필요시)
BACKEND_PORT=8590
DATABASE_URL=jdbc:sqlite:vinventory.db

# 개발/프로덕션 환경 구분
NODE_ENV=development
```

## 🔒 보안 모범 사례

### ✅ 해야 할 것
- `.env.local` 파일은 **절대 Git에 커밋하지 마세요**
- 민감한 정보는 환경 변수로 관리하세요
- API 키는 정기적으로 갱신하세요
- `.env.example` 파일을 통해 팀원들에게 필요한 환경 변수를 알려주세요

### ❌ 하지 말아야 할 것
- 실제 API 키나 비밀번호를 `.env.example`에 포함하지 마세요
- 환경 변수 파일을 공개 저장소에 커밋하지 마세요
- 하드코딩된 민감한 정보를 코드에 포함하지 마세요

## 🛠️ 개발 환경 설정

### 프론트엔드 (Vite + React)

프론트엔드는 프로젝트 루트의 `.env.local` 파일을 자동으로 읽습니다.

```typescript
// vite.config.ts에서 설정됨
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
    envDir: path.resolve(__dirname, '..'), // 루트의 환경 변수 파일 사용
    // ...
  }
})
```

### 백엔드 (Ktor)

백엔드에서 환경 변수 사용 시:

```kotlin
// Application.kt에서 환경 변수 읽기
val dbPath = System.getenv("DATABASE_URL") ?: "vinventory.db"
val port = System.getenv("BACKEND_PORT")?.toIntOrNull() ?: 8590
```

## 🌍 환경별 설정

### 개발 환경
```bash
NODE_ENV=development
VITE_SUPABASE_URL=https://dev-project.supabase.co
```

### 프로덕션 환경
```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://prod-project.supabase.co
```

## 📋 체크리스트

### 초기 설정
- [ ] `.env.example` 파일 생성
- [ ] `.env.local` 파일 생성 (`.env.example` 복사)
- [ ] `.gitignore`에 환경 변수 파일들 추가
- [ ] 실제 값으로 `.env.local` 업데이트

### 팀 개발
- [ ] `.env.example` 파일을 Git에 커밋
- [ ] 팀원들에게 `.env.local` 생성 방법 안내
- [ ] 필요한 환경 변수 목록 문서화

### 배포
- [ ] 서버에서 환경 변수 설정
- [ ] CI/CD에서 환경 변수 주입
- [ ] 프로덕션 환경 변수 검증

## 🔧 문제 해결

### 환경 변수가 로드되지 않는 경우

1. **파일 위치 확인**
   ```bash
   # 프로젝트 루트에 .env.local 파일이 있는지 확인
   ls -la .env*
   ```

2. **Vite 설정 확인**
   ```typescript
   // vite.config.ts에서 envDir 설정 확인
   envDir: path.resolve(__dirname, '..')
   ```

3. **환경 변수 이름 확인**
   ```bash
   # Vite에서는 VITE_ 접두사가 필요
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

### 프론트엔드에서 환경 변수 사용

```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 📚 참고 자료

- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase 환경 변수 설정](https://supabase.com/docs/guides/getting-started/local-development#env-setup)
- [Git 환경 변수 보안 가이드](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)

## 🆘 도움이 필요한 경우

환경 변수 설정에 문제가 있거나 추가 도움이 필요한 경우:

1. 프로젝트 루트의 `.env.example` 파일을 참고하세요
2. 팀원들에게 문의하세요
3. 프로젝트 문서를 확인하세요

---

**⚠️ 중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요. 민감한 정보가 포함되어 있습니다.
