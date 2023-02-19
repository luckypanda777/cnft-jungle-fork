import { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { tooltipClasses } from '@mui/material/Tooltip';
import logo from 'assets/junglelogoplain.png';
import fullLogo from 'assets/junglelogo.png';
import styles from './Modal.module.scss';
import { BrowserView, isBrowser, isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import { CircularProgress, Button, TextField } from '@mui/material';
import Card from '../../cards/CollectionCard';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Context as FeedbackContext } from '../../../context/FeedbackContext';
import { addCollection } from '../../../apiProvider';
import moment from 'moment';
import Image from 'next/image';
import CustomTooltip from 'components/common/CustomTooltip';

const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'var(--assetsBg)' : '#121212',
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

const Modal = ({ open, setOpenModal, onClose }) => {
  const { showFeedback } = useContext(FeedbackContext);
  const [name, setName] = useState('Collection name');
  const [description, setDescription] = useState('Collection description');
  const [socials, setSocials] = useState({});
  const [policy, setPolicy] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [dropDate, setDropDate] = useState(Date.now());

  const handleClose = () => {
    setOpenModal(false);
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!name || !description || !image || !dropDate) {
      return showFeedback({
        message: `
        Please fill name, desciption and date fields and select an image`,
        kind: 'error',
      });
    }

    // if (Object.values(socials).filter((social) => social !== '')) {
    //   return showFeedback({
    //     message: 'Social links should be valid and start with http',
    //     kind: 'error',
    //   });
    // }

    try {
      await addCollection('multipart/form-data', {
        name,
        description,
        dropDate: parseInt(moment(dropDate).format('x')),
        socials: JSON.stringify(socials),
        image: file,
        policy,
      });
      showFeedback({
        message: 'Collection created! It will be visible after review.',
        kind: 'success',
      });
      setName('Collection name');
      setDescription('Collection description');
      setImage(null);
      setFile(null);
      setPolicy('');
      setDropDate(Date.now());
      handleClose();
    } catch (err) {
      showFeedback({
        message: 'Error adding collection.',
        kind: 'error',
      });
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0].size > 1000000) {
      return showFeedback({
        message:
          'File should be below 1mb in size. If possible use the webp format with 400x400px resolution',
        kind: 'error',
        duration: 3000,
      });
    }

    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box className={styles.header}>
          <Image
            src={isMobile ? fullLogo : logo}
            alt="logo"
            height={isMobile ? 30 : 40}
            width={isMobile ? 30 : 40}
          />
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Collection preview
          </span>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: isMobile ? '10px 12px' : '20px 24px' }}>
        <Box className={styles.content}>
          <Box className={styles.card}>
            <Card
              collection_name={name}
              description={description}
              image={image}
              addedAt={dropDate}
              socials={socials}
              isAdding
            />
          </Box>
        </Box>
        <Box className={styles.details}>
          <TextField
            required
            sx={{ width: '100%', mt: 2 }}
            size="small"
            placeholder="Collection name"
            onChange={(e) => setName(e.target.value)}
            inputProps={{
              maxLength: 50,
              sx: { fontSize: isMobile ? 12 : 14 },
            }}
          />
          <TextField
            sx={{ width: '100%' }}
            placeholder="Collection Description"
            size="small"
            multiline
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{
              maxLength: 100,
              sx: { fontSize: isMobile ? 12 : 14 },
            }}
          />
          <TextField
            sx={{ width: '100%' }}
            placeholder="Policy ID (Leave blank if you don't have one)"
            size="small"
            onChange={(e) => setPolicy(e.target.value)}
            inputProps={{
              maxLength: 100,
              sx: { fontSize: isMobile ? 12 : 14 },
            }}
          />
          <Box sx={{ display: 'flex', columnGap: 0.5 }}>
            <TextField
              required
              sx={{ width: '33%' }}
              inputProps={{ sx: { fontSize: isMobile ? 12 : 14 } }}
              size="small"
              placeholder="Twitter"
              onChange={(e) =>
                setSocials(
                  JSON.parse(
                    JSON.stringify({ ...socials, twitter: e.target.value })
                  )
                )
              }
            />
            <TextField
              required
              sx={{ width: '33%', mx: 0.5 }}
              inputProps={{ sx: { fontSize: isMobile ? 12 : 14 } }}
              size="small"
              placeholder="Discord"
              onChange={(e) =>
                setSocials(
                  JSON.parse(
                    JSON.stringify({ ...socials, discord: e.target.value })
                  )
                )
              }
            />
            <TextField
              required
              sx={{ width: '33%' }}
              inputProps={{ sx: { fontSize: isMobile ? 12 : 14 } }}
              size="small"
              placeholder="Website"
              onChange={(e) =>
                setSocials(
                  JSON.parse(
                    JSON.stringify({ ...socials, website: e.target.value })
                  )
                )
              }
            />
          </Box>
          <Box sx={{ display: 'flex', columnGap: 0.5 }}>
            <TextField
              type="number"
              sx={{ width: '49%' }}
              inputProps={{ sx: { fontSize: isMobile ? 12 : 14 } }}
              size="small"
              placeholder="Price"
              onChange={(e) =>
                setSocials(
                  JSON.parse(
                    JSON.stringify({ ...socials, price: e.target.value })
                  )
                )
              }
            />
            <TextField
              type="number"
              sx={{ width: '49%', mx: 0.5 }}
              inputProps={{ sx: { fontSize: isMobile ? 12 : 14 } }}
              size="small"
              placeholder="Supply"
              onChange={(e) =>
                setSocials(
                  JSON.parse(
                    JSON.stringify({ ...socials, supply: e.target.value })
                  )
                )
              }
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Mint date and time (Your local timezone)"
                value={dropDate}
                onChange={setDropDate}
                renderInput={(params) => <TextField {...params} />}
                ampm={false}
              />
            </LocalizationProvider>
            <CustomTooltip title="Upload collection image">
              <IconButton component="label" sx={{ ml: 1 }}>
                {/* <Button variant="contained" component="label"> */}
                <AddPhotoAlternateIcon fontSize="large" />
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/jpg, image/jpg_small. image/webp"
                  hidden
                  onChange={handleFileUpload}
                />
                {/* </Button> */}
              </IconButton>
            </CustomTooltip>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          className={styles.footer}
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: 'var(--logoColor)',
              width: isMobile ? '100%' : 'auto',
              mr: 'auto',
            }}
          >
            Submit for review
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
