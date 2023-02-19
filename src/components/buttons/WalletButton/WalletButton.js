import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { styled } from '@mui/material/styles';
import { default as MuiButton } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { fromHex } from 'utils/cardanoUtils';
import { useAppContext } from 'context/AppContext';
import WalletPopover from 'components/common/WalletPopover/WalletPopover';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as AuthContext } from 'context/AuthContext';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { getWalletMe, registerWallet } from 'apiProvider';

const getIcon = (name) => {
  return (
    <img
      src={`../${name}.svg`}
      style={{ display: 'flex', width: '24px', height: '24px' }}
    />
  );
};

export const WalletButtonBase = styled(MuiButton)(({ theme }) => ({
  fontFamily: 'newgilroybold',
  textTransform: 'uppercase',
  padding: '12px',
  width: '100%',
  borderRadius: '10px',
  //boxShadow: '0px 4px 15px 0px rgba(94, 111, 239, 0.5)',
  backgroundColor: 'var(--logoColor)',
  color: '#fff',
  fontSize: '14px',
  letterSpacing: '1.68px',
  minWidth: '200px',
  lineHeight: 2,
  '&:hover': {
    backgroundColor: 'var(--logoColor)',
    color: '#fff',
    opacity: 0.9,
  },
}));

const WalletButton = () => {
  const { setAuth } = useContext(AuthContext);
  const { showFeedback } = useContext(FeedbackContext);
  const router = useRouter();
  const {
    state: { walletInfo },
    setWalletInfo,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const anchorEl = useRef(null);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const handlePopoverToggle = () => {
    setOpenedPopover(!openedPopover);
  };

  const handleWallet = (refresh = false) => {
    setWalletInfo({ loading: true });
    getWalletInfo(false, refresh);
    handlePopoverClose();
  };

  const subdomain = useMemo(
    () => /:\/\/([^\/]+)/.exec(window.location.href)[1],
    [window.location]
  );

  const getWalletInfo = useCallback(
    async (login = false, refresh = false) => {
      const accepted = Boolean(localStorage.getItem('termsAccepted')) || false;
      const name = walletInfo.name || localStorage.getItem('walletName') || '';

      if (login && walletInfo.address) {
        setWalletInfo({ loading: false, termsAccepted: accepted });

        if (subdomain.includes('developers')) {
          return router.push('/data/dashboard');
        }

        return router.push(`/addresses/${walletInfo.address}`);
      }

      if (!window.cardano) {
        showFeedback({
          open: true,
          message: 'Wallet not found',
          duration: 2000,
          kind: 'error',
        });
        return setWalletInfo({
          loading: false,
          name: '',
          balance: 0,
          termsAccepted: accepted,
        });
      }

      const isEnabled = await window.cardano?.[name]?.isEnabled();

      let api;
      if (!isEnabled) {
        try {
          api = await window.cardano?.[name]?.enable();
        } catch (err) {
          if (err.toString().includes('canceled')) {
            localStorage.removeItem('walletName');
          }
          showFeedback({
            open: true,
            message: 'Something went wrong',
            duration: 2000,
            kind: 'error',
          });
          return setWalletInfo({ loading: false, termsAccepted: accepted });
        }
      }

      api = await window.cardano?.[name]?.enable();

      if (!api) {
        if (name) {
          showFeedback({
            open: true,
            message: 'Wallet not found',
            duration: 2000,
            kind: 'error',
          });
        }
        return setWalletInfo({ loading: false, termsAccepted: accepted });
      } else {
        api = await window.cardano?.[name]?.enable();
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

      localStorage.setItem('wallet', decodedAddress);
      localStorage.setItem('jungle-wallet-address', decodedAddress);
      localStorage.setItem('walletName', name);

      const walletRegister = await registerWallet({
        address: decodedAddress,
      });

      if (walletRegister.token && walletRegister.token !== 'undefined') {
        localStorage.setItem('walletToken', walletRegister.token);
      }

      setWalletInfo({
        name,
        balance: lovelace,
        address: decodedAddress,
        loading: false,
        termsAccepted: accepted,
      });

      setAuth({ user: walletRegister.user });

      if (login && subdomain.includes('developers')) {
        return router.push('/data/dashboard');
      }

      if (login) {
        router.push(`/addresses/${decodedAddress}`);
      }
    },
    [mounted, walletInfo.address, window.cardano, window.location]
  );

  useEffect(() => {
    if (!mounted || !window.cardano) return;

    const walletConnectTimeout = setTimeout(() => {
      handleWallet();

      if (window?.cardano && window.cardano?.onAccountChange) {
        window.cardano.onAccountChange(() => {
          localStorage.removeItem('wallet');
          localStorage.removeItem('jungle-wallet-address');
          localStorage.removeItem('walletToken');

          handleWallet(true);
        });
      }
    }, 500);

    return () => {
      clearTimeout(walletConnectTimeout);
    };
  }, [mounted, window.cardano]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonText = walletInfo.name
    ? router.pathname === '/collections/[collection]'
      ? `${(walletInfo.balance / 1000000).toFixed(2)} ADA`
      : subdomain.includes('developers')
      ? 'Dashboard'
      : 'My Portfolio'
    : 'Connect Wallet';

  if (isMobile) {
    return (
      <Box
        sx={{
          width: 35,
          height: 35,
          ml: isMobile ? 1 : 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--blackColor)',
          borderRadius: '50%',
          background: 'var(--whiteColor)',
          p: 0.25,
        }}
        ref={anchorEl}
        onClick={handlePopoverToggle}
      >
        {walletInfo.loading ? (
          <CircularProgress
            size={15}
            style={{ color: 'var(--textDefaultcolor)' }}
          />
        ) : walletInfo.name ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {getIcon(walletInfo.name)}
          </div>
        ) : (
          <AccountBalanceWalletOutlinedIcon />
        )}
        <WalletPopover
          anchor={anchorEl}
          open={openedPopover}
          handleClose={handlePopoverClose}
          handleOpen={handlePopoverOpen}
        />
      </Box>
    );
  }

  return (
    <>
      <WalletButtonBase
        ref={anchorEl}
        sx={{ height: 45, color: 'var(--whiteColor)' }}
        onClick={() => getWalletInfo(true)}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {walletInfo.loading ? (
          <CircularProgress
            size={15}
            style={{ color: 'var(--textDefaultcolor)' }}
          />
        ) : (
          buttonText
        )}
      </WalletButtonBase>
      <WalletPopover
        anchor={anchorEl}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={handlePopoverOpen}
      />
    </>
  );
};

export default WalletButton;
