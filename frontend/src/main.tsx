/**
 * React 애플리케이션 진입점
 * 
 * PWA 기능을 포함한 반응형 웹 애플리케이션입니다.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App.tsx'
import wineTheme from './theme/wineTheme.ts'
import './index.css'

// PWA 서비스 워커 등록 (개발 환경에서 임시 비활성화)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW 등록 성공:', registration.scope);
      })
      .catch((registrationError) => {
        console.log('SW 등록 실패:', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={wineTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
