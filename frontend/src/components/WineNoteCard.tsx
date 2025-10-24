/**
 * 와인 노트 카드 컴포넌트
 * 
 * Google Keep 스타일의 노트 카드를 렌더링합니다.
 */

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { WineNote, NOTE_COLORS } from '../types/wineNote';
import { useUpdateWineNote, useDeleteWineNote, useTogglePinWineNote, useChangeWineNoteColor } from '../hooks/useWineNotes';
import { useSnackbar } from '../contexts/SnackbarContext';

interface WineNoteCardProps {
  note: WineNote;
  wineId: string;
}

export default function WineNoteCard({ note, wineId }: WineNoteCardProps) {
  const { showSuccess, showError } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);

  const updateWineNoteMutation = useUpdateWineNote(wineId);
  const deleteWineNoteMutation = useDeleteWineNote(wineId);
  const togglePinMutation = useTogglePinWineNote(wineId);
  const changeColorMutation = useChangeWineNoteColor(wineId);

  // 편집 모드 토글
  const handleEditToggle = () => {
    if (isEditing) {
      // 편집 취소
      setEditTitle(note.title);
      setEditContent(note.content || '');
    }
    setIsEditing(!isEditing);
  };

  // 노트 저장
  const handleSave = async () => {
    try {
      await updateWineNoteMutation.mutateAsync({
        noteId: note.id,
        noteData: {
          title: editTitle,
          content: editContent
        }
      });
      setIsEditing(false);
      showSuccess('노트가 저장되었습니다.');
    } catch (error) {
      showError('노트 저장에 실패했습니다.');
    }
  };

  // 노트 삭제
  const handleDelete = async () => {
    if (window.confirm('이 노트를 삭제하시겠습니까?')) {
      try {
        await deleteWineNoteMutation.mutateAsync(note.id);
        showSuccess('노트가 삭제되었습니다.');
      } catch (error) {
        showError('노트 삭제에 실패했습니다.');
      }
    }
    setAnchorEl(null);
  };

  // 고정/해제 토글
  const handleTogglePin = async () => {
    try {
      await togglePinMutation.mutateAsync({
        noteId: note.id,
        isPinned: !note.is_pinned
      });
      showSuccess(note.is_pinned ? '노트 고정이 해제되었습니다.' : '노트가 고정되었습니다.');
    } catch (error) {
      showError('노트 고정 상태 변경에 실패했습니다.');
    }
    setAnchorEl(null);
  };

  // 색상 변경
  const handleColorChange = async (color: string) => {
    try {
      await changeColorMutation.mutateAsync({
        noteId: note.id,
        color
      });
      showSuccess('노트 색상이 변경되었습니다.');
    } catch (error) {
      showError('노트 색상 변경에 실패했습니다.');
    }
    setColorMenuAnchor(null);
  };

  return (
    <Card
      sx={{
        backgroundColor: note.color,
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
        position: 'relative',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, p: 2 }}>
        {/* 고정 아이콘 */}
        {note.is_pinned && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <PushPinIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        )}

        {/* 편집 모드 */}
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목"
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                variant="contained"
                disabled={updateWineNoteMutation.isPending}
              >
                저장
              </Button>
              <Button
                size="small"
                startIcon={<CancelIcon />}
                onClick={handleEditToggle}
                variant="outlined"
              >
                취소
              </Button>
            </Box>
          </Box>
        ) : (
          /* 읽기 모드 */
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 1,
                wordBreak: 'break-word',
                lineHeight: 1.3
              }}
            >
              {note.title}
            </Typography>
            {note.content && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4
                }}
              >
                {note.content}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* 액션 버튼들 */}
      {!isEditing && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 1,
            }
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditToggle}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          편집
        </MenuItem>
        <MenuItem onClick={handleTogglePin}>
          {note.is_pinned ? (
            <>
              <PushPinOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
              고정 해제
            </>
          ) : (
            <>
              <PushPinIcon sx={{ mr: 1 }} fontSize="small" />
              고정
            </>
          )}
        </MenuItem>
        <MenuItem onClick={(e) => setColorMenuAnchor(e.currentTarget)}>
          <PaletteIcon sx={{ mr: 1 }} fontSize="small" />
          색상 변경
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          삭제
        </MenuItem>
      </Menu>

      {/* 색상 선택 메뉴 */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={() => setColorMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, width: 200 }}>
          {NOTE_COLORS.map((color) => (
            <Box
              key={color}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: note.color === color ? '2px solid #000' : '1px solid #ccc',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </Box>
      </Menu>
    </Card>
  );
}
