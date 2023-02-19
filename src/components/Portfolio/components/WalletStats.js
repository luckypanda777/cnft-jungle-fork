import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import MobileWalletStats from './mobile/MobileWalletStats';
import WalletRanks from './Stats/WalletRanks';
import WalletStatBox from './Stats/WalletStatBox';
import StatsTabControls from './StatsTabControls';

const WalletSentiment = dynamic(
  () => import('../graphs/WalletSentimentChart'),
  {
    ssr: false,
  }
);

const WalletStats = ({ address }) => {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stats');
  const [walletStats, setWalletStats] = useState({});

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setWalletStats({
        estimated_value: 1300456,
        estimated_value_7d_percentage_change: 10,
        estimated_value_30d_percentage_change: 30,
        current_value: 1700456,
        current_value_7d_percentage_change: -5,
        current_value_30d_percentage_change: 23,
        total_profit_and_loss: 600456,
        total_profit_and_loss_7d_percentage_change: 15,
        total_profit_and_loss_30d_percentage_change: 23,
        estimated_value_rank: 123,
        current_value_rank: 55,
        total_profit_and_loss_rank: 12,
        buy_volume: 3200777,
        buy_volume_7d_value_change: 10362,
        buy_volume_30_value_change: 287111,
        sell_volume: 3200777,
        sell_volume_7d_value_change: 10362,
        sell_volume_30_value_change: 287111,
        activity_amount: 3200777,
        activity_amount_7d_value_change: 10362,
        activity_amount_30_value_change: 287111,
        related_addresses_total: 288,
        related_addresses_whales: 11,
        related_addresses_contracts: 5,
      });
      setLoading(false);
    }, 750);
  }, [address]);

  if (isMobile) {
    return <MobileWalletStats address={address} />;
  }

  return (
    <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column', rowGap: 1 }}>
      {tab === 'stats' ? (
        <>
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: 1,
              }}
            >
              <WalletStatBox
                loading={loading}
                name="Est. Value"
                value={walletStats.estimated_value}
                postfix="ADA"
                periods={[
                  {
                    period: '7d',
                    value: walletStats.estimated_value_7d_percentage_change,
                  },
                  {
                    period: '30d',
                    value: walletStats.sell_volume_30_value_change,
                  },
                ]}
              />
              <WalletStatBox
                loading={loading}
                name="Current Value"
                value={walletStats.current_value}
                postfix="ADA"
                periods={[
                  {
                    period: '7d',
                    value: walletStats.current_value_7d_percentage_change,
                  },
                  {
                    period: '30d',
                    value: walletStats.current_value_30d_percentage_change,
                  },
                ]}
              />
              <WalletStatBox
                loading={loading}
                name="Total P/L"
                value={walletStats.total_profit_and_loss}
                postfix="ADA"
                periods={[
                  {
                    period: '7d',
                    value:
                      walletStats.total_profit_and_loss_7d_percentage_change,
                  },
                  {
                    period: '30d',
                    value:
                      walletStats.total_profit_and_loss_30d_percentage_change,
                  },
                ]}
              />
            </Box>
            <WalletRanks
              loading={loading}
              ranks={[
                {
                  name: 'Est. Holdings',
                  rank: walletStats.estimated_value_rank,
                },
                {
                  name: 'Floor Holdings',
                  rank: walletStats.current_value_rank,
                },
                {
                  name: 'Total NFTs',
                  rank: walletStats.total_profit_and_loss_rank,
                },
              ]}
            />
          </Box>
          <WhiteCard
            sx={{
              backgroundColor: 'var(--assetsBg)',
              m: 0,
              p: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: 4,
                columnGap: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
              }}
            >
              <WalletStatBox
                loading={loading}
                name="Buy Volume"
                value={walletStats.buy_volume}
                postfix="ADA"
                periods={[
                  {
                    period: '7d',
                    value: walletStats.buy_volume_7d_value_change,
                  },
                  {
                    period: '30d',
                    value: walletStats.buy_volume_30_value_change,
                  },
                ]}
                display="value"
              />
              <WalletStatBox
                loading={loading}
                name="Sell Volume"
                value={walletStats.sell_volume}
                postfix="ADA"
                periods={[
                  {
                    period: '7d',
                    value: walletStats.sell_volume_7d_value_change,
                  },
                  {
                    period: '30d',
                    value: walletStats.sell_volume_30_value_change,
                  },
                ]}
                display="value"
              />
              <WalletStatBox
                loading={loading}
                name="Related Addresses"
                value={288}
                postfix="Wallets"
                periods={[
                  {
                    period: 'Whales',
                    value: 11,
                  },
                  {
                    period: 'Contracts',
                    value: 5,
                    style: { backgroundColor: 'goldenrod' },
                  },
                ]}
                display="value"
              />
              <WalletStatBox
                loading={loading}
                name="Total Activity"
                value={walletStats.activity_amount}
                postfix=""
                periods={[
                  {
                    period: '7d',
                    value: walletStats.activity_amount_7d_value_change,
                  },
                  {
                    period: '30d',
                    value: walletStats.activity_amount_30_value_change,
                  },
                ]}
                display="value"
              />
            </Box>
          </WhiteCard>
        </>
      ) : (
        <>
          <WalletSentiment address={address} />
        </>
      )}
      <StatsTabControls
        setTab={setTab}
        tabs={[
          { label: 'Wallet Stats', value: 'stats' },
          { label: 'Sentiment', value: 'sentiment' },
        ]}
      />
    </Box>
  );
};

export default WalletStats;
