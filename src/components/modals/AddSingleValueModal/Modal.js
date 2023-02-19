import { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import logo from 'assets/junglelogoplain.png';
import fullLogo from 'assets/junglelogo.png';
import styles from './Modal.module.scss';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import { Skeleton, capitalize, CircularProgress } from '@mui/material';
import Input from 'components/common/Input';
import Image from 'next/image';
import SearchValue from './ValueSearch';
import { Context as FeedbackContext } from '../../../context/FeedbackContext';
import FilterButton from 'components/buttons/FilterButton';
import { SearchBox } from 'components/boxes/BookmarkBoxes';

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

const popularCollections = [
  {
    image:
      'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
    label: 'Spacebudz',
    verified: true,
    bookmarked: true,
  },
  {
    image:
      'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
    label: 'Spacebudz',
    verified: true,
    bookmarked: false,
  },
  {
    image:
      'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
    label: 'Spacebudz',
    verified: false,
    bookmarked: true,
  },
  {
    image:
      'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
    label: 'Spacebudz',
    verified: true,
    bookmarked: true,
  },
  {
    image:
      'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
    label: 'Spacebudz',
    verified: false,
    bookmarked: false,
  },
];

const Modal = ({
  setValueModalType,
  onClose,
  type = 'collection',
  onSubmit = () => {},
  outsideLoading = false,
}) => {
  const { showFeedback } = useContext(FeedbackContext);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState(null);

  const isPortfolio = type === 'portfolio';
  const isWallet = type === 'wallet';
  const isAddress = isWallet || isPortfolio;

  const handleClose = () => {
    setValueModalType('');
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
    setSearched(false);
    setValue(null);
    setLoading(false);
    setOptions([]);
  };

  const handleAddWallet = () => {
    if (type === 'watchlist' || type === 'huntlist') {
      onSubmit && onSubmit(value);
      return setValue(null);
    }

    if (value === '' || !value?.startsWith('addr')) {
      return showFeedback({
        open: true,
        message: 'Should be a valid address',
        kind: 'error',
      });
    }

    // if (wallets.includes(value)) {
    //   return showFeedback({
    //     open: true,
    //     message: 'Wallet already added!',
    //     kind: 'error',
    //   });
    // }

    if (isPortfolio) {
      return showFeedback({
        open: true,
        message: 'Wallet added to portfolio!',
        kind: 'success',
      });
    }

    if (isWallet) {
      return showFeedback({
        open: true,
        message: 'Wallet added to bookmarks!',
        kind: 'success',
      });
    }
  };

  if (type === '') return null;

  if (type === 'watchlist') {
    return (
      <Dialog
        open={!!type}
        onClose={handleClose}
        sx={{ width: 500, mx: 'auto', height: 250, my: 'auto' }}
      >
        <DialogTitle>
          <Box className={styles.header}>
            <Image
              src={isMobile ? fullLogo : logo}
              alt="logo"
              height={isMobile ? 30 : 40}
              width={isMobile ? 30 : 40}
            />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Add Watchlist
            </span>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: isMobile ? '10px 12px' : '20px 24px',
            mb: 2,
            height: isAddress ? 90 : 400,
          }}
        >
          <Box className={styles.details}>
            <Input
              placeholder="New watchlist name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </Box>
          <FilterButton
            sx={{
              width: '100%',
              backgroundColor: 'var(--lightGrey)',
              border: 'none',
              color: 'var(--fontColor)',
            }}
            onClick={handleAddWallet}
            pressable
          >
            {outsideLoading ? <CircularProgress size={16} /> : 'Add Watchlist'}
          </FilterButton>
        </DialogContent>
      </Dialog>
    );
  }

  if (type === 'huntlist') {
    return (
      <Dialog
        open={!!type}
        onClose={handleClose}
        sx={{ width: 500, mx: 'auto', height: 250, my: 'auto' }}
      >
        <DialogTitle>
          <Box className={styles.header}>
            <Image
              src={isMobile ? fullLogo : logo}
              alt="logo"
              height={isMobile ? 30 : 40}
              width={isMobile ? 30 : 40}
            />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Add Hunt Folder
            </span>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: isMobile ? '10px 12px' : '20px 24px',
            mb: 2,
            height: isAddress ? 90 : 400,
          }}
        >
          <Box className={styles.details}>
            <Input
              placeholder="New huntlist name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </Box>
          <FilterButton
            sx={{
              width: '100%',
              backgroundColor: 'var(--lightGrey)',
              border: 'none',
              color: 'var(--fontColor)',
            }}
            onClick={handleAddWallet}
            pressable
          >
            {outsideLoading ? <CircularProgress size={16} /> : 'Add Huntlist'}
          </FilterButton>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!type} onClose={handleClose} sx={{ width: 500, mx: 'auto' }}>
      <DialogTitle>
        <Box className={styles.header}>
          <Image
            src={isMobile ? fullLogo : logo}
            alt="logo"
            height={isMobile ? 30 : 40}
            width={isMobile ? 30 : 40}
          />
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Add {capitalize(isAddress ? 'address' : type)} to{' '}
            {isPortfolio ? 'Portfolio' : 'Watchlist'}
          </span>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: isMobile ? '10px 12px' : '20px 24px',
          mb: 2,
          height: isAddress ? 90 : 400,
        }}
      >
        <Box className={styles.details}>
          {isAddress ? (
            <Input
              placeholder="Paste addr here"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <SearchValue
              setOptions={setOptions}
              options={options}
              placeholder={`Search ${capitalize(type)}s`}
              loading={loading}
              setLoading={setLoading}
              setSearched={setSearched}
              value={value}
              setValue={setValue}
              type={type}
            />
          )}
        </Box>
        {isAddress ? (
          <FilterButton
            sx={{ width: '100%' }}
            onClick={handleAddWallet}
            pressable
          >
            Add Wallet
          </FilterButton>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 1,
            }}
          >
            {searched && value && options?.length === 0 ? (
              <span style={{ textAlign: 'center' }}>Nothing found</span>
            ) : (
              (!searched ? [] : options).map((option, i) => {
                if (loading) {
                  return (
                    <Skeleton
                      key={i}
                      variant="rect"
                      height={60}
                      sx={{ borderRadius: 2 }}
                    />
                  );
                }

                return (
                  <SearchBox
                    key={i}
                    option={option}
                    type={type}
                    labelLength={14}
                    identifier={option.assetId || option.collectionPolicyId}
                    showIcons={['bookmark']}
                  />
                );
              })
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
