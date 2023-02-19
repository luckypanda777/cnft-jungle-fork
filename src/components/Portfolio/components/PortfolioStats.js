import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import StatsTabControls from './StatsTabControls';

const PerformanceChart = dynamic(() => import('../graphs/PerformanceChart'), {
  ssr: false,
});

const WeightsTreemap = dynamic(() => import('../graphs/WeightsTreemap'), {
  ssr: false,
});

const PortfolioStats = ({ address }) => {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profitandloss');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, []);

  return (
    <Box sx={{ flex: 4 }}>
      {tab === 'weights' ? (
        <WeightsTreemap />
      ) : (
        <PerformanceChart address={address} />
      )}
      <StatsTabControls
        setTab={setTab}
        tabs={[
          { label: 'Profit and Loss', value: 'profitandloss' },
          { label: 'Weights', value: 'weights' },
        ]}
      />
    </Box>
  );
};

export default PortfolioStats;
