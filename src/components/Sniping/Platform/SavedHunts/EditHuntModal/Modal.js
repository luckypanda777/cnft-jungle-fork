import { styled } from '@mui/material/styles';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Modal.module.scss';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import { DialogActions } from '@mui/material';
import StartHunt from 'components/Sniping/Platform/NFTHunt';

const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'var(--assetsBg)' : '#171718',
    borderRadius: 10,
    maxWidth: '850px',
    width: '100%',
    backgroundImage: 'none',
  },
  '& .MuiDialogContent-root': {
    padding: '0 30px',
  },
  '& .MuiDialogTitle-root': {
    padding: '20px 30px',
  },
  '& .MuiDialogActions-root': {
    padding: '20px 30px',
  },
}));

const Modal = ({
  open,
  setOpenModal,
  onClose,
  editingHunt,
  editType,
  clearEditingHunt,
  selectedMultiEdit,
}) => {
  const handleClose = () => {
    clearEditingHunt();
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box className={styles.header}>
          <span style={{ display: 'flex', alignItems: 'flex-start' }}>
            {editType === 'edit'
              ? 'Edit '
              : editType === 'all'
              ? 'Edit Selected'
              : 'Duplice '}
            {editingHunt?.label}{' '}
            {selectedMultiEdit.length > 0 && selectedMultiEdit.length}{' '}
            {editType === 'all' && selectedMultiEdit.length > 0
              ? 'Hunts'
              : 'Hunt'}
          </span>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: isMobile ? '10px 12px' : '20px 24px' }}>
        <StartHunt />
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};

export default Modal;
