/**
 * 메인 App 컴포넌트
 * 
 * React Query와 React Router를 설정하고 전체 애플리케이션을 구성합니다.
 * Material-UI ThemeProvider와 AppBar를 사용하여 Material Design을 적용합니다.
 * 반응형 디자인을 지원하며 모바일 친화적인 UI를 제공합니다.
 */

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import { Add as AddIcon, Home as HomeIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import WineList from './components/WineList';
import WineForm from './components/WineForm.js';
import WineDetail from './components/WineDetail.js';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        borderRadius: 0 // 모서리 rounding 제거
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        maxWidth: { xs: '100%', sm: 800 },
        mx: 'auto',
        width: '100%',
        px: { xs: 1, sm: 2 },
        borderRadius: 0 // 모서리 rounding 제거
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
        {isMobile ? (
          // 모바일: 더보기 버튼과 드롭다운 메뉴
          <>
            <IconButton
              onClick={handleMenuClick}
              sx={{ color: 'primary.main' }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem 
                component={Link} 
                to="/" 
                onClick={handleMenuClose}
                sx={{ 
                  color: location.pathname === '/' ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === '/' ? 600 : 400
                }}
              >
                <HomeIcon sx={{ mr: 1 }} />
                홈
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/add" 
                onClick={handleMenuClose}
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                등록
              </MenuItem>
            </Menu>
          </>
        ) : (
          // 데스크탑: 일반 버튼들
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              variant={location.pathname === '/' ? 'contained' : 'text'}
              size="small"
              sx={{ 
                fontWeight: 600,
                minWidth: 'auto',
                px: 2
              }}
            >
              홈
            </Button>
            <Button
              component={Link}
              to="/add"
              startIcon={<AddIcon />}
              variant="text"
              size="small"
              sx={{ 
                fontWeight: 600,
                minWidth: 'auto',
                px: 2
              }}
            >
              등록
            </Button>
          </Box>
        )}
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
