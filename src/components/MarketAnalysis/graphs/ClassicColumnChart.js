import { useState, useEffect } from 'react';
import {
  capitalize,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import MainCard from './MainCard';
import Chart from 'react-apexcharts';
import { getCollectionsAnalytics } from 'apiProvider';
import { nFormatter } from 'utils/formatCurrency';
import optionsColumn from './chart-data/options-column-data';

const ClassicColumnChart = ({ type, interval }) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [series, setSeries] = useState([]);

  const period =
    interval === '24h'
      ? 'daily'
      : interval === '7d'
      ? 'weekly'
      : interval === '30d'
      ? 'monthly'
      : 'yearly';

  useEffect(() => {
    getData();
  }, []);

  const formatSeries = (data) => {
    return data[period];
  };

  const getData = async () => {
    try {
      const data = await getCollectionsAnalytics().then((res) => res?.data);
      setResponse(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (response) {
      setSeries(formatSeries(response));
    }
  }, [interval, response]);

  const totalVolume = series.reduce((acc, cur) => acc + cur.volume, 0);

  return (
    <MainCard
      sx={{
        mt: 3,
        borderRadius: '10px',
        paddingTop: '0 !mportant',
      }}
    >
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
                    Top 15 collections total volume
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3">
                    {loading ? (
                      <CircularProgress size={25} sx={{ ml: 2 }} />
                    ) : (
                      `₳${nFormatter(totalVolume, 2)}`
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 5 }}>
                {loading ? (
                  <CircularProgress size={15} />
                ) : (
                  'Top ' + series?.length
                )}
              </span>
              <span>{capitalize(type) + 's'}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: { sm: 'flex', md: 'block' },
            justifyContent: { sm: 'center' },
          }}
        >
          {loading ? (
            <>
              <Skeleton height={5} sx={{ transform: 'none', my: 8.125 }} />
              <Skeleton height={5} sx={{ transform: 'none', my: 8.125 }} />
              <Skeleton height={5} sx={{ transform: 'none', my: 8.125 }} />
              <Skeleton height={5} sx={{ transform: 'none', my: 8.125 }} />
              <Skeleton height={5} sx={{ transform: 'none', my: 8.125 }} />
            </>
          ) : (
            <Chart
              {...optionsColumn({
                id: 'collections',
                name: 'collections',
                series: response?.[period].filter((c) => c.collection),
                interval,
              })}
            />
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ClassicColumnChart;
