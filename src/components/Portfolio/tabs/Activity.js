import React, { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import Accordion from 'components/common/Accordion';

import moment from 'moment';
import dynamic from 'next/dynamic';
import { MockTrades } from '../data/mockAssets';
import { AccordionSkeleton } from '../components/LoadingSkeletons';
import { getMockAssets, mockAssetsData } from '../graphs/data/mock-assets';
import { useAppContext } from 'context/AppContext';
import InfinitePortfolio from 'components/common/InfinitePortfolio';

const Activity = ({ groupBy, filters, address }) => {
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
          <MockTrades
            showIcons={['bookmark', 'verified']}
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
        data={assets}
        headerTitle="Trades"
        fullWidth={false}
        initialFilters={filters}
        forceLoad={loading}
        white
        border
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
                      <span style={{ fontSize: 16 }}>Total {i}</span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>Buys {i}</span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>Sales {i}</span>
                      <Divider
                        sx={{ width: 3, height: 30 }}
                        orientation="vertical"
                      />
                      <span style={{ fontSize: 16 }}>Listings {i}</span>
                    </Box>
                  </Box>
                )
              }
            >
              <Divider sx={{ height: 2, mt: 1, mb: 2 }} />
              <InfinitePortfolio
                loading={loading}
                defaultExpanded={false}
                component={(props) => (
                  <MockTrades
                    showIcons={['bookmark', 'verified']}
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
                data={assets}
                headerTitle="Trades"
                fullWidth={false}
              />
            </Accordion>
          );
        })}
      </Box>
    );
  }

  return (
    <InfinitePortfolio
      loading={loading}
      defaultExpanded={false}
      component={(props) => (
        <MockTrades
          showIcons={['bookmark', 'verified']}
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
      data={assets}
      headerTitle="Trades"
      fullWidth={false}
      white
      border
    />
  );
};

export default Activity;
