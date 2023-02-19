import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/system';
import { Button, IconButton, Skeleton } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import ApexCharts from 'apexcharts';
import CachedIcon from '@mui/icons-material/Cached';
import { nFormatter } from 'utils/formatCurrency';
import MainCard from '../../MarketOverview/graphs/MainCard';
import { useAppContext } from 'context/AppContext';
import AssetModal from '../../modals/AssetModal/Modal';
import { getPriceToRarity } from 'apiProvider';

const options = (listings) => ({
  type: 'bar',
  height: 500,
  series: [
    {
      name: 'Active Listings',
      data: listings
        .map((listing) => ({
          x: listing.price,
          y: listing.amount,
        }))
        .sort((a, b) => b.price - a.price),
    },
  ],
  options: {
    chart: {
      id: 'price-to-rarity-scatter-chart',
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'xy',
        autoScaleYaxis: true,
        autoScaleXaxis: true,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
      events: {
        click: function (event, chartContext, config) {
          const { seriesIndex, dataPointIndex, globals } = config;

          if (seriesIndex < 0 || dataPointIndex < 0) return;

          const data = globals.initialSeries[seriesIndex].data[dataPointIndex];
        },
        dataPointMouseEnter: function (event) {
          event.path[0].style.cursor = 'pointer';
        },
        dataPointMouseLeave: function (event) {
          return;
        },
        dataPointSelection: (event, chartContext, config) => {
          const data =
            config.w.config.series[config.seriesIndex].data[
              config.dataPointIndex
            ];

          if (data.link) {
            window.open(data.link);
          }
        },
      },
    },
    legend: {
      labels: { colors: 'var(--fontColor)' },
      offsetY: 5,
      position: 'bottom',
      horizontalAlign: 'center',
      showForNullSeries: false,
    },
    // annotations: {
    //   yaxis: [
    //     {
    //       borderColor: '#fff',
    //       fillColor: '#fff',
    //       opacity: 1,
    //     },
    //   ],
    //   xaxis: [
    //     {
    //       borderColor: '#fff',
    //       fillColor: '#fff',
    //       opacity: 1,
    //     },
    //   ],
    // },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 50,
      tickPlacement: 'between',
      labels: {
        formatter: function (value) {
          // if (value > 1000) {
          //   return Math.floor(value / 1000) + 'k';
          // }

          // return value > 10000 ? '10000+' : Math.floor(value);
          return nFormatter(value, 1);
        },
        style: { colors: 'var(--fontColor)' },
      },
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
      },
      forceNiceScale: true,
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--fontColor)' },
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      title: {
        text: 'Amount of listings',
        style: {
          color: 'var(--fontColor)',
        },
      },
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: 'white',
          width: 0.5,
          dashArray: 3,
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    colors: ['var(--logoColor)', '#757575'],
    markers: {
      colors: ['var(--logoColor)', '#757575'],
      size: 3,
      strokeWidth: 0,
      shape: 'circle',
      onClick: undefined,
    },
    grid: {
      padding: {
        left: 20,
        right: 20,
      },
    },
  },
});

const PriceListings = ({}) => {
  const { state } = useAppContext();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolumeFloorHisotry();
  }, [state.collection]);

  const getVolumeFloorHisotry = async () => {
    if (!state.collection.id) return;

    try {
      const priceToRarity = await getPriceToRarity(state.collection.id).then(
        (res) => res.priceToRarity || []
      );

      setListings(priceToRarity);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const memoizedListings = useMemo(() => {
    const groupByPrice = listings.reduce((group, asset) => {
      if (!asset) return null;

      const { price } = asset;
      group[price] = group[price] ?? [];
      group[price].push(asset);
      return group;
    }, {});

    return Object.entries(groupByPrice).map(([price, l]) => ({
      price,
      amount: l.length,
    }));
  }, [state.collection, listings]);

  return (
    <Box sx={{ borderRadius: '10px', backgroundColor: 'var(--bgColor)', p: 2 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          '@media screen and (max-width: 1000px)': {
            flexDirection: 'column',
            rowGap: 2,
          },
        }}
      >
        <span
          style={{
            color: 'var(--fontColor)',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Listings Spread
        </span>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
        </>
      ) : (
        <Chart {...options(memoizedListings)} />
      )}
    </Box>
  );
};

export default PriceListings;
