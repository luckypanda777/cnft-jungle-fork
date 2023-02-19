import { Box } from '@mui/material';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import { useRouter } from 'next/router';
import styles from '../ApiInfo.module.scss';

const Contact = () => {
  const router = useRouter();

  return (
    <Box className={styles.contactContainer}>
      <span style={{ fontSize: 28, marginBottom: 10, padding: '5px 10px' }}>
        Large volume or unique business model?
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
          style={{
            fontSize: 18,
            display: 'flex',
            columnGap: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            wordBreak: 'break-word',
            width: 400,
            textAlign: 'center',
            fontFamily: 'newgilroymedium',
          }}
        >
          Let's talk about your needs and how we can help you.
        </Box>
        <WalletButtonBase
          style={{
            flex: 1,
            backgroundColor: 'white',
            color: 'var(--blackColor)',
            maxWidth: 300,
          }}
          onClick={() => router.push('/')}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <span>Contact us</span>
          </Box>
        </WalletButtonBase>
      </Box>
    </Box>
  );
};

export default Contact;
