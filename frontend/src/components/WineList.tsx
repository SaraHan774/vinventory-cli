/**
 * 와인 목록 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 목록을 표시하고 검색/필터링 기능을 제공합니다.
 * Grid 시스템, Card, TextField, Chip, Fab 등을 활용한 현대적인 UI를 제공합니다.
 */

import { useState } from 'react';
import { useWines, useSearchWines, useDeleteWine } from '../hooks/useWines';
import type { Wine } from '../types/wine';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  Fab,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          🍷 와인 목록
        </Typography>
        
        {/* 검색 및 필터 컨트롤 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 3
        }}>
          <TextField
            fullWidth={isMobile}
            variant="outlined"
            placeholder="와인 이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ 
              maxWidth: isMobile ? '100%' : 400,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                color="primary"
              />
            }
            label="재고 부족만 표시"
            sx={{ 
              whiteSpace: 'nowrap',
              '& .MuiFormControlLabel-label': {
                fontWeight: 500
              }
            }}
          />
        </Box>
      </Box>

      {/* 와인 목록 Grid */}
      <Grid container spacing={3}>
        {filteredWines.map((wine) => (
          <Grid item xs={12} sm={6} md={4} key={wine.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* 와인 이름과 재고 상태 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    flex: 1,
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}>
                    {wine.name}
                  </Typography>
                  <Chip
                    label={`재고: ${wine.quantity}개`}
                    color={wine.quantity <= 5 ? 'error' : 'success'}
                    size="small"
                    sx={{ 
                      ml: 1,
                      fontWeight: 600,
                      ...(wine.quantity <= 5 && {
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                          '100%': { transform: 'scale(1)' },
                        }
                      })
                    }}
                  />
                </Box>
                
                {/* 와인 정보 태그들 */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={wine.countryCode}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                  />
                  <Chip
                    label={`${wine.vintage}년`}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label={`$${wine.price.toFixed(2)}`}
                    variant="outlined"
                    color="info"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  startIcon={<ViewIcon />}
                  onClick={() => handleWineSelect(wine)}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  상세보기
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteWine(wine.id)}
                  disabled={deleteWineMutation.isPending}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {deleteWineMutation.isPending ? '삭제 중...' : '삭제'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 빈 상태 메시지 */}
      {filteredWines.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {searchQuery ? '검색 결과가 없습니다.' : '등록된 와인이 없습니다.'}
          </Typography>
        </Box>
      )}

      {/* Floating Action Button - 와인 추가 */}
      <Fab
        color="primary"
        aria-label="와인 추가"
        onClick={handleAddWine}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default WineList;
