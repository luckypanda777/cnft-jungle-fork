import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from './MainCard';
import SkeletonClassicLineGraph from './Skeleton/SkeletonClassicLineGraph';
import { nFormatter } from 'utils/formatCurrency';

const testChartData = ({ id, name, data = [], currencySymbol }) => ({
  type: 'line',
  height: 100,
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
      style: {
        fontSize: '10px',
      },
      formatter: function (val, opts) {
        return currencySymbol + nFormatter(val, 1);
      },
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    yaxis: {
      show: false,
      labels: {
        show: true,
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
        formatter: function (val) {
          return currencySymbol + val.toLocaleString();
        },
      },
    },
    markers: {
      size: 1,
    },
    colors: ['var(--primaryColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    fill: {
      type: ['solid', 'solid', 'solid'],
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
  },
  series: [{ name, data: data.map((d) => parseInt(d)) }],
});

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'var(--bgColor)',
  color: 'var(--fontColor)',
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

const ClassicLineGraph = ({ type, currency = 'ADA', isLoading, data = [] }) => {
  const theme = useTheme();

  const showCurrency = type !== 'sold';
  const currencySymbol = showCurrency ? (currency === 'ADA' ? '₳' : '$') : '';
  const graphName =
    type === 'sold' ? 'Total NFTs Sold' : currency + ' Market Volume';

  return (
    <>
      {isLoading ? (
        <SkeletonClassicLineGraph />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ px: 3, py: 1 }}>
            <Grid container direction="column">
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          sx={{
                            fontSize: { md: '2.125rem', sx: '1.75rem' },
                            fontWeight: 500,
                            mr: 1,
                            my: 0.75,
                          }}
                        >
                          {showCurrency && currencySymbol}
                          {showCurrency
                            ? nFormatter(
                                data.reduce((a, b) => a + b, 0),
                                2
                              )
                            : data.reduce((a, b) => a + b, 0)}
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
                  <Grid item xs={8} sx={{ zIndex: 100 }}>
                    <Chart
                      {...testChartData({
                        id: type + currency,
                        currencySymbol,
                        name: type,
                        data,
                      })}
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
