import { Box } from '@mui/material';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import useWindowSize from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import styles from './Sniping.module.scss';

const Events = () => {
  const { width } = useWindowSize();
  const router = useRouter();

  if (width < 900) return null;

  return (
    <Box className={styles.eventsContainer}>
      <span
        style={{
          fontSize: 32,
          padding: '5px 10px',
        }}
      >
        Check the web view
      </span>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          rowGap: 1,
          mx: 'auto',
          flexDirection: 'column',
        }}
      >
        <Box
          style={{
            fontSize: width < 900 ? 14 : 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontFamily: 'newgilroymedium',
            maxWidth: 500,
            marginBottom: 20,
          }}
        >
          Edit your hunts from the web. Get notified via notification, email or
          a tab when a new listing hits the chain
        </Box>
        <WalletButtonBase
          sx={{ height: 45, color: 'var(--whiteColor)', width: 275 }}
          onClick={() => router.push('/manage-extension')}
          disabled={width < 900}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <span>Open Web Sniping</span>
          </Box>
        </WalletButtonBase>
      </Box>
    </Box>
  );
};

export default Events;
