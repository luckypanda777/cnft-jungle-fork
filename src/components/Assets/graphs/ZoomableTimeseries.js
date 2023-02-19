import { capitalize, Skeleton, Box, FormControl, Button } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import VolumeHistoryChart from './VolumeHistoryChart';
import axios from 'axios';
import moment from 'moment';
import MainCard from 'components/MarketOverview/graphs/MainCard';
import { getTradeHistory } from 'apiProvider';

var options = ({ range, data, type }) => ({
  series: [{ data }],
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Stock Price Movement',
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
      title: {
        text: 'Price',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
    },

    dataLabels: {
      enabled: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
    markers: {
      size: 0,
    },
    colors: ['var(--primaryColor)', '#757575'],
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20,
        style: {
          colors: 'var(--fontColor)',
        },
      },
      range,
      type: 'datetime',
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
        labels: {
          formatter: (val) => val.toFixed(0),
        },
      },
    },
    legend: {
      show: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
  },
});

const FloorChart = () => {
  return <Chart {...floorLineChartOptions(floors)} />;
};

const ZoomableTimeseries = ({}) => {
  const { state } = useAppContext();

  const [floorVolumeHistory, setFloorVolumeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ name: '1w', label: 'weekHistory' });

  useEffect(() => {
    getVolumeFloorHisotry();
  }, [state.collection, range.name]);

  const getVolumeFloorHisotry = async () => {
    if (!state.collection.id) return;
    setLoading(true);

    try {
      const floorVolumeHistory = await getTradeHistory(state.collection.id, {
        period: range.name,
        type: 'floorVolumeHistory',
      }).then((res) => res.floorVolumeHistory || []);

      setFloorVolumeHistory(floorVolumeHistory);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const memoizedFloorsAndVolumes = useMemo(() => {
    const floorData = floorVolumeHistory.floors;
    const volumeData = floorVolumeHistory.volumes;
    const salesData = floorVolumeHistory.sales;

    return { floorData, volumeData, salesData };
  }, [state.collection, floorVolumeHistory, range.name]);

  const handleChange = (newRange) => {
    setRange(newRange);
  };

  if (
    memoizedFloorsAndVolumes?.volumeData?.length === 0 &&
    memoizedFloorsAndVolumes?.floorData?.length === 0 &&
    memoizedFloorsAndVolumes?.salesData?.length === 0 &&
    !loading
  ) {
    return (
      <div
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontFamily: 'newgilroymedium',
        }}
      >
        {' '}
        No data available.
      </div>
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
            color: 'var(--fontColor)',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Floor, Volume & Sales
        </span>
        <FormControl
          variant="standard"
          sx={{
            minWidth: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            '&:focus': { background: 'transparent' },
          }}
        >
          {[
            { name: '1d', label: 'dayHistory' },
            { name: '1w', label: 'weekHistory' },
            { name: '30d', label: 'monthHistory' },
            { name: '3m', label: 'threeMonthHistory' },
            { name: '1y', label: 'yearHistory' },
          ].map((item, index) => (
            <Button
              key={index}
              dense
              disableElevation
              variant={range.label === item.label ? 'contained' : 'text'}
              size="small"
              sx={{
                color:
                  range.label === item.label
                    ? 'var(--whiteColor)'
                    : 'var(--fontColor)',
                backgroundColor:
                  range.label === item.label && 'var(--primaryColor)',
                '&:hover': {
                  backgroundColor:
                    !range.label === item.label && 'var(--primaryColor)',
                },
                width: 25,
              }}
              onClick={() => handleChange(item)}
              disabled={loading}
            >
              {item.name}
            </Button>
          ))}
        </FormControl>
      </Box>
      {loading ? (
        <>
          <Box sx={{ py: 2 }}>
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
          </Box>
          <Box sx={{ py: 2 }}>
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
          </Box>
          <Box sx={{ py: 2 }}>
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 2 }} />
          </Box>
          <Box sx={{ py: 2 }}>
            <Skeleton height={5} sx={{ transform: 'none', my: 1 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 1 }} />
            <Skeleton height={5} sx={{ transform: 'none', my: 1 }} />
          </Box>
        </>
      ) : (
        <VolumeHistoryChart
          volumes={memoizedFloorsAndVolumes.volumeData}
          floors={memoizedFloorsAndVolumes.floorData}
          sales={memoizedFloorsAndVolumes.salesData}
          range={range.name}
        />
      )}
    </Box>
  );
};

export default ZoomableTimeseries;
