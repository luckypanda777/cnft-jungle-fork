/* global chrome */
import { useContext, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import { Context as AuthContext } from 'context/AuthContext';
import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import { fetchStakeAddress } from 'utils/shorten';

const AccessRequired = ({ children }) => {
  const router = useRouter();
  const {
    state: { walletInfo },
  } = useAppContext();
  const { loading, setExtensionAuthState } = useAuth();
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setExtensionAuthState();
    }
  }, [user]);

  const hasUser = user;
  const hasAccess = !!user?.snipeTier;
  const isBlocked = user?.snipeBlocked;
  const isExpired = user?.snipeAccessExpiry < Date.now();

  const hasExpiry = !!user?.snipeAccessExpiry;
  const matchesStakeKey =
    fetchStakeAddress(walletInfo.address) === user?.stakeKey;
  const matchesAddress = walletInfo.address === user?.address;

  if (
    hasUser &&
    hasAccess &&
    !isBlocked &&
    (hasExpiry ? !isExpired : true) &&
    matchesStakeKey &&
    matchesAddress
  ) {
    return children;
  }

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '65vh',
        width: '100%',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          fontSize: 20,
          color: 'white',
          transform: 'translate(-50%,-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '102.5%',
          height: '102.5%',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderRadius: '12px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--primaryColor)',
            borderRadius: 4,
            p: 3,
            color: 'var(--whiteColor)',
            rowGap: 1,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 24, marginBottom: 10, padding: '5px 10px' }}>
            {loading || walletInfo.loading
              ? 'Checking Access'
              : 'Access required'}
          </span>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              mx: 'auto',
            }}
          >
            <WalletButtonBase
              style={{
                flex: 1,
                backgroundColor: 'white',
                color: 'black',
                width: 300,
              }}
              onClick={() => router.push('/sniping')}
            >
              {loading || walletInfo.loading ? (
                <CircularProgress size={24} />
              ) : (
                'Get Access'
              )}
            </WalletButtonBase>
          </Box>
        </Box>
      </div>
      {children}
    </Box>
  );
};

export default AccessRequired;
