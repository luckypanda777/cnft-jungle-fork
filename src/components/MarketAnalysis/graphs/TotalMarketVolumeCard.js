import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';

// import ChartDataMonth from './chart-data/total-order-month-line-chart';
// import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';

const testChartData = {
  type: 'line',
  height: 90,
  options: {
    chart: {
      id: 'chart3',
      sparkline: {
        enabled: true,
      },
      group: 'overview',
    },
    dataLabels: {
      enabled: false,
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
  },
  series: [
    {
      name: 'floor',
      data: [45, 66, 41, 89, 25, 44, 9, 54],
    },
  ],
};

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
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalMarketVolumeCard = ({ isLoading }) => {
  const theme = useTheme();

  const [timeValue, setTimeValue] = useState('24h');
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketVolumeCard />
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
                        mt: 1,
                      }}
                    >
                      <GraphicEqOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                  <Grid item sx={{ zIndex: 100 }}>
                    {['24h', '7d', '30d', '1y'].map((item, index) => (
                      <Button
                        dense
                        disableElevation
                        variant={timeValue === item ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          color: 'inherit',
                          backgroundColor:
                            timeValue === item && theme.palette.primary[600],
                          '&:hover': {
                            backgroundColor:
                              !timeValue === item && theme.palette.primary[700],
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
                        {timeValue ? (
                          <Typography
                            sx={{
                              fontSize: '2.125rem',
                              fontWeight: 500,
                              mr: 1,
                              mt: 1.75,
                              mb: 0.75,
                            }}
                          >
                            ₳1.2M
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '2.125rem',
                              fontWeight: 500,
                              mr: 1,
                              mt: 1.75,
                              mb: 0.75,
                            }}
                          >
                            ₳9.2M
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: theme.palette.primary[200],
                          }}
                        >
                          Market Volume
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sx={{ zIndex: 100 }}>
                    <Chart {...testChartData} />
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

export default TotalMarketVolumeCard;
