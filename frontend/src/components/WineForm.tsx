/**
 * 와인 등록/수정 폼 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 등록 및 수정 폼을 제공합니다.
 * 표준적인 웹사이트 레이아웃으로 중앙 정렬되어 있습니다.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useCreateWine, useUpdateWine, useWine } from '../hooks/useWines';

/**
 * 와인 폼 컴포넌트
 * 
 * @returns JSX 요소
 */
export default function WineForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const isEdit = Boolean(id);
  
  // React Query 훅 사용
  const createWineMutation = useCreateWine();
  const updateWineMutation = useUpdateWine();
  const { data: existingWine, isLoading: loadingWine } = useWine(id || '');

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    country_code: '',  // 데이터베이스 컬럼명과 일치
    vintage: new Date().getFullYear(),
    price: 0,
    quantity: 0
    // description과 isActive 필드 제거 (DB에 없음)
  });

  // 기존 데이터를 폼에 로드 (수정 모드일 때만)
  useEffect(() => {
    if (isEdit && existingWine) {
      setFormData({
        name: existingWine.name,
        country_code: existingWine.country_code,
        vintage: existingWine.vintage,
        price: existingWine.price,
        quantity: existingWine.quantity
      });
    }
  }, [isEdit, existingWine]);

  // 로딩 상태는 React Query에서 관리
  const loading = createWineMutation.isPending || updateWineMutation.isPending || loadingWine;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 데이터 변경 핸들러
  const handleChange = (field: string) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '와인 이름을 입력해주세요.';
    }

    if (!formData.country_code.trim()) {
      newErrors.country_code = '국가 코드를 입력해주세요.';
    }

    if (formData.vintage < 1900 || formData.vintage > new Date().getFullYear() + 1) {
      newErrors.vintage = '올바른 연도를 입력해주세요.';
    }

    if (formData.price <= 0) {
      newErrors.price = '가격은 0보다 커야 합니다.';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = '수량은 0 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      showError('입력 정보를 확인해주세요.');
      return;
    }

    try {
      // 실제 API 호출 - 데이터베이스 스키마에 맞게 수정
      const wineData = {
        name: formData.name,
        country_code: formData.country_code,
        vintage: formData.vintage,
        price: formData.price,
        quantity: formData.quantity
      };

      if (isEdit && id) {
        // 수정 로직
        await updateWineMutation.mutateAsync({ id, wineData });
        showSuccess('와인 정보가 수정되었습니다.');
      } else {
        // 등록 로직
        await createWineMutation.mutateAsync(wineData);
        showSuccess('와인이 등록되었습니다.');
      }
      
      navigate('/');
    } catch (error) {
      showError('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate('/');
  };

  // 수정 모드에서 기존 데이터 로딩 중일 때
  if (isEdit && loadingWine) {
    return (
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: 800 }, 
        mx: 'auto', 
        p: { xs: 1, sm: 3, md: 4 },
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
        <Box sx={{ 
          mb: 5,
          textAlign: 'center',
          pt: 2
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1
          }}>
            {isEdit ? '와인 정보 수정' : '새 와인 등록'}
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'text.secondary'
          }}>
            {isEdit ? '와인 정보를 수정하세요.' : '새로운 와인을 컬렉션에 추가하세요.'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 폼 */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* 와인 이름 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="와인 이름"
                value={formData.name}
                onChange={handleChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name || '와인의 정확한 이름을 입력해주세요'}
                required
                variant="outlined"
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>

            {/* 국가 코드와 연도 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="국가 코드"
                value={formData.country_code}
                onChange={handleChange('country_code')}
                error={Boolean(errors.country_code)}
                helperText={errors.country_code || '예: KR, US, FR, IT'}
                required
                variant="outlined"
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="연도"
                type="number"
                value={formData.vintage}
                onChange={handleChange('vintage')}
                error={Boolean(errors.vintage)}
                helperText={errors.vintage || '와인의 생산 연도를 입력해주세요'}
                required
                variant="outlined"
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>

            {/* 가격과 수량 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="가격 (USD)"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                error={Boolean(errors.price)}
                helperText={errors.price || '와인의 가격을 USD로 입력해주세요'}
                required
                variant="outlined"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="재고 수량"
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity || '현재 보유하고 있는 수량을 입력해주세요'}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>

            {/* description과 isActive 필드 제거됨 - DB에 해당 컬럼이 없음 */}
          </Grid>

          {/* 액션 버튼 */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center', 
            mt: 6,
            pt: 4,
            borderTop: 1,
            borderColor: 'divider',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
              sx={{ 
                minWidth: 160,
                py: 2,
                px: 4
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading}
              sx={{ 
                minWidth: 160,
                py: 2,
                px: 4
              }}
            >
              {loading ? '처리 중...' : (isEdit ? '수정' : '등록')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}