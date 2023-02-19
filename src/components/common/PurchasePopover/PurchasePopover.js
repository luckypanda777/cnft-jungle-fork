import { useEffect, useState } from 'react';
import { Popover, Button, Box, CircularProgress, Divider } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { useRouter } from 'next/router';
import CustomTooltip from 'components/common/CustomTooltip';

const PurchasePopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  handlePurchase,
  handleLink,
  handleInfo,
  purchaseLoading,
  showPurchasePopover = true,
  assetId,
  asset,
}) => {
  const router = useRouter();
  const {
    state: { walletInfo },
    setWalletInfo,
  } = useAppContext();
  const [termsError, setTermsError] = useState(false);

  if (!showPurchasePopover) {
    return null;
  }

  return (
    <Popover
      sx={{ pointerEvents: 'none' }}
      open={open}
      disableScrollLock={true}
      anchorEl={anchor.current}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handleClose}
      PaperProps={{
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
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
          flexDirection: 'column',
          minWidth: '200px',
          width: '100%',
        }}
      >
        <Button
          sx={{
            padding: '12px 28px',
            color: 'var(--color)',
            display: 'flex',
            justifyContent: purchaseLoading ? 'center' : 'flex-start',
            fontFamily: 'newgilroybold',
          }}
          onClick={handlePurchase}
          disableElevation
          disableRipple
          disabled={purchaseLoading}
        >
          {purchaseLoading ? (
            <CircularProgress size={18} />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--textDefaultcolor)',
              }}
            >
              Buy NFT
              <CustomTooltip
                title={
                  !!localStorage.getItem('DApp')
                    ? 'Jungle adds 0.25% fee, min. 1 ADA, Eternl adds 0.1% fee on purchases above 100 ADA.'
                    : 'Jungle adds 0.25% fee, min. 1 ADA'
                }
              />
            </div>
          )}
        </Button>{' '}
        <Divider sx={{ width: '90%', margin: 'auto' }} />
        <Button
          sx={{
            padding: '12px 28px',
            color: 'var(--color)',
            display: 'flex',
            justifyContent: 'flex-start',
            fontFamily: 'newgilroybold',
            border: termsError && '1px solid var(--errorColor)',
            borderRadius: 0,
          }}
          onClick={handleLink}
          disableElevation
          disableRipple
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--textDefaultcolor)',
              borderRadius: 0,
            }}
          >
            Open Marketplace
          </div>
        </Button>
        <Divider sx={{ width: '90%', margin: 'auto' }} />
        {handleInfo && (
          <Button
            sx={{
              padding: '12px 28px',
              color: 'var(--color)',
              display: 'flex',
              justifyContent: 'flex-start',
              fontFamily: 'newgilroybold',
              border: termsError && '1px solid var(--errorColor)',
              borderRadius: 0,
            }}
            onClick={handleInfo}
            disableElevation
            disableRipple
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--textDefaultcolor)',
                borderRadius: 0,
              }}
            >
              Asset Info
            </div>
          </Button>
        )}
      </Box>
    </Popover>
  );
};

export default PurchasePopover;
