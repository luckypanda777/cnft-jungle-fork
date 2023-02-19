import { Box, CircularProgress, Divider } from '@mui/material';
import Accordion from 'components/common/Accordion';
import InfinitePortfolio from 'components/common/InfinitePortfolio';

import { useAppContext } from 'context/AppContext';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { AccordionSkeleton } from '../components/LoadingSkeletons';
import { MockAssets } from '../data/mockAssets';
import { getMockAssets, mockAssetsData } from '../graphs/data/mock-assets';

const SimpleLineGraph = dynamic(() => import('../graphs/SimpleGraph'), {
  ssr: false,
});

const Portfolio = ({ filters, groupBy, address }) => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAssets(mockAssetsData);
    }, 750);
  }, [filters, address]);

  if (groupBy === 'asset') {
    return (
      <InfinitePortfolio
        loading={loading}
        defaultExpanded={false}
        component={(props) => (
          <MockAssets
            showIcons={['listingCart', 'verified']}
            border
            white
            fullWidth={false}
            {...props}
          />
        )}
        load={(pagination) => getMockAssets({ ...pagination })}
        threshold={505}
        loadingItems={36}
        perPage={36}
        initialLoad={loading}
        headerStyle={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          pb: 1,
          ml: 1,
        }}
        headerTitle="Assets"
        initialFilters={filters}
        forceLoad={loading}
      />
    );
  }

  if (groupBy === 'collection') {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          rowGap: 1,
        }}
      >
        {(loading
          ? new Array(5).fill(0)
          : Array.from(new Set(assets.map((a) => a.collection)))
        ).map((collection, i) => {
          const groupedAssets = assets.filter(
            (a) => a.collection === collection
          );
          return (
            <Accordion
              fullWidthLabel
              loading={loading}
              defaultExpanded={i === 0 && !loading}
              sharp={false}
              style={{ width: '100%' }}
              label={
                loading ? (
                  <AccordionSkeleton height={50} />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <img
                      src={groupedAssets[0]?.collection_image}
                      style={{
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        marginRight: 10,
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        columnGap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {groupedAssets[0]?.collection}
                      </span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>
                        P/L: {((Math.random() * 2 - 1) * 100).toFixed(0)} ADA
                        <span
                          style={{
                            color: 'var(--undervaluedColor)',
                            marginLeft: 3,
                          }}
                        >
                          (+33%)
                        </span>
                      </span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>Weight: {i}%</span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <SimpleLineGraph
                        name="Performance"
                        data={[300, 225, 150, 505, 430, 355, 680]}
                        color="var(--undervaluedColor)"
                      />
                    </Box>
                  </Box>
                )
              }
            >
              <Divider sx={{ height: 2, mt: 1, mb: 2 }} />
              <InfinitePortfolio
                component={(props) => (
                  <MockAssets
                    showIcons={['listingCart', 'verified']}
                    border
                    white
                    {...props}
                  />
                )}
                load={(pagination) => getMockAssets({ ...pagination })}
                threshold={505}
                height={500}
                loadingItems={36}
                perPage={36}
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
                headerTitle="Assets"
                fullWidth={false}
                initialFilters={{
                  address,
                  policy_id: groupedAssets[0]?.policy_id,
                  filters,
                  groupBy: 'collection',
                }}
              />
            </Accordion>
          );
        })}
      </Box>
    );
  }

  return (
    <InfinitePortfolio
      component={(props) => (
        <MockAssets
          showIcons={['listingCart', 'verified']}
          border
          white
          {...props}
        />
      )}
      load={(pagination) => getMockAssets({ ...pagination })}
      threshold={505}
      loadingItems={36}
      perPage={36}
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
      headerTitle="Assets"
      fullWidth={false}
      initialFilters={{
        address,
        filters,
        groupBy: 'asset',
      }}
    />
  );
};

export default Portfolio;
