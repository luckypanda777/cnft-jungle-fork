import { useRef, useState, memo } from 'react';
import { styled } from '@mui/material/styles';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { tooltipClasses } from '@mui/material/Tooltip';
import Image from 'next/image';
import fullLogo from 'assets/junglelogo.png';
import { useRouter } from 'next/router';
import Copy from 'assets/copy-icon.svg';
import styles from './Modal.module.scss';
import classNames from 'classnames';
import { Box } from '@mui/system';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import CollectionsIcon from '@mui/icons-material/Collections';
import CustomTooltip from 'components/common/CustomTooltip';

import OnchainData from './OnchainData';
import Traits from 'components/Traits';

const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'var(--assetsBg)' : '#121212',
    borderRadius: 10,
    maxWidth: '850px',
    width: '100%',
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

const MediaIconButton = ({ children, color, ...rest }) => {
  return (
    <IconButton
      size="medium"
      sx={{
        borderRadius: '12px',
        backgroundColor: color,
        '&:hover': {
          backgroundColor: color,
        },
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
};

const CopiedTooltip = styled(({ className, ...props }) => (
  <CustomTooltip
    {...props}
    arrow
    placement="top"
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    padding: '10px 15px',
  },
}));

async function copy(text) {
  if ('clipboard' in window.navigator) {
    return await window.navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

const shortened = (addr = '') =>
  addr.substring(0, 10) + '...' + addr.substring(40, addr.length);

const Modal = ({ open, setOpenModal, asset, onClose }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setOpenModal(false);
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleOpenCollection = () => {
    router.push(`/collections/${asset.policy_id}?assetId=${asset.asset_id}`);
  };

  if (!asset) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box className={styles.header}>
          <Image src={fullLogo} alt="logo" height={30} width={115} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {asset?.name || asset?.asset_num}

            <CustomTooltip title="Open in collection view">
              <IconButton
                size="small"
                onClick={handleOpenCollection}
                sx={{ ml: 0.5 }}
              >
                <CollectionsIcon />
              </IconButton>
            </CustomTooltip>
          </div>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className={styles.content}>
          <Box className={styles.assetInfo}>
            <Box className={styles.image}>
              <ImageWithErrorHandler
                src={asset?.optimized_image || asset?.image}
                alt="asset"
              />
            </Box>
            <Box className={classNames(styles.container, styles.price)}>
              <Box className={classNames(styles.paper)}>
                <Box className={styles.heading}>Asset Number</Box>
                <Box className={styles.value}>#{asset?.asset_num}</Box>
              </Box>
            </Box>
          </Box>
          {/*<Box sx={{ pl: 1, mb: 1 }}>
            <span>Onchain Data</span>
          </Box>*/}
          <Box className={styles.assetTraits}>
            <Traits
              asset={asset}
              collection={{ traitlist: asset.traitslist }}
            />
            {/*<OnchainData onchainData={asset.onchainData} />*/}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(Modal);
