import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useAppContext } from 'context/AppContext';
import {
  Badge,
  IconButton,
  Popover,
  Box,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import IConShoppingCart from 'assets/ic-shopping-bag.svg';
import {
  initialAnchorOrigin,
  initialTransformOrigin,
} from 'components/common/WalletPopover/WalletPopover';
import useNFTAction from 'hooks/useNFTAction';
import ListingCart from './ListingCart';
import PurchaseCart from './PurchaseCart';
import { TabPanel } from 'components/common/TabPanel';
import CustomTooltip from 'components/common/CustomTooltip';
import styles from './Header.module.scss';

const Cart = () => {
  const anchorEl = useRef(null);
  const { state } = useAppContext();
  const [tab, setTab] = useState('buy');
  const [open, setOpen] = useState(false);
  const { loadingNFTAction } = useNFTAction();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   if (state.cart.length === 0 && state.listingCart.length > 0) {
  //     setTab('sell');
  //   }
  // }, []);

  return (
    <Box ref={anchorEl}>
      <CustomTooltip
        title={!open ? 'Open cart' : ''}
        position="bottom"
        style={{
          marginLeft: 0,
          borderLeft: '1px solid var(--headerNewsBgColor)',
          width: 42,
          paddingTop: '0',
          display: 'inline-block',
        }}
      >
        <IconButton
          color="inherit"
          aria-name="open drawer"
          edge="end"
          className={`${styles.cartBtn} ${
            open ? styles.cartBtnActive : undefined
          }`}
          onClick={() => setOpen(!open)}
          // onBlur={() => setOpen(false)}
        >
          {loadingNFTAction ? (
            <CircularProgress size={20} sx={{ color: 'var(--logoColor)' }} />
          ) : (
            <Badge
              badgeContent={state.cart.length + state.listingCart.length}
              color="secondary"
              sx={{ margin: 0, padding: 0 }}
            >
              <IConShoppingCart />
            </Badge>
          )}
        </IconButton>
      </CustomTooltip>
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl.current}
        anchorOrigin={initialAnchorOrigin}
        transformOrigin={initialTransformOrigin}
        onClose={handleClose}
        PaperProps={{
          // onMouseEnter: handleOpen,
          // onMouseLeave: handleClose,
          sx: {
            width: '374px',
            borderRadius: '0px',
            pointerEvents: 'auto',
            overflow: 'hidden',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: 'var(--headerSearchBgColor)',
            backgroundImage: 'unset',
          },
        }}
        disableRestoreFocus
        disableScrollLock
        disableAutoFocus
        disableEnforceFocus
        style={{ overflow: 'hidden' }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Box
            sx={{
              flex: 1,
              padding: '10px',
              color: tab === 'buy' ? 'var(--logoColor)' : 'var(--fontColor)',
              textDecorationColor:
                tab === 'buy' ? 'var(--logoColor)' : 'var(--fontColor)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid transparent',
              borderBottomColor:
                tab === 'buy' ? 'var(--logoColor)' : 'var(--shadowColor)',
            }}
            onClick={() => setTab('buy')}
          >
            <span
              style={{
                fontWeight: 700,
                color: tab === 'buy' ? 'var(--fontColor)' : 'var(--grey)',
                fontSize: '14px',
                lineHeight: '17px',
              }}
            >
              Buy
            </span>
          </Box>

          <Box
            sx={{
              flex: 1,
              padding: '10px',
              color: tab === 'sell' ? 'var(--logoColor)' : 'var(--fontColor)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid transparent',
              borderBottomColor:
                tab === 'sell' ? 'var(--logoColor)' : 'var(--shadowColor)',
              lineHeight: '17px',
            }}
            onClick={() => setTab('sell')}
          >
            <span
              style={{
                color: tab === 'sell' ? 'var(--fontColor)' : 'var(--grey)',
                fontSize: '14px',
              }}
            >
              Sell
            </span>
          </Box>
        </Box>
        {/* <Divider sx={{ width: '95%', mx: 'auto' }} /> */}
        <TabPanel value={tab} index="buy">
          <PurchaseCart />
        </TabPanel>
        <TabPanel value={tab} index="sell">
          <ListingCart />
        </TabPanel>
      </Popover>
    </Box>
  );
};

export default Cart;
