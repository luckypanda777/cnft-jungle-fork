import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';
import { nFormatter } from 'utils/formatCurrency';
import { getDailyVolume } from 'apiProvider';
import { colors } from './chart-data/graph-constants';

const options = (volume) => ({
  height: 500,
  series: [
    {
      name: 'Daily Volume',
      data: volume.map((day) => ({
        x: day.date,
        y: day.volume,
      })),
      type: 'column',
    },
    {
      name: 'Daily Sales',
      data: volume.map((day) => ({
        x: day.date,
        y: day.sales,
      })),
      type: 'line',
      color: 'var(--tertiaryColor)',
      marker: {
        size: 0,
      },
    },
  ],
  options: {
    chart: {
      animations: { enabled: false },
      annotations: {
        position: 'front',
        images: [
          {
            path: 'src/assets/icons/jungle.svg',
            width: 100,
            height: 100,
            x: 10,
            y: 10,
          },
        ],
      },
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'xy',
        autoScaleYaxis: true,
        autoScaleXaxis: true,
        zoomedArea: {
          fill: {
            color: 'var(--primaryColor)',
            opacity: 0.4,
          },
          stroke: {
            color: 'var(--tertiaryColor)',
            opacity: 0.4,
            width: 1,
          },
        },
      },
    },
    legend: {
      labels: { colors: ['var(--fontColor)'] },
      offsetY: 5,
      position: 'bottom',
      horizontalAlign: 'center',
      showForNullSeries: false,
      markers: {
        width: 12,
        height: 12,
        fillColors: colors,
      },
    },
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
    plotOptions: {
      bar: {
        columnWidth: '5px',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: [
      {
        title: {
          text: 'Daily Volume',
          style: {
            color: 'var(--fontColor)',
          },
        },
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
        // opposite: true,
      },
      {
        opposite: true,
        title: {
          text: 'Daily Sales',
          style: {
            color: 'var(--fontColor)',
          },
        },
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
      },
    ],
    tooltip: {
      theme: 'dark',
      y: [
        {
          title: {
            formatter: () => 'Daily Volume',
          },
          formatter: (value) => {
            return nFormatter(value, 2) + ' ADA';
          },
        },
        {
          title: {
            formatter: () => 'Daily Sales',
          },
          formatter: (value) => {
            return value.toLocaleString() + ' NFTs';
          },
        },
      ],
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: ['var(--primaryColor)'],
      width: 1,
      dashArray: 0,
    },
    markers: {
      size: 0,
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
  const [dailyVolumes, setDailyVolumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyVolumeHistory();
  }, []);

  const getDailyVolumeHistory = async () => {
    try {
      const info = await getDailyVolume().then(
        (res) => res.daily_volumes || []
      );

      setDailyVolumes(info);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const memoizedVolume = useMemo(() => {
    return dailyVolumes.filter((d) => d.date !== '2021-11-01');
  }, [dailyVolumes]);

  const highestVolume = useMemo(() => {
    return Math.max(...memoizedVolume.map((d) => d.volume));
  }, [memoizedVolume]);

  const highestSales = useMemo(() => {
    return Math.max(...memoizedVolume.map((d) => d.sales));
  }, [memoizedVolume]);

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
          Daily Volume and Sales
        </span>
        <Box
          sx={{
            display: 'flex',
            columnGap: 1,
            alignItems: 'center',

            color: 'var(--fontColor)',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          <span
            style={{
              border: '1px solid var(--rankGrey)',
              borderRadius: 10,
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* circle with primary color fill */}
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: 'var(--primaryColor)',
                marginRight: 5,
              }}
            />
            Highest Volume: {nFormatter(highestVolume, 2)} ADA
          </span>
          <span
            style={{
              border: '1px solid var(--rankGrey)',
              borderRadius: 10,
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: 'var(--tertiaryColor)',
                marginRight: 5,
              }}
            />
            Most Sales: {highestSales.toLocaleString()} NFTs
          </span>
        </Box>
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
        <Chart {...options(memoizedVolume)} />
      )}
    </Box>
  );
};

export default PriceListings;
