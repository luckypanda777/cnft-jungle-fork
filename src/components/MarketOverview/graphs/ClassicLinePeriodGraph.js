import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './MainCard';
import SkeletonClassicLineGraph from './Skeleton/SkeletonClassicLineGraph';

// import ChartDataMonth from './chart-data/total-order-month-line-chart';
// import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

const testChartData = ({ id, name }) => ({
  type: 'line',
  height: 90,
  options: {
    chart: {
      id,
      sparkline: {
        enabled: true,
      },
      group: 'overview',
    },
    dataLabels: {
      theme: 'dark',
      enabled: true,
      background: {
        enabled: true,
        foreColor: 'var(--primaryColor)',
      },
    },
    colors: ['#fff'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: 'Total Order',
      },
      marker: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 15,
        right: 15,
      },
    },
  },
  series: [
    {
      name,
      data: [45, 66, 41, 89, 25, 44, 9, 54],
    },
  ],
});

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140,
    },
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70,
    },
  },
  borderRadius: 10,
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const ClassicLineGraph = ({
  type,
  currency = 'ADA',
  isLoading,
  interval,
  handleChangeTime,
}) => {
  const theme = useTheme();

  const currencySymbol = currency === 'ADA' ? '₳' : '$';
  const showCurrency = type !== 'sold';
  const graphName =
    type === 'sold' ? 'Total NFTs Sold' : currency + ' Market Volume';

  return (
    <>
      {isLoading ? (
        <SkeletonClassicLineGraph />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: 'var(--logoColor)',
                        color: '#fff',
                      }}
                    >
                      {type === 'sold' ? (
                        <LocalMallOutlinedIcon fontSize="inherit" />
                      ) : (
                        <GraphicEqOutlinedIcon fontSize="inherit" />
                      )}
                    </Avatar>
                  </Grid>
                  <Grid item sx={{ zIndex: 100 }}>
                    {['24h', '7d', '30d', '1y'].map((item, index) => (
                      <Button
                        dense
                        disableElevation
                        variant={interval === item ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          color: 'inherit',
                          backgroundColor:
                            interval === item && theme.palette.primary[600],
                          '&:hover': {
                            backgroundColor:
                              !interval === item && theme.palette.primary[700],
                          },
                          width: 25,
                        }}
                        onClick={(e) => handleChangeTime(e, item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          sx={{
                            fontSize: '2.125rem',
                            fontWeight: 500,
                            mr: 1,
                            mt: 1.75,
                            mb: 0.75,
                          }}
                        >
                          {showCurrency && currencySymbol}1.2M
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: theme.palette.primary[200],
                          }}
                        >
                          {graphName}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sx={{ zIndex: 100 }}>
                    <Chart
                      {...testChartData({ id: type + currency, name: type })}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default ClassicLineGraph;
