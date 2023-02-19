import { Grid } from '@mui/material';
import { getMarketStats } from 'apiProvider';
import SkeletonPriceBox from 'components/MarketOverview/graphs/Skeleton/SkeletonPriceBox';
import React, { useEffect, useState } from 'react';
import ClassicLineGraph from './ClassicLinePeriodGraph';
import axios from 'axios';

const LineBoxes = ({ interval }) => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState({ ada: [], usd: [], sales: [] });

  useEffect(() => {
    getData();
  }, [interval]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await getMarketStats().then((res) => res.data);
      const usdHistory = await axios
        .get(
          `https://cnft-predator.herokuapp.com/usd-history?interval=${interval}`
        )
        .then((res) => res.data.data);

      const matchInterval =
        interval === '24h'
          ? 'hourly'
          : interval === '7d'
          ? 'daily'
          : interval === '30d'
          ? 'weekly'
          : 'monthly';

      if (matchInterval === 'monthly') {
        usdHistory = usdHistory?.slice(12 - res.ada[matchInterval].length, 12);
      }

      res.usd[matchInterval] = usdHistory
        .map((usdPrice, index) => {
          return res.ada[matchInterval]?.[index] * usdPrice;
        })
        .filter((n) => n);

      setSeries({
        ada: res.ada?.[matchInterval],
        usd: res.usd?.[matchInterval],
        sales: res.sales?.[matchInterval],
      });
    } catch (err) {
      console.log(err);
      setSeries({ ada: [], usd: [], sales: [] });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <SkeletonPriceBox />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <SkeletonPriceBox />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <SkeletonPriceBox />
        </Grid>
      </Grid>
    );
  }

  const period =
    interval === '24h'
      ? 'hourly'
      : interval === '7d'
      ? 'daily'
      : interval === '30d'
      ? 'weekly'
      : 'monthly';

  return (
    <Grid container spacing={3}>
      <Grid item lg={4} md={12} sm={12} xs={12}>
        <ClassicLineGraph data={series?.ada} type="volume" currency="ADA" />
      </Grid>
      <Grid item lg={4} md={12} sm={12} xs={12}>
        <ClassicLineGraph data={series?.usd} type="volume" currency="USD" />
      </Grid>
      <Grid item lg={4} md={12} sm={12} xs={12}>
        <ClassicLineGraph data={series?.sales} type="sold" />
      </Grid>
    </Grid>
  );
};

export default LineBoxes;
