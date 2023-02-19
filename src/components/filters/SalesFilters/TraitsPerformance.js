import { Divider, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect, memo } from 'react';
import moment from 'moment';
import Chart from 'react-apexcharts';
import CustomTooltip from 'components/common/CustomTooltip';

const floorLineChartOptions = (data) => ({
  series: [{ data: data.slice(0, 15), name: 'Price' }],
  height: 200,
  width: '100%',
  type: 'line',
  options: {
    chart: {
      id: 'prices',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      // text: 'Sales History',
      style: {
        color: 'var(--fontColor)',
      },
    },
    yaxis: {
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    markers: {
      size: 0,
    },
    colors: ['var(--primaryColor)', 'var(--logoColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    fill: {
      type: ['solid', 'solid'],
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const TraitsPerformance = ({ sales = [], loading, minimizedFormat }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'flex-start',
          px: 3,
          py: 2,
        }}
      >
        <Skeleton
          height={15}
          sx={{ transform: 'none' }}
          width={125}
          variant="text"
        />
        <Skeleton height={5} sx={{ transform: 'none', my: 2 }} width="100%" />
        <Skeleton height={5} sx={{ transform: 'none', my: 2 }} width="100%" />
        <Skeleton height={5} sx={{ transform: 'none', my: 2 }} width="100%" />
        <Skeleton height={5} sx={{ transform: 'none', my: 2 }} width="100%" />
        <Skeleton height={5} sx={{ transform: 'none', my: 2 }} width="100%" />
      </Box>
    );
  }

  if (sales.length === 0 && !loading) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No sales history.</span>
      </Box>
    );
  }

  const FloorChart = memo(
    () => (
      <Chart
        {...floorLineChartOptions(
          sales
            .filter((s) => s.sold_at || s.time)
            .map((s) => ({
              x: s.sold_at || moment(),
              y: s.sold_for || 0,
            }))
            .sort((a, b) => new Date(b.x) - new Date(a.x))
        )}
      />
    ),
    [sales]
  );

  const avgSalePrice =
    sales
      .filter((s) => s.sold_at || s.time)
      .reduce((acc, s) => acc + s.sold_for, 0) / sales.length;

  const maxSalePrice = Math.max(
    ...sales.filter((s) => s.sold_at || s.time).map((s) => parseInt(s.sold_for))
  );

  const minSalePrice = Math.min(
    ...sales
      .filter((s) => (s.sold_at || s.time) && s.sold_for)
      .map((s) => parseInt(s.sold_for))
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <Box
        sx={{
          marginTop: 1,
          width: '100%',
          px: 2,
        }}
      >
        <span
          style={{
            color: 'var(--fontColor)',
            fontSize: 18,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Sale History
          <CustomTooltip
            title="Sale history price change over a certain period of time (including selected filters and traits)"
            placement="top"
          />
        </span>
        <FloorChart />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          px: 2,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, color: 'var(--logoColor)' }}>
            {parseInt(minSalePrice)} ADA
          </span>
          <span style={{ fontSize: 14 }}>Low</span>
        </Box>
        <Divider
          orientation="vertical"
          sx={{
            height: 20,
            my: 'auto',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, color: 'var(--logoColor)' }}>
            {parseInt(avgSalePrice)} ADA
          </span>
          <span style={{ fontSize: 14 }}>Avg</span>
        </Box>
        <Divider
          orientation="vertical"
          sx={{
            height: 20,
            my: 'auto',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, color: 'var(--logoColor)' }}>
            {parseInt(maxSalePrice)} ADA
          </span>
          <span style={{ fontSize: 14 }}>High</span>
        </Box>
      </Box>
      {!minimizedFormat && (
        <span style={{ fontSize: 12 }}>
          * Graph is built using the currently showing assets, scroll to
          populate more
        </span>
      )}
    </Box>
  );
};

export default TraitsPerformance;
