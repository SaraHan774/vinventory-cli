/**
 * 와인 목록 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 목록을 표시하고 검색/필터링 기능을 제공합니다.
 * Grid 시스템, Card, TextField, Chip 등을 활용한 현대적인 UI를 제공합니다.
 */

import { useState } from 'react';
import { useWines, useSearchWines, useDeleteWine } from '../hooks/useWines';
import type { Wine } from '../types/wine';
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../contexts/SnackbarContext';

interface WineListProps {
  onWineSelect?: (wine: Wine) => void;
}

/**
 * 와인 목록 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 현대적이고 반응형인 와인 목록을 제공합니다.
 * 
 * @param props 컴포넌트 props
 * @returns JSX 요소
 */
export function WineList({ onWineSelect }: WineListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useSnackbar();

  // 와인 목록 조회
  const { data: wines, isLoading, error } = useWines();
  
  // 와인 검색
  const { data: searchResults } = useSearchWines(searchQuery);
  
  // 와인 삭제
  const deleteWineMutation = useDeleteWine();

  // 검색 결과가 있으면 검색 결과를, 없으면 전체 목록을 표시
  const displayWines = searchQuery ? searchResults : wines;

  /**
   * 와인 삭제 핸들러
   * 
   * @param id 삭제할 와인 ID
   */
  const handleDeleteWine = async (id: string) => {
    if (window.confirm('정말로 이 와인을 삭제하시겠습니까?')) {
      try {
        await deleteWineMutation.mutateAsync(id);
        showSuccess('와인이 성공적으로 삭제되었습니다.');
      } catch (error) {
        showError('와인 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 와인 선택 핸들러
   * 
   * @param wine 선택된 와인
   */
  const handleWineSelect = (wine: Wine) => {
    onWineSelect?.(wine);
    navigate(`/wine/${wine.id}`);
  };

  /**
   * 와인 추가 핸들러
   */
  const handleAddWine = () => {
    navigate('/add');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            와인 목록을 불러오는 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          와인 목록을 불러오는 중 오류가 발생했습니다.
        </Alert>
      </Container>
    );
  }

  // 필터링된 와인 목록
  const filteredWines = displayWines?.filter(wine => 
    !showLowStock || wine.quantity <= 5
  ) || [];

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 800 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 3, md: 4 },
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* 헤더 섹션 - 간단하고 깔끔하게 */}
      <Box sx={{ 
        mb: 4,
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          mb: 1
        }}>
          🍷 와인 컬렉션
        </Typography>
        
        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
          mb: 3
        }}>
          프리미엄 와인을 체계적으로 관리하세요
        </Typography>
        
        {/* 검색 및 필터 컨트롤 - 간단하게 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <TextField
            fullWidth={isMobile}
            variant="outlined"
            placeholder="와인 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ 
              maxWidth: isMobile ? '100%' : 300,
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                size="small"
              />
            }
            label="재고 부족만"
            sx={{ 
              whiteSpace: 'nowrap',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem'
              }
            }}
          />
        </Box>
      </Box>

      {/* 와인 목록 - MUI List 사용 */}
      {filteredWines.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            {searchQuery ? '🔍' : '🍷'}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            {searchQuery ? '검색 결과가 없습니다' : '등록된 와인이 없습니다'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {searchQuery 
              ? '다른 검색어로 시도해보세요' 
              : '첫 번째 와인을 등록해보세요'
            }
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddWine}
              sx={{ 
                px: 3,
                py: 1.5,
                fontWeight: 600
              }}
            >
              와인 등록하기
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden'
        }}>
          <List disablePadding>
            {filteredWines.map((wine, index) => (
              <Box key={wine.id}>
                <ListItem 
                  disablePadding
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemButton 
                    onClick={() => handleWineSelect(wine)}
                    sx={{ 
                      py: 2,
                      px: 3,
                      alignItems: 'flex-start'
                    }}
                  >
                    {/* 와인 아이콘 */}
                    <Box sx={{ 
                      mr: 2, 
                      mt: 0.5,
                      fontSize: '1.5rem'
                    }}>
                      🍷
                    </Box>
                    
                    {/* 와인 정보 */}
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          color: 'text.primary'
                        }}>
                          {wine.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip
                            label={wine.country_code || 'N/A'}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 20 }}
                          />
                          <Chip
                            label={`${wine.vintage}년`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 20 }}
                          />
                          <Typography variant="body2" sx={{ 
                            color: 'primary.main',
                            fontWeight: 600,
                            ml: 1
                          }}>
                            ${wine.price.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    {/* 재고 수량 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      mr: 1
                    }}>
                      <Chip
                        label={`${wine.quantity}병`}
                        size="small"
                        color={wine.quantity <= 5 ? 'error' : 'success'}
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                    </Box>
                  </ListItemButton>
                  
                  {/* 액션 버튼들 */}
                  <ListItemSecondaryAction sx={{ 
                    display: 'flex',
                    gap: 0.5,
                    mr: 1
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteWine(wine.id)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredWines.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      )}

    </Box>
  );
}

export default WineList;
