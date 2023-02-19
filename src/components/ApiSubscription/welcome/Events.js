import { Box } from '@mui/material';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import useWindowSize from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import styles from '../ApiInfo.module.scss';

const Events = () => {
  const { width } = useWindowSize();
  const router = useRouter();

  if (width < 900) return null;

  return (
    <Box className={styles.eventsContainer}>
      <span
        style={{
          fontSize: 20,
          textTransform: 'uppercase',
        }}
      >
        Coming Soon
      </span>
      <span
        style={{
          fontSize: 60,
          textTransform: 'uppercase',
          fontFamily: 'newgilroybold',
        }}
      >
        Build with Jungle data
        <span style={{ color: 'var(--logoColor)' }}> api</span>
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
          Launch your project 10x faster with Jungle data api. Historical data,
          realtime updates, ccustom event webhooks and more.
        </Box>
        <WalletButtonBase
          sx={{ height: 45, color: 'var(--whiteColor)', width: 275 }}
          disabled
        >
          Explore More
        </WalletButtonBase>
      </Box>
    </Box>
  );
};

export default Events;
