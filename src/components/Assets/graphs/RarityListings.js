import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/system';
import { Skeleton } from '@mui/material';
import MainCard from '../../MarketOverview/graphs/MainCard';
import { useAppContext } from 'context/AppContext';
import axios from 'axios';
import { colors } from 'components/MarketAnalysis/graphs/chart-data/graph-constants';
import { getPriceToRarity } from 'apiProvider';

const options = (data, totalListings) => ({
  height: 400,
  type: 'radialBar',
  series: data,
  options: {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          value: {
            show: true,
            color: 'var(--fontColor)',
            fontSize: 14,
            formatter: function (val) {
              return parseInt((val / 100) * totalListings) + ' Listings';
            },
          },
          total: {
            show: true,
            color: 'var(--fontColor)',
            label: 'Total Listings',
            formatter: function (w) {
              return totalListings + ' NFTs';
            },
          },
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (val, i) {
          return `${val}x`;
        },
      },
    },
    legend: {
      labels: { colors: 'var(--fontColor)' },
      show: true,
      position: 'bottom',
    },
    labels: ['Top 1%', 'Top 2%', 'Top 5%', 'Top 10%', 'Top 25%', 'Top 50%'],
    colors,
    markers: {
      colors,
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

const RarityListings = ({}) => {
  const theme = useTheme();
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
    const collectionRankPercent = state.collection.supply / 100;

    const getFloorRange = (rank) => {
      if (rank < collectionRankPercent) return ['1'];
      if (rank < collectionRankPercent * 2) return ['2'];
      if (rank < collectionRankPercent * 5) return ['5'];
      if (rank < collectionRankPercent * 10) return ['10'];
      if (rank < collectionRankPercent * 25) return ['25'];
      if (rank < collectionRankPercent * 50) return ['50'];

      return '100';
    };

    const floors = listings.reduce((a, { rarity_rank }) => {
      const range = getFloorRange(rarity_rank);

      a[range] = (a[range] || 0) + 1;

      return a;
    }, {});

    const series = Object.values(floors).slice(0, 6);

    const summed = series.map((value, index) => {
      const sumOfPastValues = series
        .slice(0, Math.max(index, 0))
        .reduce((a, b) => a + b, 0);

      return ((value + sumOfPastValues) / listings.length) * 100;
    });

    return summed;
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
          Listings Per Rarity
        </span>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
        </>
      ) : (
        <Chart {...options(memoizedListings, listings.length)} />
      )}
    </Box>
  );
};

export default RarityListings;
