import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import logo from 'assets/developers.png';
import mobileLogo from 'assets/junglelogoplain.png';
import logoLight from 'assets/jungleorcalight.png';
import { useAppContext } from 'context/AppContext';
import Link from 'next/link';
import ThemeButton from 'components/buttons/ThemeButton';
import { Box } from '@mui/system';
import { getCollections } from 'apiProvider';
import useWindowSize from 'hooks/useWindowSize';
import useDetectDevice from 'hooks/useDetectDevice';
import dynamic from 'next/dynamic';
import LeaderboardButton from 'components/buttons/LeaderboardButton';
import { useTheme } from 'next-themes';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const WalletButton = dynamic(() => import('components/buttons/WalletButton'), {
  ssr: false,
});

const DevelopersHeader = () => {
  const { state, setWallet } = useAppContext();
  const size = useWindowSize();
  const { isMobile } = useDetectDevice();
  const { theme } = useTheme();

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'var(--bgColor)',
        height: 'var(--headerHeight)',
      }}
    >
      <Toolbar sx={{ p: { xs: 1 } }}>
        <Box className={styles.header}>
          <Box className={styles.primaryHeader}>
            <Box className={styles.brand}>
              <Link href="/">
                <a>
                  <img
                    src={size.width < 900 ? mobileLogo.src : logo.src}
                    alt="logo"
                    height={size.width < 900 ? 50 : 45}
                    width={size.width < 900 ? 50 : 275}
                  />
                </a>
              </Link>
            </Box>
            <Box className={styles.brandMobile}>
              <Link href="/">
                <a>
                  <img
                    src={mobileLogo.src}
                    alt="brand logo"
                    width={64}
                    height={64}
                  />
                </a>
              </Link>
            </Box>
            <Box className={styles.userActions}>
              <ThemeButton />
              <WalletButton
                portfolio
                wallet={state.wallet}
                setWallet={setWallet}
              />
            </Box>
          </Box>
        </Box>
        {isMobile && (
          <Box className={styles.mobilePagesHeader}>
            <Box className={styles.actions}>
              <ThemeButton />
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DevelopersHeader;
