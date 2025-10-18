/**
 * Snackbar 알림 시스템을 위한 React Context
 * 
 * Material-UI Snackbar를 사용하여 전역적으로 알림 메시지를 표시할 수 있도록 합니다.
 * 성공, 에러, 경고, 정보 메시지를 지원합니다.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// Snackbar 메시지 타입 정의
interface SnackbarMessage {
  message: string;
  severity: AlertColor;
  duration?: number;
}

// Snackbar Context 타입 정의
interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

// Context 생성
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Snackbar Provider Props 타입
interface SnackbarProviderProps {
  children: ReactNode;
}

/**
 * Snackbar Provider 컴포넌트
 * 
 * 전역적으로 Snackbar 알림을 관리하는 Provider입니다.
 * 
 * @param props 컴포넌트 props
 * @returns JSX 요소
 */
export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [open, setOpen] = useState(false);

  /**
   * Snackbar 표시 함수
   * 
   * @param message 표시할 메시지
   * @param severity 메시지 심각도 (기본값: 'info')
   * @param duration 표시 시간 (기본값: 6000ms)
   */
  const showSnackbar = (message: string, severity: AlertColor = 'info', duration: number = 6000) => {
    setSnackbar({ message, severity, duration });
    setOpen(true);
  };

  /**
   * 성공 메시지 표시
   * 
   * @param message 성공 메시지
   * @param duration 표시 시간
   */
  const showSuccess = (message: string, duration?: number) => {
    showSnackbar(message, 'success', duration);
  };

  /**
   * 에러 메시지 표시
   * 
   * @param message 에러 메시지
   * @param duration 표시 시간
   */
  const showError = (message: string, duration?: number) => {
    showSnackbar(message, 'error', duration);
  };

  /**
   * 경고 메시지 표시
   * 
   * @param message 경고 메시지
   * @param duration 표시 시간
   */
  const showWarning = (message: string, duration?: number) => {
    showSnackbar(message, 'warning', duration);
  };

  /**
   * 정보 메시지 표시
   * 
   * @param message 정보 메시지
   * @param duration 표시 시간
   */
  const showInfo = (message: string, duration?: number) => {
    showSnackbar(message, 'info', duration);
  };

  /**
   * Snackbar 닫기 핸들러
   */
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const contextValue: SnackbarContextType = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      
      {/* Snackbar 컴포넌트 */}
      {snackbar && (
        <Snackbar
          open={open}
          autoHideDuration={snackbar.duration || 6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
            }
          }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 2,
              fontWeight: 500,
              '& .MuiAlert-message': {
                fontSize: '0.95rem',
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

/**
 * Snackbar Context Hook
 * 
 * Snackbar Context를 사용하기 위한 커스텀 훅입니다.
 * 
 * @returns SnackbarContextType
 * @throws Error Context가 Provider 내부에서 사용되지 않은 경우
 */
export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default SnackbarContext;
