/**
 * 메인 App 컴포넌트
 * 
 * React Query와 React Router를 설정하고 전체 애플리케이션을 구성합니다.
 * Material-UI ThemeProvider와 AppBar를 사용하여 Material Design을 적용합니다.
 * 반응형 디자인을 지원하며 모바일 친화적인 UI를 제공합니다.
 */

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon } from '@mui/icons-material';
import WineList from './components/WineList';
import WineForm from './components/WineForm';
import WineDetail from './components/WineDetail';
import { wineTheme } from './theme/wineTheme';
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
 * Material-UI AppBar를 사용한 네비게이션 컴포넌트
 * 반응형 디자인을 지원하며 모바일에서는 햄버거 메뉴를 제공합니다.
 */
function Navigation() {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuAnchor(null);
  }, [location]);

  // 모바일 메뉴 열기
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  // 모바일 메뉴 닫기
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        {/* 앱 제목 */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🍷 와인 재고 관리
        </Typography>

        {/* 데스크톱 메뉴 */}
        {!isMobile && (
          <>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ 
                mx: 1,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              목록
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/add"
              startIcon={<AddIcon />}
              sx={{ 
                mx: 1,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              와인 등록
            </Button>
          </>
        )}

        {/* 모바일 메뉴 버튼 */}
        {isMobile && (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="메뉴 열기"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* 모바일 메뉴 */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem 
          component={Link} 
          to="/" 
          onClick={handleMobileMenuClose}
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          목록
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/add" 
          onClick={handleMobileMenuClose}
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          와인 등록
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

/**
 * 메인 App 컴포넌트
 * 
 * Material-UI ThemeProvider와 CssBaseline을 사용하여 전체 애플리케이션을 구성합니다.
 * 
 * @returns JSX 요소
 */
function App() {
  return (
    <ThemeProvider theme={wineTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="app">
              <Navigation />

              <main className="app-main">
                <Routes>
                  <Route path="/" element={<WineList />} />
                  <Route path="/add" element={<WineForm />} />
                  <Route path="/wine/:id" element={<WineDetail />} />
                  <Route path="/wine/:id/edit" element={<WineForm />} />
                </Routes>
              </main>

              <footer className="app-footer">
                <p>&copy; 2024 와인 재고 관리 시스템. Material-UI와 Ktor로 구축되었습니다.</p>
              </footer>
            </div>
          </Router>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
