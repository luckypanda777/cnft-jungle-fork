import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { useAppContext } from 'context/AppContext';
import React, { useEffect, useState } from 'react';
import WalletRanks from '../Stats/WalletRanks';
import WalletStatBox from '../Stats/WalletStatBox';
import Carousel from 'react-material-ui-carousel';

const responsive = {
  mobile: {
    breakpoint: { max: 900, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const MobileWalletStats = ({ address }) => {
  const [loading, setLoading] = useState(true);
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

  return (
    <Box sx={{ height: 150 }}>
      <Carousel
        animation="fade"
        duration={200}
        autoPlay={false}
        arrows={false}
        swipeable={true}
        draggable={true}
        showDots={true}
        keyBoardControl={false}
      >
        <WalletRanks
          loading={loading}
          ranks={[
            { name: 'Est. Holdings', rank: walletStats.estimated_value_rank },
            { name: 'Floor Holdings', rank: walletStats.current_value_rank },
            {
              name: 'Total NFTs',
              rank: walletStats.total_profit_and_loss_rank,
            },
          ]}
        />
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
              value: walletStats.total_profit_and_loss_7d_percentage_change,
            },
            {
              period: '30d',
              value: walletStats.total_profit_and_loss_30d_percentage_change,
            },
          ]}
        />
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
      </Carousel>
    </Box>
  );
};

export default MobileWalletStats;
