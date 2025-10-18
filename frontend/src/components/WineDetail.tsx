/**
 * 와인 상세 정보 컴포넌트
 * 
 * Material-UI 컴포넌트를 사용하여 와인 상세 정보를 표시합니다.
 * TODO: 실제 구현 필요
 */

import { Container, Typography, Box } from '@mui/material';

/**
 * 와인 상세 컴포넌트
 * 
 * @returns JSX 요소
 */
export default function WineDetail() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🍷 와인 상세 정보
        </Typography>
        <Typography variant="body1" color="text.secondary">
          와인 상세 정보 페이지가 구현될 예정입니다.
        </Typography>
      </Box>
    </Container>
  );
}