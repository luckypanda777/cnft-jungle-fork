import { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import Accordion from 'components/common/Accordion';
import { MockHolders } from 'components/Portfolio/data/mockAssets';
import ListPeriodFilters from 'components/filters/ListPeriodFilters';
import { AccordionSkeleton } from 'components/Portfolio/components/LoadingSkeletons';
import {
  getMockAssets,
  mockAssetsData,
} from 'components/Portfolio/graphs/data/mock-assets';
import InfinitePortfolio from 'components/common/InfinitePortfolio';

const WhalesInvolved = () => {
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
      <span style={{ fontSize: 20 }}>Most Whales Involved</span>
      <ListPeriodFilters
        loading={loading}
        handleFilterChange={handleFilterChange}
        style={{ marginTop: 0, position: 'static' }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          rowGap: 1,
          overflowY: 'scroll',
          height: 500,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const percentageHeld = (Math.random() * 100).toFixed(2);
          return (
            <Accordion
              loading={loading}
              defaultExpanded={false}
              sharp={false}
              style={{ width: '95%', mx: 'auto' }}
              label={
                loading ? (
                  <AccordionSkeleton height={50} />
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
                      <img
                        src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
                        style={{
                          borderRadius: 10,
                          width: 50,
                          height: 50,
                        }}
                      />
                      <span style={{ fontSize: 16 }}>Collection {i}</span>
                      <Divider
                        sx={{ width: 3, height: 20 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>
                        {(10 - i) * 100} Whales
                      </span>
                      <Divider
                        sx={{ width: 3, height: 20 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>
                        {parseInt(Math.random() * 1000).toLocaleString()} NFTs
                        Held
                      </span>
                      <Divider
                        sx={{ width: 3, height: 20 }}
                        orientation="vertical"
                      />
                      <span
                        style={{
                          fontSize: 16,
                          color:
                            percentageHeld > 50
                              ? 'var(--tradeLoss)'
                              : 'var(--undervaluedColor)',
                        }}
                      >
                        {percentageHeld}% of total
                      </span>
                    </Box>
                  </Box>
                )
              }
            >
              <Divider sx={{ height: 2, mt: 1, mb: 2 }} />
              <InfinitePortfolio
                component={MockHolders}
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
                headerTitle="Holders"
                fullWidth={false}
                height={300}
              />
            </Accordion>
          );
        })}
      </Box>
    </WhiteCard>
  );
};

export default WhalesInvolved;
