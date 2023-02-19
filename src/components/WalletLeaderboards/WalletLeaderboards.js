import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import TextHeader from 'components/common/TextHeader';
import useDetectDevice from 'hooks/useDetectDevice';
import { useClassicGraph } from 'components/MarketAnalysis/graphs/useClassicGraph';
import { useRouter } from 'next/router';
import WhalesInvolved from './components/WhalesInvolved';
import WhalesBought from './components/WhalesBought';
import WhalesMostBuys from './components/WhalesMostBuys';
import WhalesMostSales from './components/WhalesMostSales';

const SimpleLineGraph = dynamic(
  () => import('components/Portfolio/graphs/SimpleGraph'),
  {
    ssr: false,
  }
);

const WalletLeaderboards = ({}) => {
  const theme = useTheme();
  const { isMobile } = useDetectDevice();
  const { interval, setInterval } = useClassicGraph();
  const router = useRouter();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1600,
      }}
    >
      <TextHeader
        title={<div>Cardano Wallet Leaderboards</div>}
        subtitle={
          <h2
            style={{
              marginTop: 0,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              fontSize: 16,
            }}
          >
            See wallets with most purchases, sells and other metrics.
          </h2>
        }
        titleStyle={{ marginTop: 0 }}
        titleStyleMobile={{ marginTop: 0, fontSize: 24 }}
        subtitleStyleMobile={{ marginTop: 0, fontSize: 22 }}
        socialsStyle={{ marginBottom: 20 }}
        socialsStyleMobile={{ marginBottom: 20 }}
      />
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', display: 'flex', columnGap: 2 }}
      >
        <WhalesInvolved />
      </Grid>
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', display: 'flex', columnGap: 2 }}
      >
        <WhalesBought />
      </Grid>
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', display: 'flex', columnGap: 2 }}
      >
        <WhalesMostBuys />
      </Grid>
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', display: 'flex', columnGap: 2 }}
      >
        <WhalesMostSales />
      </Grid>
    </Grid>
  );
};

export default WalletLeaderboards;
