import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Popover, Button, Box, Divider, Alert, Link } from '@mui/material';
import { fromHex } from 'utils/cardanoUtils';
import { useAppContext } from 'context/AppContext';
import { useRouter } from 'next/router';
import GavelIcon from '@mui/icons-material/Gavel';
import { getWalletMe, registerWallet } from 'apiProvider';

const getIcon = (name) => {
  return (
    <img
      src={`../${name}.svg`}
      style={{ display: 'flex', width: '15px', height: '15px' }}
    />
  );
};

export const initialAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const initialTransformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const WalletPopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  anchorOrigin = initialAnchorOrigin,
  transformOrigin = initialTransformOrigin,
}) => {
  const router = useRouter();
  const {
    state: { walletInfo, isMobile },
    setWalletInfo,
  } = useAppContext();
  const [termsError, setTermsError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWallet = (name) => {
    localStorage.removeItem('walletToken');
    if (!walletInfo.termsAccepted) {
      return setTermsError(true);
    }
    setWalletInfo({ loading: true });
    localStorage.setItem('walletName', name);
    getWalletInfo(name);
    handleClose();
  };

  const handleTerms = () => {
    setWalletInfo({ termsAccepted: true });
    localStorage.setItem('termsAccepted', true);
  };

  const getWalletInfo = async (name, login = false) => {
    if (login && walletInfo.address) {
      setWalletInfo({ loading: false });
      return router.push(`/addresses/${walletInfo.address}`);
    }

    if (!window.cardano) {
      return setWalletInfo({ loading: false });
    }

    const isEnabled = await window.cardano?.[name]?.isEnabled();

    let api;
    if (!isEnabled) {
      try {
        api = await window.cardano?.[name]?.enable();
      } catch (err) {
        return setWalletInfo({ loading: false });
      }
    }

    api = await window.cardano?.[name]?.enable();

    if (!api) {
      return setWalletInfo({ name: '', balance: 0, loading: false });
    }

    const { Address, Value } = await import(
      '@emurgo/cardano-serialization-lib-browser'
    );

    const balanceValue = await api.getBalance();
    const balance = Value.from_bytes(fromHex(balanceValue));
    const lovelace = balance.coin().to_str();

    let selectedAddress;
    const [usedAddress] = await api.getUsedAddresses();

    if (!usedAddress) {
      // eternl might not have a used address
      const [unusedAddress] = await api.getUnusedAddresses();
      selectedAddress = unusedAddress;
    } else {
      selectedAddress = usedAddress;
    }

    const decodedAddress = Address.from_bytes(
      Buffer.from(selectedAddress, 'hex')
    ).to_bech32();

    let walletData = {};
    if (
      localStorage.getItem('walletToken') &&
      localStorage.getItem('walletToken') !== 'undefined'
    ) {
      walletData = await getWalletMe()
        .then((res) => res.user)
        .catch(() => {});
    } else {
      const walletRegister = await registerWallet({ address: decodedAddress });
      if (walletRegister.token && walletRegister.token !== 'undefined') {
        localStorage.setItem('walletToken', walletRegister.token);
      }

      walletData = walletRegister.user;
    }

    setWalletInfo({
      name,
      balance: lovelace,
      address: decodedAddress,
      loading: false,
      watchlist: walletData?.watchlist,
      hideWatchlist: walletData?.hideWatchlist,
      watchlistNames: walletData?.watchlistNames,
    });

    if (login) {
      router.push(`/addresses/${decodedAddress}`);
    }
  };

  if (!mounted) return null;

  return (
    <Popover
      sx={{ pointerEvents: 'none' }}
      open={open}
      anchorEl={anchor.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      onClose={handleClose}
      PaperProps={{
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
        sx: {
          pointerEvents: 'auto',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6.7957px)',
          backgroundImage: 'unset',
          borderRadius: '0px 0px 12px 12px',
        },
      }}
      disableRestoreFocus
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '155px',
          width: '100%',
          padding: '10px 0',
        }}
      >
        {(isMobile
          ? ['eternl', 'begin']
          : ['nami', 'eternl', 'flint', 'gerowallet', 'typhon', 'nufi', 'begin']
        ).map((name, idx) => {
          return (
            <React.Fragment key={idx}>
              <Button
                sx={{
                  padding: '5px 16px',
                  color: 'var(--color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'newgilroybold',
                }}
                onClick={() =>
                  handleWallet(name === 'typhon' ? 'typhoncip30' : name)
                }
                endIcon={walletInfo.name === name ? <CheckIcon /> : null}
                disableElevation
                disableRipple
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--fontColor)',
                    fontSize: '12px',
                    lineHeight: '25px',
                    fontWeight: '700',
                  }}
                >
                  <div
                    style={{
                      marginRight: '12px',
                    }}
                  >
                    {getIcon(name)}
                  </div>
                  {isMobile && walletInfo.balance
                    ? `${(walletInfo.balance / 1000000).toFixed(2)} ADA`
                    : name}
                </div>
              </Button>
            </React.Fragment>
          );
        })}
        {!walletInfo.termsAccepted && (
          <>
            <Button
              sx={{
                padding: '10px 10px',
                color: 'var(--fontColor)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'newgilroybold',
                border: termsError && '1px solid var(--errorColor)',
                borderRadius: 0,
              }}
              onClick={handleTerms}
              endIcon={<GavelIcon />}
              disableElevation
              disableRipple
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--fontColor)',
                  borderRadius: 0,
                  fontSize: '12px',
                  lineHeight: '25px',
                  fontWeight: '700',
                }}
              >
                Click to Accept T&C
              </div>
            </Button>

            {termsError && (
              <Alert
                severity="error"
                sx={{
                  width: 200,
                  margin: 'auto',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              >
                Please agree to the{' '}
                <Link
                  sx={{
                    cursor: 'pointer',
                    color: 'var(--logoColor)',
                    textDecorationColor: 'var(--logoColor)',
                  }}
                  onClick={() =>
                    window.open(
                      'https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf'
                    )
                  }
                >
                  {' '}
                  T&C
                </Link>{' '}
                before you connect wallet
              </Alert>
            )}
          </>
        )}
      </Box>
    </Popover>
  );
};

export default WalletPopover;
