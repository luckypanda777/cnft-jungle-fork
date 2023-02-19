import styles from 'components/filters/AssetsFilters/AssetsFilters.module.scss';
import { IconButton, Popover } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useRef, useState } from 'react';
import { Box } from '@mui/system';

const TOGGLE_BUTTONS = [
  { value: 'list', icon: <FormatListBulletedIcon /> },
  { value: 'small', icon: <ViewComfyIcon /> },
  { value: 'large', icon: <ViewModuleIcon /> },
];

const ToggleView = ({ handleDisplay, display, style }) => {
  const [openedPopover, setOpenedPopover] = useState(false);

  const anchor = useRef(null);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const handleView = (value) => {
    handleDisplay(value);
    handlePopoverClose();
  };

  const toggleBtn = TOGGLE_BUTTONS.find((el) => el.value === display);

  return (
    <>
      <IconButton
        ref={anchor}
        sx={{ ...style }}
        className={styles.iconStyle}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {toggleBtn.icon}
      </IconButton>
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={openedPopover}
        anchorEl={anchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        PaperProps={{
          onMouseEnter: handlePopoverOpen,
          onMouseLeave: handlePopoverClose,
          sx: {
            borderRadius: '10px',
            pointerEvents: 'auto',
          },
        }}
        disableRestoreFocus
      >
        <Box
          sx={{
            display: 'flex',
            columnGap: '8px',
            padding: '8px 12px',
          }}
        >
          {TOGGLE_BUTTONS.filter((el) => el.value !== toggleBtn.value).map(
            (el) => (
              <IconButton
                key={el.value}
                className={styles.iconStyle}
                onClick={() => handleView(el.value)}
              >
                {el.icon}
              </IconButton>
            )
          )}
        </Box>
      </Popover>
    </>
  );
};

export default ToggleView;
