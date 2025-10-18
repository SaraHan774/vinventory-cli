/**
 * 와인 재고 관리 시스템을 위한 Material-UI 테마 설정
 * 
 * 와인 관련 색상 팔레트와 Material Design 가이드라인을 따르는 테마를 정의합니다.
 * 레드 와인, 화이트 와인, 로제 와인의 색상을 기반으로 한 색상 시스템을 제공합니다.
 */

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

/**
 * Material Design 3 색상 역할 시스템
 * M3의 역할 기반 색상 체계를 MUI 팔레트 토큰에 매핑합니다.
 * 
 * M3 색상 역할 → MUI 팔레트 매핑:
 * - Primary → palette.primary.main
 * - On Primary → palette.primary.contrastText
 * - Secondary → palette.secondary.main
 * - On Secondary → palette.secondary.contrastText
 * - Surface → palette.background.default/paper
 * - On Surface → palette.text.primary
 * - Outline → palette.divider
 * - Error → palette.error.main
 * - On Error → palette.error.contrastText
 */

// Material Design 3 Expressive 색상 토큰 (와인 테마)
// M3 Expressive는 더 생동감 있고 표현력 있는 색상 시스템을 제공합니다.
const m3ExpressiveColors = {
  // Primary 색상 (와인 보라색 계열) - 더 생동감 있는 색상
  primary: {
    main: '#6750A4',      // M3 Primary
    light: '#EADDFF',     // M3 Primary Container
    dark: '#4F378B',      // M3 Primary (다크)
    contrastText: '#FFFFFF', // M3 On Primary
    // Expressive 추가 색상
    vibrant: '#8B5CF6',   // 더 생동감 있는 보라색
    accent: '#A78BFA',     // 강조 색상
    soft: '#C4B5FD'         // 부드러운 보라색
  },
  
  // Secondary 색상 (중성 회색 계열) - 따뜻한 톤
  secondary: {
    main: '#625B71',      // M3 Secondary
    light: '#E8DEF8',     // M3 Secondary Container
    dark: '#463E4F',      // M3 Secondary (다크)
    contrastText: '#FFFFFF', // M3 On Secondary
    // Expressive 추가 색상
    warm: '#7C6B7A',      // 따뜻한 회색
    cool: '#5A5A6B',       // 차가운 회색
    muted: '#9CA3AF'       // 음소거된 회색
  },
  
  // Tertiary 색상 (와인 골드 계열) - 생동감 있는 색상
  tertiary: {
    main: '#7D5260',      // M3 Tertiary
    light: '#FFD8E4',     // M3 Tertiary Container
    dark: '#633B48',      // M3 Tertiary (다크)
    contrastText: '#FFFFFF', // M3 On Tertiary
    // Expressive 추가 색상
    vibrant: '#EC4899',   // 생동감 있는 핑크
    soft: '#F472B6',       // 부드러운 핑크
    gold: '#F59E0B'        // 골드 색상
  },
  
  // Error 색상 - 더 강렬한 색상
  error: {
    main: '#B3261E',      // M3 Error
    light: '#F9DEDC',     // M3 Error Container
    dark: '#93000A',      // M3 Error (다크)
    contrastText: '#FFFFFF', // M3 On Error
    // Expressive 추가 색상
    vibrant: '#EF4444',   // 더 강렬한 빨간색
    soft: '#F87171'        // 부드러운 빨간색
  },
  
  // Surface 색상 - 더 깊이 있는 표면
  surface: {
    default: '#FFFBFE',   // M3 Surface
    paper: '#FFFFFF',     // M3 Surface Container
    variant: '#F3EDF7',   // M3 Surface Variant
    // Expressive 추가 표면
    elevated: '#F8F9FA',   // 높은 표면
    glass: 'rgba(255, 255, 255, 0.8)', // 글래스 효과
    overlay: 'rgba(0, 0, 0, 0.1)' // 오버레이
  },
  
  // Text 색상 - 더 명확한 텍스트 계층
  text: {
    primary: '#1C1B1F',   // M3 On Surface
    secondary: '#49454F', // M3 On Surface Variant
    disabled: '#79747E',  // M3 Outline
    // Expressive 추가 텍스트
    accent: '#6750A4',     // 강조 텍스트
    muted: '#9CA3AF',      // 음소거된 텍스트
    inverse: '#FFFFFF'     // 역전 텍스트
  },
  
  // Outline 색상 - 더 명확한 경계
  outline: '#79747E',     // M3 Outline
  outlineVariant: '#CAC4D0', // M3 Outline Variant
  // Expressive 추가 경계
  outlineAccent: '#A78BFA', // 강조 경계
  outlineSoft: '#E5E7EB'    // 부드러운 경계
};

/**
 * Material Design 3 기반 와인 테마 생성
 * 역할 기반 색상 시스템과 일관된 토큰 사용을 강제합니다.
 */
let wineTheme = createTheme({
  palette: {
    mode: 'light',
    
    // M3 Expressive Primary 역할 → MUI Primary 토큰
    primary: m3ExpressiveColors.primary,
    
    // M3 Expressive Secondary 역할 → MUI Secondary 토큰
    secondary: m3ExpressiveColors.secondary,
    
    // M3 Expressive Error 역할 → MUI Error 토큰
    error: m3ExpressiveColors.error,
    
    // M3 Expressive Surface 역할 → MUI Background 토큰
    background: {
      default: m3ExpressiveColors.surface.elevated, // 더 깊이 있는 배경
      paper: m3ExpressiveColors.surface.paper,
    },
    
    // M3 Expressive On Surface 역할 → MUI Text 토큰
    text: {
      primary: m3ExpressiveColors.text.primary,
      secondary: m3ExpressiveColors.text.secondary,
      disabled: m3ExpressiveColors.text.disabled,
    },
    
    // M3 Expressive Outline 역할 → MUI Divider 토큰
    divider: m3ExpressiveColors.outline,
    
    // 추가 색상 (M3 호환)
    warning: {
      main: '#F57C00',    // M3 Warning
      light: '#FFF3E0',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#1976D2',    // M3 Info
      light: '#E3F2FD',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',    // M3 Success
      light: '#E8F5E8',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
  },
  
  // 타이포그래피 설정 (Material Design 3 스타일)
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    
    // M3 타이포그래피 스케일 (rem 기반) - 계층 구조 개선
    h1: {
      fontSize: '3.5rem',    // 56px
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',   // 36px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',   // 28px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',    // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',   // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',  // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',      // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',   // 12px
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',   // 12px
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      lineHeight: 1.4,
    },
  },
  
  // 모양(Shape) 설정 - M3 둥근 모서리 시스템
  shape: {
    borderRadius: 12, // M3 기본 둥근 모서리 (12px)
  },
  
  // 간격(Spacing) 설정 - 8px 스케일 시스템
  spacing: 8,
  
  // 컴포넌트별 커스터마이징 (M3 토큰 기반)
  components: {
    // AppBar 컴포넌트 (M3 Surface 역할)
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }),
      },
    },
    
    // M3 Expressive Card 컴포넌트 - 더 생동감 있는 카드
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius * 2, // 더 둥근 모서리
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 부드러운 전환
          '&:hover': {
            transform: 'translateY(-4px)', // 더 큰 이동
            boxShadow: '0 8px 24px rgba(103, 80, 164, 0.15)', // 색상이 있는 그림자
            borderColor: theme.palette.primary.light,
          },
        }),
      },
    },
    
    // M3 Expressive Button 컴포넌트 - 더 생동감 있고 표현력 있는 버튼
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius * 2.5, // 더 둥근 모서리
          textTransform: 'none',
          fontWeight: 600, // 더 굵은 폰트
          padding: theme.spacing(1.5, 3),
          minHeight: 44, // 더 큰 버튼
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 부드러운 전환
          '&:hover': {
            transform: 'translateY(-2px)', // 더 큰 이동
            boxShadow: '0 4px 16px rgba(103, 80, 164, 0.3)', // 색상이 있는 그림자
          },
          '&:active': {
            transform: 'translateY(0px)', // 클릭 시 원래 위치
          },
        }),
        contained: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: 'none',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            boxShadow: '0 6px 20px rgba(103, 80, 164, 0.4)',
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: `${theme.palette.primary.main}10`, // 10% 투명도
          },
        }),
      },
    },
    
    // TextField 컴포넌트 (M3 Surface 역할)
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          },
        }),
      },
    },
    
    // Chip 컴포넌트 (M3 Surface Variant 역할)
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius * 0.75, // 9px
          fontWeight: 500,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
        }),
        filled: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    
    // Fab 컴포넌트 (M3 Primary 역할)
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'scale(1.05)',
          },
        }),
      },
    },
    
    // Paper 컴포넌트 (M3 Surface 역할)
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
  },
  
  // 반응형 브레이크포인트 설정 (M3 표준)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// 반응형 타이포그래피 자동화
wineTheme = responsiveFontSizes(wineTheme);

/**
 * 다크 모드 와인 테마 (M3 다크 모드 색상)
 * Material Design 3 다크 모드 가이드라인을 따릅니다.
 */
const darkWineTheme = createTheme({
  ...wineTheme,
  palette: {
    ...wineTheme.palette,
    mode: 'dark',
    
    // M3 다크 모드 색상 매핑
    primary: {
      main: '#D0BCFF',      // M3 다크 Primary
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',      // M3 다크 Secondary
      light: '#E8DEF8',
      dark: '#463E4F',
      contrastText: '#332D41',
    },
    error: {
      main: '#F2B8B5',      // M3 다크 Error
      light: '#F9DEDC',
      dark: '#93000A',
      contrastText: '#601410',
    },
    background: {
      default: '#1C1B1F',   // M3 다크 Surface
      paper: '#2B2930',     // M3 다크 Surface Container
    },
    text: {
      primary: '#E6E1E5',   // M3 다크 On Surface
      secondary: '#CAC4D0', // M3 다크 On Surface Variant
      disabled: '#938F99',  // M3 다크 Outline
    },
    divider: '#938F99',     // M3 다크 Outline
  },
});

// 다크 모드도 반응형 타이포그래피 적용
const responsiveDarkTheme = responsiveFontSizes(darkWineTheme);

export default wineTheme;
export { responsiveDarkTheme as darkWineTheme };
