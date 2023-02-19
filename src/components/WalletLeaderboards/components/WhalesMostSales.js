import { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import Accordion from 'components/common/Accordion';
import { MockAssets, MockTrades } from 'components/Portfolio/data/mockAssets';
import ListPeriodFilters from 'components/filters/ListPeriodFilters';
import { middlen } from 'utils/shorten';
import { AccordionSkeleton } from 'components/Portfolio/components/LoadingSkeletons';
import {
  getMockAssets,
  mockAssetsData,
} from 'components/Portfolio/graphs/data/mock-assets';
import InfinitePortfolio from 'components/common/InfinitePortfolio';

const WhalesMostSales = () => {
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
    <WhiteCard sx={{ m: 0, height: 'fit-content', mb: 3, flex: 1 }}>
      <span style={{ fontSize: 20 }}>Most Sales</span>
      <ListPeriodFilters
        loading={loading}
        handleFilterChange={handleFilterChange}
        style={{ marginTop: 0, position: 'static' }}
        hideSearchBar
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          rowGap: 1,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => {
          return (
            <Accordion
              loading={loading}
              defaultExpanded={false}
              sharp={false}
              style={{ width: '100%' }}
              label={
                loading ? (
                  <AccordionSkeleton height={25} noImage />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        columnGap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{ fontSize: 16, color: 'var(--primaryColor)' }}
                        onClick={() =>
                          router.push(
                            '/portfolio/addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8'
                          )
                        }
                      >
                        {middlen(
                          'addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8',
                          15
                        )}
                      </span>
                      <Divider
                        sx={{ width: 3, height: 20 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>
                        {(10 - i) * 100} Sales
                      </span>
                      <Divider
                        sx={{ width: 3, height: 20 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>
                        {(Math.random() * 10000).toLocaleString()} ADA Volume
                      </span>
                    </Box>
                  </Box>
                )
              }
            >
              <Divider sx={{ height: 2, mt: 1, mb: 2 }} />
              <InfinitePortfolio
                component={MockTrades}
                load={(pagination) => getMockAssets({ ...pagination })}
                threshold={505}
                loadingItems={24}
                perPage={24}
                initialLoad={loading}
                headerStyle={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  pb: 1,
                  ml: 1,
                }}
                data={assets}
                headerTitle="Buys"
                fullWidth={false}
              />
            </Accordion>
          );
        })}
      </Box>
    </WhiteCard>
  );
};

export default WhalesMostSales;
