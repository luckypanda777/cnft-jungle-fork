import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/system';
import { IconButton, Skeleton } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { colors } from 'components/MarketAnalysis/graphs/chart-data/graph-constants';
import { getPriceToRarity } from 'apiProvider';
import CustomTooltip from 'components/common/CustomTooltip';

const labels = ['To 2x', 'To 3x', 'To 5x', 'To 10x', 'To 25x', 'To 50x'];

const options = (data, totalListings, currentFloor) => ({
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
              return parseInt((val / 100) * totalListings) + ' Sales';
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
    labels,
    colors,
    markers: {
      colors,
      size: 3,
      strokeWidth: 0,
      shape: 'circle',
      onClick: undefined,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.1,
      },
    },
    grid: {
      padding: {
        left: 20,
        right: 20,
      },
    },
  },
});

const FloorThickness = ({ textFormat = false }) => {
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
    const cheapestListing = listings.sort((a, b) => a.price - b.price)[0]
      ?.price;

    const getFloorRange = (price) => {
      if (price < cheapestListing * 2) return ['2x'];
      if (price < cheapestListing * 3) return ['3x'];
      if (price < cheapestListing * 5) return ['5x'];
      if (price < cheapestListing * 10) return ['10x'];
      if (price < cheapestListing * 25) return ['25x'];
      if (price < cheapestListing * 50) return ['50x'];

      return;
    };

    const floors = listings.reduce((a, { price }) => {
      const range = getFloorRange(price);

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

    return { series, summed };
  }, [state.collection, listings]);

  const currentFloor = listings.sort((a, b) => a.price - b.price)[0]?.price;

  if (textFormat) {
    return (
      <Box sx={{ px: 2 }}>
        {loading ? (
          <Skeleton variant="text" width={125} />
        ) : (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 18,
            }}
          >
            Floor Thickness
            <CustomTooltip
              title="How much sales is left for the collection to x multiple in price"
              placement="top"
            />
          </span>
        )}
        <Box
          sx={{
            display: 'flex',
            my: 2,
            rowGap: 0.25,
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          {(loading ? new Array(6).fill(0) : memoizedListings.series).map(
            (_, index) =>
              loading ? (
                <Skeleton variant="text" width={125} />
              ) : (
                <Box
                  sx={{
                    color: colors[index],
                    width: '50%',
                    textAlign: 'center',
                  }}
                >
                  {memoizedListings.series
                    .slice(0, index + 1)
                    .reduce((a, b) => a + b)}{' '}
                  Sales {labels[index].toLowerCase()}
                </Box>
              )
          )}
        </Box>
      </Box>
    );
  }

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
            display: 'flex',
            alignItems: 'center',
            fontSize: 18,
          }}
        >
          Floor Thickness
          <CustomTooltip
            title="How much sales is left for the collection to x multiple in price"
            placement="top"
          />
        </span>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 11 }} />
        </>
      ) : (
        <Chart
          {...options(memoizedListings.summed, listings.length, currentFloor)}
        />
      )}
    </Box>
  );
};

export default FloorThickness;
