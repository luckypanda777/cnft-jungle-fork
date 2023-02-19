import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

const MintChart = dynamic(() => import('../graphs/MintChart'), {
  ssr: false,
});

const WalletStats = () => {
  return (
    <Box sx={{ flex: 4 }}>
      <MintChart />
    </Box>
  );
};

export default WalletStats;
