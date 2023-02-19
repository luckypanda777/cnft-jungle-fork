import React, { useEffect, useState } from 'react';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import Accordion from 'components/common/Accordion';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { AccordionSkeleton } from '../components/LoadingSkeletons';
import { MockTrades } from '../data/mockAssets';
import { TabPanel } from 'components/common/TabPanel';
import { middlen } from 'utils/shorten';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import InfinitePortfolio from 'components/common/InfinitePortfolio';
import { getMockAssets, mockAssetsData } from '../graphs/data/mock-assets';

const SimpleLineGraph = dynamic(() => import('../graphs/SimpleGraph'), {
  ssr: false,
});

const Watchlist = ({ filters, address }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('assets');
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAssets(mockAssetsData);
    }, 750);
  }, [tab, filters, address]);

  return (
    <>
      <Box
        sx={{
          borderBottom: 0,
          borderColor: 'var(--primaryColor)',
          mb: 2,
          width: '100%',
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
          }}
          sx={{ width: '100%', display: 'flex' }}
        >
          <Tab
            label="Assets"
            value="assets"
            sx={{ maxWidth: '100%', flex: 1, color: 'var(--fontColor)' }}
          />
          <Tab
            label="Collections"
            value="collections"
            sx={{ maxWidth: '100%', flex: 1, color: 'var(--fontColor)' }}
          />
          <Tab
            label="Wallets"
            value="wallets"
            sx={{ maxWidth: '100%', flex: 1, color: 'var(--fontColor)' }}
          />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={'assets'}>
        <InfinitePortfolio
          initialFilters={filters}
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
          headerTitle="Trades"
          fullWidth={false}
          forceLoad={loading}
          white
          border
        />
      </TabPanel>
      <TabPanel value={tab} index={'collections'}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const floor = ((Math.random() * 2 - 1) * 100).toFixed(0);
            const volume = ((Math.random() * 2 - 1) * 10000).toFixed(0);

            return (
              <Accordion
                loading={loading}
                defaultExpanded={false}
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
                        width: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <img
                        src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
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
                        <span style={{ fontSize: 16 }}>Collection Name</span>
                        <Divider
                          sx={{ width: 3, height: 20 }}
                          orientation="vertical"
                        />
                        <span style={{ fontSize: 16 }}>
                          Floor: {floor} ADA
                          <span
                            style={{
                              color:
                                floor > 0
                                  ? 'var(--undervaluedColor)'
                                  : 'var(--errorColor)',
                              marginLeft: 3,
                            }}
                          >
                            (+33%)
                          </span>
                        </span>
                        <Divider
                          sx={{ width: 3, height: 20 }}
                          orientation="vertical"
                        />
                        <span style={{ fontSize: 16 }}>
                          Volume: {volume} ADA
                          <span
                            style={{
                              color:
                                volume > 0
                                  ? 'var(--undervaluedColor)'
                                  : 'var(--errorColor)',
                              marginLeft: 3,
                            }}
                          >
                            (+33%)
                          </span>
                        </span>
                        <Divider
                          sx={{ width: 3, height: 20 }}
                          orientation="vertical"
                        />
                        <SimpleLineGraph
                          name="Performance"
                          data={[300, 225, 150, 505, 430, 355, 680]}
                          color={
                            volume > 0
                              ? 'var(--undervaluedColor)'
                              : 'var(--errorColor)'
                          }
                        />
                      </Box>
                    </Box>
                  )
                }
              >
                <Divider sx={{ height: 2, mt: 1, mb: 2 }} />
                <InfinitePortfolio
                  initialFilters={filters}
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
                  headerTitle="Trades"
                  fullWidth={false}
                  forceLoad={loading}
                  white
                />
              </Accordion>
            );
          })}
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={'wallets'}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            return (
              <Accordion
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
                          {(10 - i) * 100} Buys
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
                  initialFilters={filters}
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
                  headerTitle="Trades"
                  fullWidth={false}
                  forceLoad={loading}
                  white
                  border
                />
              </Accordion>
            );
          })}
        </Box>
      </TabPanel>
    </>
  );
};

export default Watchlist;
