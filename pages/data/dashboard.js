import { Box } from '@mui/material';
import styles from '../../styles/Markets.module.scss';
import dynamic from 'next/dynamic';

const ApiDashboard = dynamic(
  () => import('components/ApiSubscription/dashboard/ApiDashboard'),
  {
    ssr: false,
  }
);

function MarketsPage() {
  return (
    <>
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <ApiDashboard />
        </Box>
      </Box>
    </>
  );
}

export default MarketsPage;
