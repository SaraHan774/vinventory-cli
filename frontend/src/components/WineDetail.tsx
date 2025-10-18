/**
 * 와인 상세 정보 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 상세 정보를 표시합니다.
 * 표준적인 웹사이트 레이아웃으로 중앙 정렬되어 있습니다.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CardContent,
  CardActions
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { useSnackbar } from '../contexts/SnackbarContext';
import type { Wine } from '../types/wine';

/**
 * 와인 상세 컴포넌트
 * 
 * @returns JSX 요소
 */
export default function WineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 와인 데이터 로드 (임시 데이터)
  useEffect(() => {
    const loadWine = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 호출 구현
        await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
        
        // 임시 와인 데이터
        const mockWine: Wine = {
          id: id || '1',
          name: 'Château Margaux 2015',
          country_code: 'FR',
          vintage: 2015,
          price: 899.99,
          quantity: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setWine(mockWine);
      } catch (err) {
        setError('와인 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadWine();
    }
  }, [id]);

  // 수량 변경 핸들러
  const handleQuantityChange = async (delta: number) => {
    if (!wine) return;
    
    const newQuantity = Math.max(0, wine.quantity + delta);
    
    try {
      // TODO: 실제 API 호출 구현
      await new Promise(resolve => setTimeout(resolve, 500)); // 임시 지연
      
      setWine(prev => prev ? { ...prev, quantity: newQuantity } : null);
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
        maxWidth: 800, 
        mx: 'auto', 
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        width: '100%'
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || '와인을 찾을 수 없습니다.'}
        </Alert>
        <Button variant="contained" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      width: '100%'
    }}>
      <Paper 
        elevation={1}
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🍷 {wine.name}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            삭제
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 와인 정보 */}
        <Grid container spacing={4}>
          {/* 기본 정보 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  기본 정보
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    와인 이름
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {wine.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    국가
                  </Typography>
                  <Chip 
                    label={wine.country_code} 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    연도
                  </Typography>
                  <Chip 
                    label={`${wine.vintage}년`} 
                    color="secondary" 
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    가격
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    ${wine.price.toFixed(2)}
                  </Typography>
                </Box>

                <Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 재고 관리 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  재고 관리
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    현재 재고
                  </Typography>
                  <Typography 
                    variant="h2" 
                    color={wine.quantity <= 5 ? 'error.main' : 'success.main'}
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    {wine.quantity}개
                  </Typography>
                  
                  {wine.quantity <= 5 && (
                    <Chip 
                      label="재고 부족" 
                      color="error" 
                      variant="filled"
                      sx={{ mb: 2 }}
                    />
                  )}
                </Box>

                <CardActions sx={{ justifyContent: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RemoveIcon />}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={wine.quantity <= 0}
                    color="error"
                  >
                    감소
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleQuantityChange(1)}
                    color="success"
                  >
                    증가
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}