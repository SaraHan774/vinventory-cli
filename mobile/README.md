# Vinventory Mobile App 📱

React Native로 개발된 와인 재고 관리 모바일 앱입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 20.19.4 이상
- npm 또는 yarn
- Expo CLI
- iOS Simulator (iOS 개발용)
- Android Studio (Android 개발용)

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   # 웹에서 실행
   npm run web
   
   # iOS 시뮬레이터에서 실행
   npm run ios
   
   # Android 에뮬레이터에서 실행
   npm run android
   ```

3. **Expo Go 앱으로 실행**
   ```bash
   npx expo start
   ```

## 📱 주요 기능

### 🍷 와인 관리
- 와인 목록 조회
- 와인 상세 정보 보기
- 와인 등록/수정/삭제
- 와인 검색 및 필터링
- 저재고 알림

### 📝 와인 노트
- Google Keep 스타일 노트 작성
- 노트 색상 변경
- 노트 고정/고정 해제
- 노트 편집/삭제

### 🔧 설정
- 앱 설정 관리
- 알림 설정
- 데이터 동기화

## 🏗️ 프로젝트 구조

```
mobile/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── screens/            # 화면 컴포넌트
│   ├── navigation/         # 네비게이션 설정
│   ├── hooks/             # React Query 훅
│   ├── services/          # API 서비스
│   └── types/             # TypeScript 타입 정의
├── shared/                # 공통 타입 및 유틸리티
└── App.tsx               # 메인 앱 컴포넌트
```

## 🛠️ 기술 스택

- **React Native** - 모바일 앱 프레임워크
- **Expo** - 개발 도구 및 배포 플랫폼
- **TypeScript** - 타입 안전성
- **React Navigation** - 네비게이션
- **React Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **React Native Elements** - UI 컴포넌트

## 🔗 백엔드 연결

모바일 앱은 기존 백엔드 API를 사용합니다:
- **Base URL**: `http://localhost:8590/api/v1`
- **와인 API**: `/wines`
- **와인 노트 API**: `/wines/:wineId/notes`

## 📦 빌드 및 배포

### 개발 빌드
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

### 프로덕션 빌드
```bash
# EAS Build 사용
npx eas build --platform all
```

## 🐛 문제 해결

### 일반적인 문제들

1. **Metro bundler 오류**
   ```bash
   npx expo start --clear
   ```

2. **의존성 충돌**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **iOS 시뮬레이터 연결 문제**
   ```bash
   npx expo run:ios
   ```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
