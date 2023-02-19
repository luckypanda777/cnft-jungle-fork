import { Box } from '@mui/material';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import useWindowSize from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import styles from './Sniping.module.scss';

const Contact = () => {
  const router = useRouter();
  const { width } = useWindowSize();

  return (
    <Box className={styles.contactContainer}>
      <span
        style={{
          fontSize: width < 900 ? 22 : 28,
          marginBottom: 10,
          padding: '5px 10px',
        }}
      >
        Already subscribed?
      </span>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          rowGap: 2,
          mx: 'auto',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            fontSize: width < 900 ? 14 : 18,
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            wordBreak: 'break-word',
            textAlign: 'center',
            fontFamily: 'newgilroymedium',
          }}
        >
          Renew your subscription or upgrade an existing one
        </Box>
        <WalletButtonBase
          sx={{
            flex: 1,
            backgroundColor: 'white',
            color:
              width < 900 ? 'var(--rankGrey) !important' : 'var(--blackColor)',
            maxWidth: 300,
            fontSize: width < 900 ? 12 : 18,
          }}
          disabled={width < 900}
          onClick={() => router.push('manage-subscription')}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <span>Open Dashboard</span>
          </Box>
        </WalletButtonBase>
      </Box>
    </Box>
  );
};

export default Contact;
