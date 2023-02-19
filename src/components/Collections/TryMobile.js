import { Box } from '@mui/material';
import React, { useState } from 'react';
import { isMobile, isIOS, isAndroid } from 'react-device-detect';
import MobileStoreButton from 'react-mobile-store-button';
import jungle from 'assets/junglelogoplain.png';
import { useAppContext } from 'context/AppContext';
import { getFromLocalStorage } from 'utils/isEmptyObject';

const TryMobile = () => {
  const {
    state: { isMobile },
  } = useAppContext();

  const [open, setOpen] = useState(
    getFromLocalStorage('noMobileAppPopup') !== 'true'
  );

  const iosUrl = process.env.NEXT_PUBLIC_IOS_APP_URL;
  const androidUrl = process.env.NEXT_PUBLIC_ANDROID_APP_URL;

  if (!isMobile) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        background: 'var(--assetsBg)',
        top: 0,
        left: 0,
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        rowGap: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: 6,
          background: 'black',
          p: 1,
        }}
      >
        <img src={jungle.src} width={100} />
      </Box>
      <Box sx={{ fontSize: 20, textAlign: 'center' }}>
        Jungle is being redesigned for mobile.
      </Box>
      <Box sx={{ fontSize: 20, textAlign: 'center' }}>
        Try our {isIOS ? 'iOS' : 'Android'} app for better experience!
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          rowGap: 1,
          fontSize: 18,
        }}
      >
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Sniping and Market Alerts</span>
        </Box>
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Market Overview</span>
        </Box>
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Trending collections</span>
        </Box>
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Personal watchlist</span>
        </Box>
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Portfolio breakdown</span>
        </Box>
        <Box sx={{ display: 'flex', columnGap: 0.5 }}>
          <span style={{ color: 'var(--logoColor)' }}>-</span>
          <span>Mobile notifications</span>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {isAndroid && (
          <MobileStoreButton
            store="android"
            url={androidUrl}
            linkProps={{ title: 'Play Store Button' }}
          />
        )}
        {isIOS && (
          <MobileStoreButton
            store="ios"
            url={iosUrl}
            linkProps={{ title: 'iOS Store Button' }}
          />
        )}
      </Box>

      {/* <Box
        sx={{ color: 'var(--primaryColor)', mt: 4, fontSize: 18 }}
        onClick={() => {
          setLocalStorage('noMobileAppPopup', 'true');
          setOpen(false);
        }}
      >
        Continue to the site
      </Box> */}
    </Box>
  );
};

export default TryMobile;
