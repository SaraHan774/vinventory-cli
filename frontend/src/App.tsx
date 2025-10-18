/**
 * 메인 App 컴포넌트
 * 
 * React Query와 React Router를 설정하고 전체 애플리케이션을 구성합니다.
 * Material-UI ThemeProvider와 AppBar를 사용하여 Material Design을 적용합니다.
 * 반응형 디자인을 지원하며 모바일 친화적인 UI를 제공합니다.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';
import WineList from './components/WineList';
import WineForm from './components/WineForm';
import WineDetail from './components/WineDetail';
import { SnackbarProvider } from './contexts/SnackbarContext';
import './App.css';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1, // 실패 시 1번만 재시도
    },
  },
});

/**
 * 간단한 상단 네비게이션 컴포넌트
 * 깔끔하고 간단한 디자인 원칙을 적용
 */
function Navigation() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        maxWidth: 800,
        mx: 'auto',
        width: '100%'
      }}>
        {/* 로고 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🍷 Vinventory
          </Typography>
        </Box>

        {/* 네비게이션 메뉴 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            variant={location.pathname === '/' ? 'contained' : 'text'}
            size="small"
            sx={{ 
              fontWeight: 600,
              display: isMobile ? 'none' : 'flex'
            }}
          >
            홈
          </Button>
          <Button
            component={Link}
            to="/add"
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            sx={{ 
              fontWeight: 600
            }}
          >
            {isMobile ? '' : '와인 등록'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

/**
 * 메인 App 컴포넌트
 * 
 * Material Design 3 스타일의 레이아웃을 적용한 전체 애플리케이션을 구성합니다.
 * 
 * @returns JSX 요소
 */
function App() {
  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 네비게이션 */}
            <Navigation />
            
            {/* 메인 콘텐츠 영역 */}
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<WineList />} />
                <Route path="/add" element={<WineForm />} />
                <Route path="/wine/:id" element={<WineDetail />} />
                <Route path="/wine/:id/edit" element={<WineForm />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </QueryClientProvider>
    </SnackbarProvider>
  );
}

export default App;
