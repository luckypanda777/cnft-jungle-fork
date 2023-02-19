import styles from './MarketStatsBox.module.scss';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import StatBox from './StatBox';
import { getTotalVolume } from '../../../apiProvider';
import axios from 'axios';

const MarketStatsBox = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [marketInfo, setMarketInfo] = useState({
    sales: 0,
    adaVolume: 0,
    usdVolume: 0,
  });

  const fetchMarketOverviewData = async () => {
    try {
      const data = await getTotalVolume();
      const usdRatio = await axios
        .get(`https://cnft-predator.herokuapp.com/usd-history?interval=24h`)
        .then((res) => res.data.data);

      const usdPrice = usdRatio[usdRatio.length - 1];

      setMarketInfo({
        sales: data.sales,
        adaVolume: data.total_ada_traded_for_nfts,
        usdVolume: data.total_ada_traded_for_nfts * usdPrice,
        usdPrice,
      });
    } catch (err) {
      console.error(err);
      setMarketInfo({
        sales: '-',
        adaVolume: '-',
        usdVolume: '-',
        usdPrice: '-',
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMarketOverviewData();
  }, []);

  if (isLoading) return null;

  return (
    <Box
      className={styles.statsContainer}
      onClick={() => router.push('statistics')}
      sx={{ cursor: 'pointer' }}
    >
      <StatBox
        title="ADA Volume"
        value={`₳${marketInfo?.adaVolume.toLocaleString()}`}
        percentage={33}
      />
      <StatBox
        title="USD Volume"
        value={`$${parseInt(marketInfo?.usdVolume).toLocaleString()}`}
        percentage={33}
      />
      <StatBox
        title="NFTs Sold"
        value={marketInfo?.sales.toLocaleString()}
        percentage={-33}
      />
      <StatBox
        title="Exchange Rate"
        value={`₳1 = $${
          marketInfo?.usdPrice === '-' ? '-' : marketInfo?.usdPrice.toFixed(2)
        }`}
        percentage={5}
      />
    </Box>
  );
};

export default MarketStatsBox;
