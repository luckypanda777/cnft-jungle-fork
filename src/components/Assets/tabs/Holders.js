import { Box, Skeleton, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import treemapData from '../graphs/data/holders-treemap-data';
import styles from '../Assets.module.scss';
import WhaleListItem from 'components/modals/AssetModal/WhaleListItem';
import { isMobile } from 'react-device-detect';
import { marketplaceList } from '../graphs/data/marketplace-list';
import axios from 'axios';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { MockHolders } from 'components/Portfolio/data/mockAssets';
import InfinitePortfolio from 'components/common/InfinitePortfolio';
import {
  getMockAssets,
  mockAssetsData,
} from 'components/Portfolio/graphs/data/mock-assets';
import dynamic from 'next/dynamic';
import CustomTooltip from 'components/common/CustomTooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HoldersHistory = dynamic(() => import('../graphs/HoldersHistory'), {
  ssr: false,
});

const HoldersChart = dynamic(
  () => import('components/layout/AssetsSidebar/HoldersChart'),
  {
    ssr: false,
  }
);

const chartData = ({ labels, holders, uniqueWallets }) => ({
  type: 'donut',
  width: 500,
  options: {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: 1,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    dataLabels: {
      style: { color: 'var(--fontColor)' },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              color: 'var(--fontColor)',
              fontSize: 14,
              formatter: function (val) {
                return val + (val === 1 ? ' NFT' : ' NFTs');
              },
            },
            value: {
              show: true,
              color: 'var(--fontColor)',
              fontSize: 14,
              formatter: function (val) {
                return val + (val === 1 ? ' wallet' : ' wallets');
              },
            },
            total: {
              show: true,
              color: 'var(--fontColor)',
              label: 'Holding',
              fontSize: 14,
              formatter: function (val) {
                return uniqueWallets + ' wallets';
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      fontWeight: 600,
      labels: {
        colors: ['var(--fontColor)'],
      },
      position: 'bottom',
    },
    labels,
    colors: [
      'var(--primaryColor)',
      'var(--logoColor)',
      '#f89993',
      '#d16b1d',
      '#c40d00',
    ],
  },
  series: holders,
});

const getWhaleRange = (assets) => {
  if (assets < 2) return ['1'];
  if (assets < 6) return ['2-5'];
  if (assets < 11) return ['6-10'];
  if (assets < 26) return ['11-25'];

  return ['25+'];
};

const HoldersTab = ({ collectionData }) => {
  const policyId = collectionData.collection.policies;
  const router = useRouter();
  const [distribution, setDistribution] = useState({
    labels: [],
    holders: [],
    uniqueWallets: 0,
  });
  const [walletTreemap, setWalletTreemap] = useState([]);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAssets(mockAssetsData);
    }, 750);
  }, []);

  const item = (item, index) => {
    if (marketplaceList[item?.address]) return null;

    return (
      <WhaleListItem
        {...item}
        loading={loading}
        isLast={index !== totals.length - 1}
      />
    );
  };

  const marketplaceItem = (item, index) => {
    if (!marketplaceList[item?.address]) return null;

    return (
      <WhaleListItem
        {...item}
        loading={loading}
        isLast={index !== totals.length - 1}
      />
    );
  };

  useEffect(() => {
    if (policyId) {
      getDistribution();
    }
  }, [collectionData]);

  const getDistribution = async () => {
    setLoading(true);
    const holderData = await axios
      .get(`https://publicapi.cnftpredator.tools/owners/${policyId}`)
      .then((res) => res.data?.owners || [])
      .then((res) => res.map((o) => ({ ...o, value: 1 })))
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return [];
      });

    const counts = Array.from(
      holderData.reduce(
        (m, { stake, value }) => m.set(stake, (m.get(stake) || 0) + value),
        new Map()
      ),
      ([stake, value]) => ({ stake, value })
    ).map(({ stake, value }) => ({
      stake,
      value,
      address: holderData.find((s) => s.stake === stake).address,
    }));

    const whales = counts.reduce((a, { value, voted }) => {
      const range = getWhaleRange(value);
      a[range] = (a[range] || 0) + 1;

      return a;
    }, {});

    setDistribution({
      labels: Object.keys(whales).sort((a, b) => {
        if (a === '100+') return 1;
        if (b === '100+') return -1;

        return a.split('-').map((v) => parseInt(v))[0] - b.split('-')[0];
      }),
      holders: Object.values(whales),
      uniqueWallets: counts.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.stake === value.stake)
      ).length,
    });

    setWalletTreemap(counts?.slice(0, 250));
    setTotals(counts.sort((a, b) => b.value - a.value));
    return setLoading(false);
  };

  const getHolders = async ({ page, perPage }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: totals.slice((page - 1) * perPage, page * perPage),
          total: totals.length,
        });
      }, 0);
    });
  };

  if (distribution.holders.length === 0 && !loading) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No holder info available.</span>
      </Box>
    );
  }

  return (
    <Grid
      container
      xs={12}
      sx={{ width: '100%', marginLeft: 'auto', mt: 2, p: isMobile ? 0 : 2 }}
      justifyContent="space-between"
      rowGap={{ md: 3, sm: 3, xs: 3 }}
    >
      <WhiteCard sx={{ m: 0, height: 'fit-content', width: '100%' }}>
        <HoldersHistory policyId={policyId} />
      </WhiteCard>
      <WhiteCard sx={{ m: 0, height: 'fit-content', width: '100%', p: 0 }}>
        <InfinitePortfolio
          component={(props) => (
            <MockHolders {...props} fullWidth={false} white border />
          )}
          load={(pagination) => getMockAssets({ ...pagination })}
          height={500}
          loadingItems={24}
          perPage={24}
          initialLoad={true}
          headerStyle={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            pt: 1,
            pb: 2,
          }}
          data={assets}
          headerTitle="Holders"
          initialFilters={{ policy_id: policyId }}
          forceLoad={loading}
        />
      </WhiteCard>
      <Grid container gap={3} item>
        <Grid md={5.9} sm={5.9} xs={5.9} item className={styles.statsContainer}>
          <HoldersChart policyId={policyId} />
        </Grid>
        <Grid md={5.9} sm={5.9} xs={5.9}>
          <WhiteCard sx={{ m: 0, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: loading ? 2 : 0,
              }}
            >
              <span
                style={{
                  color: 'var(--fontColor)',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                Top 300 Whale Treemap
              </span>
              <CustomTooltip
                title={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3 style={{ marginTop: 10, marginBottom: 0 }}>
                      Diagram of the top wallets holding this collection
                    </h3>
                  </div>
                }
              >
                <IconButton
                  size="small"
                  sx={{
                    color: 'var(--fontColor)',
                    width: 25,
                    height: 25,
                    p: 0.25,
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" sx={{ mx: 0.5 }} />
                </IconButton>
              </CustomTooltip>
            </Box>
            {loading ? (
              <Skeleton height={250} width="90%" sx={{ transform: 'none' }} />
            ) : (
              <Chart {...treemapData({ router, data: walletTreemap })} />
            )}
          </WhiteCard>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HoldersTab;
