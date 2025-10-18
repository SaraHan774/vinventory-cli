# Supabase MCP 설정 가이드

이 프로젝트에서 Supabase MCP(Model Context Protocol)를 사용하기 위한 설정 방법입니다.

## 1. 환경 변수 설정

다음 환경 변수들을 설정해야 합니다:

### SUPABASE_ACCESS_TOKEN
- Supabase 대시보드에 로그인
- 우측 상단 사용자 아이콘 클릭 → "Account preferences" 선택
- "Access Tokens" 섹션에서 "Generate new token" 클릭
- 생성된 토큰을 복사

### SUPABASE_PROJECT_REF
- Supabase 프로젝트 대시보드로 이동
- Settings → General에서 Project Reference ID 확인

## 2. 환경 변수 적용 방법

### macOS/Linux:
```bash
export SUPABASE_ACCESS_TOKEN="your_access_token_here"
export SUPABASE_PROJECT_REF="your_project_ref_here"
```

### Windows:
```cmd
set SUPABASE_ACCESS_TOKEN=your_access_token_here
set SUPABASE_PROJECT_REF=your_project_ref_here
```

## 3. MCP 설정 확인

`mcp.json` 파일이 프로젝트 루트에 생성되어 있으며, 다음과 같은 설정을 포함합니다:

- **읽기 전용 모드**: 데이터베이스의 안전성을 위해 읽기 전용으로 설정
- **프로젝트 특정 연결**: 특정 Supabase 프로젝트에만 연결
- **환경 변수 사용**: 보안을 위해 토큰을 환경 변수로 관리

## 4. 사용 방법

환경 변수를 설정한 후, Cursor나 다른 MCP 클라이언트에서 자연어로 Supabase 데이터베이스 작업을 수행할 수 있습니다.

예시:
- "와인 테이블의 모든 데이터를 보여줘"
- "재고가 부족한 와인 목록을 조회해줘"
- "새로운 와인 데이터를 추가해줘"

## 5. 보안 주의사항

- Personal Access Token은 절대 코드에 직접 포함하지 마세요
- 환경 변수를 사용하여 토큰을 안전하게 관리하세요
- 필요에 따라 읽기 전용 모드를 해제할 수 있지만, 프로덕션 환경에서는 주의하세요
