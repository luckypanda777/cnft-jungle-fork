import { useRef, useState } from 'react';
import { Popover } from '@mui/material';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import IConGroup from 'assets/Group.svg';
import IConClose from 'assets/close.svg';
import MenuList from './Menu/ListV2';
import styles from './styles.module.scss';

const Sidebar = () => {
  const anchorEl = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);
  const router = useRouter();
  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const togglePopover = () => {
    setOpenedPopover((open) => !open);
  };

  return (
    <div ref={anchorEl}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={togglePopover}
        sx={{
          marginRight: 0,
          width: 42,
          height: 44,
          borderLeft: '1px solid var(--headerNewsBgColor)',
          borderRadius: 0,
          backgroundColor: openedPopover ? '#D5317C' : 'transparent',
        }}
      >
        {openedPopover ? <IConClose /> : <IConGroup />}
      </IconButton>
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={openedPopover}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handlePopoverClose}
        PaperProps={{
          className: styles.menuItemPopover,
        }}
        disableRestoreFocus
        marginThreshold={0}
        elevation={0}
      >
        <div>
          <MenuList />
        </div>
      </Popover>
    </div>
  );
};

export default Sidebar;
