/**
 * 와인 노트 섹션 컴포넌트
 * 
 * Google Keep 스타일의 와인 노트 목록과 생성 폼을 관리합니다.
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  NoteAdd as NoteAddIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';
import { WineNote } from '../types/wineNote';
import { useWineNotes } from '../hooks/useWineNotes';
import WineNoteCard from './WineNoteCard';
import WineNoteForm from './WineNoteForm';

interface WineNotesSectionProps {
  wineId: string;
}

type ViewMode = 'grid' | 'list';

export default function WineNotesSection({ wineId }: WineNotesSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<WineNote | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data: notesData, isLoading, error } = useWineNotes(wineId);

  // 노트 정렬 (고정된 노트가 먼저, 그 다음 생성일 순)
  const sortedNotes = notesData?.notes.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }) || [];

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    setEditingNote(null);
  };

  const handleEditCancel = () => {
    setEditingNote(null);
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        노트를 불러오는 중 오류가 발생했습니다.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteAddIcon />
          와인 노트
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* 뷰 모드 토글 */}
          <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <Tooltip title="그리드 보기">
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                sx={{
                  backgroundColor: viewMode === 'grid' ? 'primary.main' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : 'text.secondary',
                  borderRadius: 0,
                  borderTopLeftRadius: '4px',
                  borderBottomLeftRadius: '4px',
                  '&:hover': {
                    backgroundColor: viewMode === 'grid' ? 'primary.dark' : 'action.hover',
                  }
                }}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="리스트 보기">
              <IconButton
                size="small"
                onClick={() => setViewMode('list')}
                sx={{
                  backgroundColor: viewMode === 'list' ? 'primary.main' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'text.secondary',
                  borderRadius: 0,
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                  '&:hover': {
                    backgroundColor: viewMode === 'list' ? 'primary.dark' : 'action.hover',
                  }
                }}
              >
                <ViewListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* 새 노트 버튼 */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateForm(true)}
            sx={{ ml: 1 }}
          >
            새 노트
          </Button>
        </Box>
      </Box>

      {/* 노트 생성 폼 */}
      {showCreateForm && (
        <Box sx={{ mb: 3 }}>
          <WineNoteForm
            wineId={wineId}
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        </Box>
      )}

      {/* 노트 목록 */}
      {sortedNotes.length === 0 && !showCreateForm ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <NoteAddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            아직 노트가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            이 와인에 대한 첫 번째 노트를 작성해보세요
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {sortedNotes.map((note) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              lg={viewMode === 'grid' ? 3 : 12}
              key={note.id}
            >
              {editingNote?.id === note.id ? (
                <WineNoteForm
                  wineId={wineId}
                  existingNote={editingNote}
                  onSuccess={handleEditSuccess}
                  onCancel={handleEditCancel}
                />
              ) : (
                <WineNoteCard
                  note={note}
                  wineId={wineId}
                />
              )}
            </Grid>
          ))}
        </Grid>
      )}

      {/* 통계 정보 */}
      {sortedNotes.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              총 {sortedNotes.length}개의 노트
              {sortedNotes.filter(note => note.is_pinned).length > 0 && 
                ` (고정: ${sortedNotes.filter(note => note.is_pinned).length}개)`
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {viewMode === 'grid' ? '그리드 보기' : '리스트 보기'}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
