import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { MockAssets } from 'components/Portfolio/data/mockAssets';
import ListPeriodFilters from 'components/filters/ListPeriodFilters';
import InfinitePortfolio from 'components/common/InfinitePortfolio';
import {
  getMockAssets,
  mockAssetsData,
} from 'components/Portfolio/graphs/data/mock-assets';

const WhalesBought = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setAssets(mockAssetsData);
      setLoading(false);
    }, 750);
  }, []);

  const handleFilterChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  };

  return (
    <WhiteCard sx={{ m: 0, height: 'fit-content', mb: 3, width: '100%' }}>
      <span style={{ fontSize: 20 }}>Whales Bought</span>
      <ListPeriodFilters
        loading={loading}
        handleFilterChange={handleFilterChange}
        style={{ marginTop: 0, position: 'static' }}
      />
      <InfinitePortfolio
        component={MockAssets}
        load={(pagination) => getMockAssets({ ...pagination })}
        threshold={505}
        loadingItems={24}
        perPage={24}
        forceLoad={loading}
        headerStyle={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          pb: 1,
          ml: 1,
        }}
        data={assets}
        headerTitle="Assets"
        fullWidth={false}
      />
    </WhiteCard>
  );
};

export default WhalesBought;
