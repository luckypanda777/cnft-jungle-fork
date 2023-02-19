import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalMarketplaceVolume from './Skeleton/SkeletonTotalMarketplaceVolume';
import MainCard from './MainCard';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

const status = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'week',
    label: 'This Week',
  },
  {
    value: 'month',
    label: 'This Month',
  },
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalMarketplaceVolume = ({ isLoading }) => {
  const [value, setValue] = useState('today');
  const theme = useTheme();

  const primary = 'var(--textColor)';
  const darkLight = 'var(--textColor)';
  const grey200 = 'var(--textColor)';
  const grey500 = 'var(--textColor)';
  const primary200 = 'var(--textColor)';
  const primaryDark = 'var(--textColor)';
  const orangeMain = 'var(--textColor)';
  const secondaryDark = 'var(--textColor)';
  const secondary800 = 'var(--textColor)';
  const secondaryLight = 'var(--textColor)';

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [
        primary200,
        primaryDark,
        secondary800,
        secondaryLight,
        orangeMain,
        secondaryDark,
        grey500,
      ],
      xaxis: {
        labels: {
          style: {
            colors: [
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
            ],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary],
          },
        },
      },
      grid: {
        borderColor: grey200,
      },
      tooltip: {
        theme: 'dark',
      },
      legend: {
        labels: {
          colors: grey500,
        },
      },
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [
    primary200,
    primaryDark,
    secondary800,
    secondaryLight,
    primary,
    darkLight,
    grey200,
    isLoading,
    grey500,
  ]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketplaceVolume />
      ) : (
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">
                        Total marketplace volume
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">₳22.324m</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField
                    id="standard-select-currency"
                    select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default TotalMarketplaceVolume;
