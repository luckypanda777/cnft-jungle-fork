import { Box, FormControl, Grid, Skeleton, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import FullFloorHistoryChart from '../graphs/FullFloorHistoryChart';
import TradeHistoryScatterChart from '../graphs/TradeHistoryScatterChart';
import PriceToRariryScatterChart from '../graphs/PriceToRariryScatterChart';
import MainCard from '../../MarketOverview/graphs/MainCard';
import CollectionSalesHistory from './CollectionSalesHistory';
import GraphHeader from '../graphs/GraphHeader';
import ZoomableTimeseries from '../graphs/ZoomableTimeseries';
import ComingSoon from 'components/common/ComingSoon';
import RarityListings from '../graphs/RarityListings';
import RarityFloors from '../graphs/RarityFloors';
import FloorThickness from '../graphs/FloorThickness';
import { isMobile } from 'react-device-detect';
import PriceListings from '../graphs/PriceListings';

const CollectionAnalytics = () => {
  return (
    <Grid
      container
      xs={12}
      sx={{ width: '100%', marginLeft: 'auto', mt: 2, p: isMobile ? 0 : 2 }}
      justifyContent="space-between"
      rowGap={{ md: 3, sm: 3, xs: 3 }}
    >
      <Grid md={12} sm={12} xs={12} item>
        <PriceListings />
      </Grid>
      <Grid md={12} sm={12} xs={12} item>
        <PriceToRariryScatterChart />
      </Grid>
      <Grid
        md={12}
        sm={12}
        xs={12}
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          columnGap: 2,
          rowGap: 3,
        }}
      >
        <Grid md={5.9} sm={12} xs={12} item>
          <FloorThickness />
        </Grid>
        <Grid md={5.9} sm={12} xs={12} item>
          <RarityListings />
        </Grid>
      </Grid>
      <Grid md={12} sm={12} xs={12} item>
        <RarityFloors />
      </Grid>
      <Grid md={12} sm={12} xs={12} item>
        <FullFloorHistoryChart />
      </Grid>
      <Grid md={12} sm={12} xs={12}>
        <ZoomableTimeseries />
      </Grid>
      <Grid md={12} sm={12} xs={12} item>
        <TradeHistoryScatterChart />
      </Grid>
      <Grid md={12} sm={12} xs={12} item>
        <CollectionSalesHistory />
      </Grid>
    </Grid>
  );
};

export default CollectionAnalytics;
