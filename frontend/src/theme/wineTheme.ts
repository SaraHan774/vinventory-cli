/**
 * 와인 재고 관리 시스템을 위한 Material-UI 테마 설정
 * 
 * 와인 관련 색상 팔레트와 Material Design 가이드라인을 따르는 테마를 정의합니다.
 * 레드 와인, 화이트 와인, 로제 와인의 색상을 기반으로 한 색상 시스템을 제공합니다.
 */

import { createTheme } from '@mui/material/styles';

// 와인 테마 색상 팔레트 정의
const wineColors = {
  // 레드 와인 색상 (Primary)
  redWine: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#f9d1e7',
    300: '#f5a8d1',
    400: '#f073b7',
    500: '#e91e63', // 메인 레드 와인 색상
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },
  
  // 화이트 와인 색상 (Secondary)
  whiteWine: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107', // 메인 화이트 와인 색상
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  
  // 로제 와인 색상 (Accent)
  roseWine: {
    50: '#fce4ec',
    100: '#f8bbd9',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63', // 메인 로제 와인 색상
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },
  
  // 중성 색상 (그레이 톤)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

/**
 * 와인 테마 생성
 * Material Design 가이드라인을 따르면서 와인 관련 색상을 적용합니다.
 */
export const wineTheme = createTheme({
  palette: {
    mode: 'light', // 기본적으로 라이트 모드 사용
    primary: {
      main: wineColors.redWine[500],
      light: wineColors.redWine[300],
      dark: wineColors.redWine[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: wineColors.whiteWine[500],
      light: wineColors.whiteWine[300],
      dark: wineColors.whiteWine[700],
      contrastText: '#000000',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: wineColors.neutral[900],
      secondary: wineColors.neutral[600],
    },
  },
  
  // 타이포그래피 설정
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none', // 버튼 텍스트 대문자 변환 비활성화
    },
  },
  
  // 컴포넌트별 커스터마이징
  components: {
    // AppBar 컴포넌트 스타일링
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${wineColors.redWine[500]} 0%, ${wineColors.redWine[700]} 100%)`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    
    // Card 컴포넌트 스타일링
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    
    // Button 컴포넌트 스타일링
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 16px',
          minHeight: 44, // 터치 친화적인 최소 크기
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    
    // TextField 컴포넌트 스타일링
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: wineColors.redWine[300],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: wineColors.redWine[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    // Chip 컴포넌트 스타일링
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    
    // Fab 컴포넌트 스타일링
    MuiFab: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${wineColors.redWine[500]} 0%, ${wineColors.redWine[600]} 100%)`,
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
          '&:hover': {
            background: `linear-gradient(135deg, ${wineColors.redWine[600]} 0%, ${wineColors.redWine[700]} 100%)`,
            boxShadow: '0 6px 16px rgba(233, 30, 99, 0.5)',
          },
        },
      },
    },
  },
  
  // 반응형 브레이크포인트 설정
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
  // 간격(spacing) 설정
  spacing: 8, // 8px 단위로 간격 설정
});

/**
 * 다크 모드 와인 테마
 * 다크 모드에서도 와인 색상을 유지하면서 배경색만 어둡게 설정합니다.
 */
export const darkWineTheme = createTheme({
  ...wineTheme,
  palette: {
    ...wineTheme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});

export default wineTheme;
