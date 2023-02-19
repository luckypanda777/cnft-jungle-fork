import { useRef, useState } from 'react';
import { Popover } from '@mui/material';
import styles from './MenuHeaderItem.module.scss';
import { useRouter } from 'next/router';

const MenuHeaderItem = ({ name, url = '', isMenu = false, children = [] }) => {
  if (isMenu) {
    return <MenuHeaderItemMenu name={name} children={children} />;
  }
  return <MenuHeaderItemLink name={name} url={url} />;
};

const MenuHeaderItemLink = ({ name, url }) => {
  return (
    <div className={styles.menuItem} onClick={() => alert(url)}>
      {name}
    </div>
  );
};

const MenuHeaderItemMenu = ({ name, children = [] }) => {
  const anchorEl = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);
  const router = useRouter();
  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const renderItem = () => {
    return children.map((item) => {
      return (
        <div
          className={styles.menuItemSubMenu}
          onClick={() =>
            item.url.startsWith('http')
              ? window.open(item.url, '_blank')
              : router.push(item.url)
          }
        >
          {item.name}
        </div>
      );
    });
  };
  return (
    <div>
      <div
        ref={anchorEl}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`${styles.menuItem} ${styles.menuItemMenu}`}
      >
        {name}
      </div>
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={openedPopover}
        anchorEl={anchorEl.current}
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
          className: styles.menuItemPopover,
        }}
        disableRestoreFocus
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {renderItem()}
        </div>
      </Popover>
    </div>
  );
};

export default MenuHeaderItem;
