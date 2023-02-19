import { useContext } from 'react';
import { Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports

// chart data
import chartData from './chart-data/marketplaces-treemap-chart';

import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import optionsArea from './chart-data/options-area-data';
import { Box } from '@mui/system';

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

var data = generateDayWiseTimeSeries(new Date('22 Apr 2018').getTime(), 115, {
  min: 30,
  max: 900,
});

var options1 = {
  height: 400,
  width: '100%',
  options: {
    chart: {
      id: 'chart2',
      type: 'area',
      height: 400,
      width: '100%',
      foreColor: '#ccc',
      toolbar: {
        autoSelected: 'pan',
        show: false,
      },
    },
    colors: ['var(--primaryColor)'],
    stroke: {
      width: 3,
    },
    grid: {
      borderColor: '#555',
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      theme: 'dark',
      enabled: true,
      background: {
        enabled: true,
        foreColor: 'var(--whiteColor)',
      },
    },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 5,
      colors: ['#000524'],
      strokeColor: 'var(--primaryColor)',
      strokeWidth: 3,
    },

    tooltip: {
      theme: 'dark',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
    },
  },
  series: [
    {
      data: data,
    },
  ],
};

var options2 = {
  height: 200,
  width: '100%',
  options: {
    chart: {
      id: 'chart1',
      type: 'bar',
      width: '100%',
      height: 200,
      foreColor: '#ccc',
      brush: {
        target: 'chart2',
        enabled: true,
      },
      selection: {
        enabled: true,
        fill: {
          color: '#fff',
          opacity: 0.4,
        },
        xaxis: {
          min: new Date('27 Jul 2018 10:00:00').getTime(),
          max: new Date('14 Aug 2018 10:00:00').getTime(),
        },
      },
    },
    colors: ['var(--logoColor)'],

    stroke: {
      width: 2,
    },
    grid: {
      borderColor: '#444',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  },
  series: [
    {
      data: data,
    },
  ],
};

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const VolumeHistory = ({ isLoading, marketplace }) => {
  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketVolumeCard />
      ) : (
        <MainCard sx={{ borderRadius: '10px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ border: 'none', px: 2 }}
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">
                        History total volume
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">₳500.324m</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <span>12 Marketplaces</span>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...options1} />
              <Chart {...options2} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default VolumeHistory;
