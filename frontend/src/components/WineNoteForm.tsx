/**
 * 와인 노트 생성/편집 폼 컴포넌트
 * 
 * Google Keep 스타일의 노트 생성 및 편집 폼입니다.
 */

import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Palette as PaletteIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { WineNote, NOTE_COLORS } from '../types/wineNote';
import { useCreateWineNote, useUpdateWineNote } from '../hooks/useWineNotes';
import { useSnackbar } from '../contexts/SnackbarContext';

interface WineNoteFormProps {
  wineId: string;
  existingNote?: WineNote;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function WineNoteForm({ wineId, existingNote, onCancel, onSuccess }: WineNoteFormProps) {
  const { showSuccess, showError } = useSnackbar();
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [color, setColor] = useState(existingNote?.color || '#FFFFFF');
  const [isPinned, setIsPinned] = useState(existingNote?.is_pinned || false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const createWineNoteMutation = useCreateWineNote(wineId);
  const updateWineNoteMutation = useUpdateWineNote(wineId);

  const isEditing = !!existingNote;
  const isLoading = createWineNoteMutation.isPending || updateWineNoteMutation.isPending;

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showError('제목을 입력해주세요.');
      return;
    }

    try {
      if (isEditing) {
        await updateWineNoteMutation.mutateAsync({
          noteId: existingNote.id,
          noteData: {
            title: title.trim(),
            content: content.trim() || null,
            color,
            is_pinned: isPinned
          }
        });
        showSuccess('노트가 수정되었습니다.');
      } else {
        await createWineNoteMutation.mutateAsync({
          title: title.trim(),
          content: content.trim() || null,
          color,
          is_pinned: isPinned
        });
        showSuccess('노트가 생성되었습니다.');
      }
      
      // 폼 초기화
      setTitle('');
      setContent('');
      setColor('#FFFFFF');
      setIsPinned(false);
      onSuccess?.();
    } catch (error) {
      showError(isEditing ? '노트 수정에 실패했습니다.' : '노트 생성에 실패했습니다.');
    }
  };

  // 취소
  const handleCancel = () => {
    if (isEditing) {
      setTitle(existingNote.title);
      setContent(existingNote.content || '');
      setColor(existingNote.color);
      setIsPinned(existingNote.is_pinned);
    } else {
      setTitle('');
      setContent('');
      setColor('#FFFFFF');
      setIsPinned(false);
    }
    onCancel?.();
  };

  return (
    <Card
      sx={{
        backgroundColor: color,
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
        position: 'relative',
        minHeight: 120
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* 고정 아이콘 */}
          {isPinned && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <PushPinIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
          )}

          {/* 제목 입력 */}
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            disabled={isLoading}
          />

          {/* 내용 입력 */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            disabled={isLoading}
          />

          {/* 액션 버튼들 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* 고정 버튼 */}
              <Tooltip title={isPinned ? '고정 해제' : '고정'}>
                <IconButton
                  size="small"
                  onClick={() => setIsPinned(!isPinned)}
                  disabled={isLoading}
                  sx={{ 
                    color: isPinned ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  {isPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              {/* 색상 선택 버튼 */}
              <Tooltip title="색상 변경">
                <IconButton
                  size="small"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  disabled={isLoading}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  <PaletteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* 저장/취소 버튼 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                size="small"
                startIcon={<SaveIcon />}
                variant="contained"
                disabled={isLoading || !title.trim()}
                sx={{
                  color: 'white',
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.6)'
                  }
                }}
              >
                {isEditing ? '수정' : '저장'}
              </Button>
              <Button
                size="small"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                variant="outlined"
                disabled={isLoading}
              >
                취소
              </Button>
            </Box>
          </Box>

          {/* 색상 선택기 */}
          {showColorPicker && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {NOTE_COLORS.map((noteColor) => (
                  <Box
                    key={noteColor}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: noteColor,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: color === noteColor ? '2px solid #000' : '1px solid #ccc',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                    onClick={() => {
                      setColor(noteColor);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
