import { Box } from '@mui/material';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import useWindowSize from 'hooks/useWindowSize';
import styles from '../Assets.module.scss';

const CollectionWhales = () => {
  const { width } = useWindowSize();

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
        Track all the whale
        <span style={{ color: 'var(--logoColor)' }}> moves</span>
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
          See whale purchases and sales in real time. Set custom alerts to get
          notified when whales make their moves.
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

export default CollectionWhales;
