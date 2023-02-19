import { Box, IconButton, Skeleton } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import treemapData from './holders-treemap-data';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import CustomTooltip from 'components/common/CustomTooltip';

const chartData = ({ labels, holders, uniqueWallets }) => ({
  type: 'donut',
  width: 325,
  options: {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: 0,
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
          size: '90%',
          labels: {
            show: true,
            name: {
              show: true,
              color: 'var(--fontColor)',
              fontFamily: 'newgilroymedium',
              fontSize: 14,
              formatter: function (val) {
                return val + (val === 1 ? ' NFT' : ' NFTs');
              },
            },
            value: {
              show: true,
              color: 'var(--fontColor)',
              fontFamily: 'newgilroymedium',
              fontSize: 14,
              formatter: function (val) {
                return val + (val === 1 ? ' wallet' : ' wallets');
              },
            },
            total: {
              show: true,
              color: 'var(--fontColor)',
              fontFamily: 'newgilroymedium',
              label: 'Holding',
              fontSize: 16,
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
      labels: {
        colors: ['var(--fontColor)'],
      },
      position: 'bottom',
    },
    labels,
    colors: [
      'var(--logoColor)',
      'var(--tertiaryColor)',
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
  if (assets < 11) return ['5-10'];
  if (assets < 26) return ['10-25'];

  return ['25+'];
};

const HoldersChart = ({ policyId }) => {
  const router = useRouter();
  const [distribution, setDistribution] = useState({
    labels: [],
    holders: [],
    uniqueWallets: 0,
  });
  const [walletTreemap, setWalletTreemap] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (policyId) {
      getDistribution();
    }
  }, [policyId]);

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
    );

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

    setWalletTreemap(counts);
    return setLoading(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            my: 1,
          }}
        >
          <Skeleton
            height={15}
            width={150}
            sx={{ transform: 'none' }}
            variant="text"
          />
          <Skeleton
            height={20}
            width={20}
            sx={{ transform: 'none' }}
            variant="text"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Skeleton
            height={200}
            width={200}
            sx={{ transform: 'none' }}
            variant="circular"
          />
          <Box sx={{ display: 'flex', mt: 2, columnGap: 1 }}>
            <Skeleton height={10} width={30} sx={{ transform: 'none' }} />
            <Skeleton height={10} width={30} sx={{ transform: 'none' }} />
            <Skeleton height={10} width={30} sx={{ transform: 'none' }} />
            <Skeleton height={10} width={30} sx={{ transform: 'none' }} />
            <Skeleton height={10} width={30} sx={{ transform: 'none' }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (distribution.holders.length === 0) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No holder info available.</span>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        zIndex: 100,
        textAlign: 'left',
        px: 2,
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <span
          style={{
            marginBottom: 10,
            marginTop: 10,
            fontSize: 18,
            color: 'var(--fontColor)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Holder Distribution
          <CustomTooltip
            title="How many assets is held per a single wallet."
            placement="top"
          />
        </span>

        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomTooltip title="Take holder snapshot" placement="top">
            <IconButton
              onClick={() => {
                window.open(
                  `https://publicapi.cnftpredator.tools/owners/${policyId}`,
                  '_blank'
                );
              }}
              sx={{ color: 'var(--primaryColor)' }}
            >
              <PhotoCameraOutlinedIcon />
            </IconButton>
          </CustomTooltip>
        </Box>
      </Box>
      <Chart {...chartData(distribution)} />
      {/* <span style={{ marginBottom: 10, marginTop: 10 }}>Whale Treemap</span>
      <Chart {...treemapData({ router, data: walletTreemap.slice(0, 100) })} /> */}
    </Box>
  );
};

export default HoldersChart;
