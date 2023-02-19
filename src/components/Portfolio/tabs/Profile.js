import { Box, IconButton, Tooltip } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { MockAssets, MockAddresses, MockTrades } from '../data/mockAssets';
import GrainIcon from '@mui/icons-material/Grain';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getMockAssets, mockAssetsData } from '../graphs/data/mock-assets';
import InfinitePortfolio from 'components/common/InfinitePortfolio';
import CustomTooltip from 'components/common/CustomTooltip';

const HoldingsChart = dynamic(() => import('../graphs/HoldingsChart'), {
  ssr: false,
});

const Profile = ({ changeTab, address }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setAssets(mockAssetsData);
      setLoading(false);
    }, 750);
  }, [address]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', columnGap: 3 }}>
        <WhiteCard sx={{ flex: 1, mx: 0 }}>
          <HoldingsChart changeTab={changeTab} address={address} />
        </WhiteCard>
        <WhiteCard
          sx={{
            flex: 1,
            mx: 0,
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span>Recent Trades</span>
            <CustomTooltip title="View all trades" placement="top">
              <span
                style={{
                  color: 'var(--primaryColor)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                onClick={() => changeTab('activity')}
              >
                See All
              </span>
            </CustomTooltip>
          </Box>
          <InfinitePortfolio
            address={address}
            component={(props) => (
              <MockTrades {...props} fullWidth dense border white />
            )}
            load={(pagination) => getMockAssets({ ...pagination })}
            threshold={505}
            loadingItems={24}
            perPage={24}
            initialLoad={loading}
            data={assets}
            containerStyle={{ py: 2 }}
            height={250}
          />
        </WhiteCard>
      </Box>
      <Box sx={{ display: 'flex', width: '100%', columnGap: 3 }}>
        <WhiteCard
          sx={{
            flex: 1,
            mx: 0,
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: 'flex',
            position: 'relative',
            height: 300,
          }}
        >
          <CustomTooltip title="Show relations graph" placement="top">
            <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
              <IconButton color="primary">
                <GrainIcon />
              </IconButton>
            </Box>
          </CustomTooltip>
          Related Addresses
          {/* [TODO] reference for graph https://nftgo.io/account/ETH/0x1f055d883120bb393a8b0a913fbeb91667957201/stats */}
          <InfinitePortfolio
            address={address}
            component={(props) => (
              <MockAddresses {...props} fullWidth dense mint border white />
            )}
            load={(pagination) => getMockAssets({ ...pagination })}
            threshold={505}
            loadingItems={24}
            perPage={24}
            initialLoad={loading}
            data={assets}
            containerStyle={{ py: 2 }}
            height={250}
          />
        </WhiteCard>
        <WhiteCard
          sx={{
            flex: 1,
            mx: 0,
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span>Recent Mints</span>
            <CustomTooltip title="View all mints" placement="top">
              <span
                style={{
                  color: 'var(--primaryColor)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
                onClick={() => changeTab('mints')}
              >
                See All
              </span>
            </CustomTooltip>
          </Box>
          <InfinitePortfolio
            address={address}
            component={(props) => (
              <MockTrades {...props} fullWidth dense mint border white />
            )}
            load={(pagination) => getMockAssets({ ...pagination })}
            threshold={505}
            loadingItems={24}
            perPage={24}
            initialLoad={loading}
            data={assets}
            containerStyle={{ py: 2 }}
            height={250}
          />
        </WhiteCard>
      </Box>
    </Box>
  );
};

export default Profile;
