/**
 * 와인 상세 정보 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 상세 정보를 표시합니다.
 * 표준적인 웹사이트 레이아웃으로 중앙 정렬되어 있습니다.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useWine, useUpdateWine } from '../hooks/useWines';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  OpenInNew as OpenInNewIcon,
  WineBar as WineBarIcon
} from '@mui/icons-material';
import { useSnackbar } from '../contexts/SnackbarContext';
import WineNotesSection from './WineNotesSection';

/**
 * 와인 상세 컴포넌트
 * 
 * @returns JSX 요소
 */
export default function WineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  
  // React Query 훅 사용
  const { data: wine, isLoading: loading, error } = useWine(id!);
  const updateWineMutation = useUpdateWine();


  // 수량 변경 핸들러
  const handleQuantityChange = async (delta: number) => {
    if (!wine) return;
    
    const newQuantity = Math.max(0, (wine.quantity || 0) + delta);
    
    try {
      // 실제 API 호출
      await updateWineMutation.mutateAsync({
        id: wine.id,
        wineData: { quantity: newQuantity }
      });
      
      showSuccess(`재고가 ${delta > 0 ? '증가' : '감소'}되었습니다.`);
    } catch (error) {
      showError('재고 변경 중 오류가 발생했습니다.');
    }
  };

  // 와인 삭제 핸들러
  const handleDelete = async () => {
    if (!wine) return;
    
    if (window.confirm('정말로 이 와인을 삭제하시겠습니까?')) {
      try {
        // TODO: 실제 API 호출 구현
        await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
        
        showSuccess('와인이 삭제되었습니다.');
        navigate('/');
      } catch (error) {
        showError('와인 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/');
  };

  // 수정 핸들러
  const handleEdit = () => {
    navigate(`/wine/${id}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            와인 정보를 불러오는 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !wine) {
    return (
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: 800 }, 
        mx: 'auto', 
        p: { xs: 1, sm: 3, md: 4 },
        minHeight: '100vh',
        width: '100%'
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || '와인을 찾을 수 없습니다.'}
        </Alert>
        <Button variant="contained" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 800 }, 
      mx: 'auto', 
      p: { xs: 1, sm: 3, md: 4 },
      minHeight: '100vh',
      width: '100%'
    }}>
      <Paper 
        elevation={1}
        sx={{ 
          p: { xs: 2, sm: 4, md: 5 },
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}
      >
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          {/* 상단: 뒤로가기 버튼과 액션 버튼들 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ color: 'primary.main' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={handleEdit}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
                title="수정"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText'
                  }
                }}
                title="삭제"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* 하단: 와인 이름 (전체 너비 사용) */}
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              textAlign: 'center',
              wordBreak: 'break-word' // 긴 이름도 줄바꿈 허용
            }}
          >
            🍷 {wine.name || '알 수 없는 와인'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 와인 정보 */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              기본 정보
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    와인 이름
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {wine.name || '알 수 없는 와인'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    국가
                  </Typography>
                  <Chip 
                    label={wine.country_code || 'N/A'} 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    연도
                  </Typography>
                  <Chip 
                    label={`${wine.vintage || 'N/A'}년`} 
                    color="secondary" 
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    가격
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    ${wine.price?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 재고 관리 - 독립적인 섹션 */}
        <Box sx={{ 
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          mb: 4
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            재고 관리
          </Typography>
          
          {/* 재고 수량과 버튼들을 가로로 배치 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 4
          }}>
            {/* 감소 버튼 */}
            <IconButton
              onClick={() => handleQuantityChange(-1)}
              disabled={(wine.quantity || 0) <= 0}
              sx={{ 
                color: 'error.main',
                border: 1,
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                },
                '&:disabled': {
                  color: 'action.disabled',
                  borderColor: 'action.disabled'
                }
              }}
              title="재고 감소"
            >
              <RemoveIcon />
            </IconButton>

            {/* 재고 수량 (중앙) */}
            <Box sx={{ textAlign: 'center', minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                현재 재고
              </Typography>
              <Typography 
                variant="h2" 
                color={(wine.quantity || 0) <= 5 ? 'error.main' : 'success.main'}
                sx={{ fontWeight: 700, mb: 1 }}
              >
                {wine.quantity || 0}개
              </Typography>
              {(wine.quantity || 0) <= 5 && (
                <Chip 
                  label="재고 부족" 
                  color="error" 
                  variant="filled"
                  size="small"
                />
              )}
            </Box>

            {/* 증가 버튼 */}
            <IconButton
              onClick={() => handleQuantityChange(1)}
              sx={{ 
                color: 'success.main',
                border: 1,
                borderColor: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.light',
                  color: 'success.contrastText'
                }
              }}
              title="재고 증가"
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 외부 정보 링크 섹션 */}
        {(wine.vivino_url || wine.wine_searcher_url) && (
          <Box sx={{ 
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            mb: 4
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              외부 정보
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}>
              {/* Vivino 링크 */}
              {wine.vivino_url && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<WineBarIcon />}
                  endIcon={<OpenInNewIcon />}
                  href={wine.vivino_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    minWidth: 180,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Vivino에서 보기
                </Button>
              )}

              {/* Wine-Searcher 링크 */}
              {wine.wine_searcher_url && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<WineBarIcon />}
                  endIcon={<OpenInNewIcon />}
                  href={wine.wine_searcher_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    minWidth: 180,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Wine-Searcher에서 보기
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* 와인 노트 섹션 */}
        <Box sx={{ mt: 4 }}>
          <WineNotesSection wineId={wine.id} />
        </Box>
      </Paper>
    </Box>
  );
}