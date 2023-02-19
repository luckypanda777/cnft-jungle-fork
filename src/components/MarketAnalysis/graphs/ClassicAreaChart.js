import { useState, useEffect } from 'react';
import {
  Button,
  capitalize,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';

// third-party
import Chart from 'react-apexcharts';
import MainCard from './MainCard';
import optionsArea from './chart-data/options-area-data';
import { useTheme, styled } from '@mui/material/styles';
import { getMarketplaces, getCollectionsAnalytics } from 'apiProvider';
import moment from 'moment';
import { nFormatter } from 'utils/formatCurrency';
import CustomTooltip from 'components/common/CustomTooltip';

const getTotalVolume = (series = []) => {
  return series.reduce((acc, cur) => {
    return acc + cur?.data.reduce((acc, cur) => acc + cur.y, 0);
  }, 0);
};

const ClassicAreaChart = ({ type, interval }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [series, setSeries] = useState([{ name: '', data: [] }]);

  const period =
    interval === '24h'
      ? 'hourly'
      : interval === '7d'
      ? 'daily'
      : interval === '30d'
      ? 'weekly'
      : 'monthly';

  useEffect(() => {
    getData();
  }, []);

  const formatSeries = (values = []) => {
    const date =
      period === 'hourly'
        ? 'hour'
        : period === 'daily'
        ? 'day'
        : period === 'weekly'
        ? 'day'
        : 'month';
    // Create an object with all the keys in it
    // This will return one object containing all keys the items

    if (!values.length) return [];

    let obj = [].concat
      .apply([], values)
      .reduce((res, item) => ({ ...res, ...item }));

    // Get those keys as an array
    let keys = Object.keys(obj);

    const withFilledKeys = values.map((day) => {
      let filled = [];

      // Use object destrucuring to replace all default values with the ones we have
      keys.forEach((key) => {
        const found = day.find((d) => {
          const [name, value] = Object.entries(d)[0];

          return name === key;
        });

        if (found) {
          filled.push({
            name: key,
            value: Object.values(found)[0],
          });
        } else {
          filled.push({ name: key, value: 0 });
        }
      });
      return filled;
    });

    const formatted = [];
    withFilledKeys.reverse().forEach((day) => {
      day.forEach((marketplace) => {
        const { name, value } = marketplace;
        const found = formatted.find((mkt) => mkt.name === name);
        if (found) {
          found.data.push(value);
        } else {
          formatted.push({ name, data: [value] });
        }
      });
    });

    const withFilledDates = formatted.map((marketplace) => {
      const { name, data } = marketplace;
      const withDates = data.map((d, i) => ({
        y: d,
        x: parseInt(moment().subtract(i, date).format('x')),
      }));

      return { name, data: withDates };
    });

    // sort withFilledDates by data array sum
    const sorted = withFilledDates.sort((a, b) => {
      const aSum = a.data.reduce((acc, cur) => acc + cur.y, 0);
      const bSum = b.data.reduce((acc, cur) => acc + cur.y, 0);

      return bSum - aSum;
    });

    return sorted;
  };

  const getData = async () => {
    try {
      const data = await getMarketplaces().then((res) => res?.data);

      setResponse(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (response) {
      setSeries(formatSeries(response?.[period]));
    }
  }, [interval, response]);

  const totalVolume = getTotalVolume(series);
  const avgVolume =
    totalVolume /
    (period === 'hourly'
      ? 24
      : period === 'daily'
      ? 7
      : period === 'weekly'
      ? 30
      : 12);

  return (
    <MainCard
      sx={{
        mt: 3,
        borderRadius: '10px',
        paddingTop: '0 !important',
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
                  <CustomTooltip title="Volume from Smart Contract interactions only, no escrow">
                    <Typography variant="subtitle2">
                      {capitalize(type)} average{' '}
                      {period === 'weekly' ? 'daily' : period} volume
                    </Typography>
                  </CustomTooltip>
                </Grid>
                <Grid item>
                  <Typography variant="h3">
                    {loading ? (
                      <CircularProgress size={25} sx={{ ml: 2 }} />
                    ) : (
                      `₳${nFormatter(avgVolume, 2)}`
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
                  'Top ' + series.length
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
              {...optionsArea({
                id: 'marketplace',
                name: 'marketplace',
                series: formatSeries(response?.[period]),
              })}
            />
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ClassicAreaChart;
