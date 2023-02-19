import { Box, Grid, Paper } from '@mui/material';
import { useCallback, useState } from 'react';
import TopSalesItem from 'components/CollectionListItem/AssetTopSalesItem';
import InfiniteContainer from '../common/InfiniteContainer';
import { getTopSales, getTrending } from '../../apiProvider';
import dynamic from 'next/dynamic';
import GlobalTrendingsTraits from 'components/GlobalTrendingsTraits';
import { useRouter } from 'next/router';
import useWindowSize from 'hooks/useWindowSize';
import GlobalSnipedCollections from 'components/GlobalSnipedCollections';
import classNames from 'classnames';
import styles from '../Collections/Collections.module.scss';

const CollectionListItem = dynamic(
  () => import('../CollectionListItem/CollectionListItem'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const TrendingListItem = dynamic(
  () => import('../CollectionListItem/CollectionTrendingItem'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const getTrendingCollections = async ({ page, perPage, period, type }) => {
  return getTrending({
    period,
    page,
    perPage,
    type,
  })
    .then((res) => {
      return { data: res?.trending };
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const getTopSoldAssets = async ({ page, perPage, period }) => {
  return getTopSales({
    period,
    page,
    perPage,
  })
    .then((res) => {
      return { data: res?.data };
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const collectionListItem = (item, index, arr) => {
  return (
    <CollectionListItem
      collection={item}
      isLast={index === 4}
      loading={!item}
    />
  );
};

const trendingListItem = (item, index, tertiaryType = 'floor') => {
  return (
    <TrendingListItem
      key={index}
      collection={item}
      isLast={index === 4}
      loading={!item}
      tertiaryType={tertiaryType}
    />
  );
};

export const topSalesItem = (item, index, arr) => {
  return (
    <TopSalesItem
      key={index}
      asset={item}
      isLast={index === 4}
      loading={!item}
      infiniteBox
    />
  );
};

export const PaperComponent = (props) => (
  <Paper
    variant="outlined"
    elevation={0}
    {...props}
    style={{ maxHeight: 80 * 3 }}
  />
);

const MarketOverview = ({}) => {
  const volumeTrending = useCallback(
    (pagination) => getTrendingCollections({ ...pagination, type: 'volume' }),
    []
  );

  const largestFloor = useCallback(
    (pagination) => getTrendingCollections({ ...pagination, type: 'floor' }),
    []
  );

  const top24sales = useCallback(
    (pagination) => getTopSoldAssets({ ...pagination, period: '24h' }),
    []
  );

  return (
    <Grid
      container
      spacing={3}
      sx={{ width: '100%', mx: 'auto', paddingLeft: 0 }}
    >
      <div
        className={styles.sectionTitleContainer}
        style={{
          marginRight: 'auto',
          marginLeft: 'auto',
          marginBottom: 40,
        }}
      >
        <h1 className={classNames(styles.sectionTitle, styles.titleStatistics)}>
          Pattern
        </h1>
      </div>
      <Grid
        item
        xs={12}
        sx={{ width: '100%', paddingLeft: '0 !important', zIndex: 10 }}
      >
        <GlobalTrendingsTraits />
      </Grid>
      <Grid item xs={12} sx={{ width: '100%', paddingLeft: '0 !important' }}>
        <GlobalSnipedCollections />
      </Grid>
      <div
        className={styles.sectionTitleContainer}
        style={{ marginRight: 'auto', marginLeft: 'auto', marginBottom: 40 }}
      >
        <h1 className={classNames(styles.sectionTitle, styles.titleStatistics)}>
          Trending
        </h1>
      </div>
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', mt: 3, zIndex: 10 }}
        justifyContent="space-between"
        rowGap={{ md: 3, sm: 3, xs: 3 }}
      >
        <Grid item lg={3.9} md={3.9} sm={12} xs={12}>
          <InfiniteContainer
            component={PaperComponent}
            load={volumeTrending}
            threshold={750}
            loadingItems={4}
            perPage={10}
            initialLoad={true}
            renderItem={(item, index) => trendingListItem(item, index, 'floor')}
            headerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
            headerTitle="Volume Trending (24h)"
            headerTitleStyle={{
              color: 'var(--fontColor)',
              fontSize: 18,
              padding: 16,
            }}
            containerStyle={{
              backgroundColor: 'var(--sidebarBg)',
              borderRadius: '10px',
            }}
          />
        </Grid>
        <Grid item lg={3.9} md={3.9} sm={12} xs={12}>
          <InfiniteContainer
            component={PaperComponent}
            load={largestFloor}
            threshold={750}
            loadingItems={5}
            perPage={10}
            initialLoad={true}
            renderItem={(item, index) =>
              trendingListItem(item, index, 'volume')
            }
            headerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
            // filterButtons={[
            //   { name: '15m', label: '15m', param: 'period' },
            //   { name: '1h', label: '1h', param: 'period' },
            //   { name: '4h', label: '4h', param: 'period' },
            //   { name: '24h', label: '24h', param: 'period', default: true },
            //   { name: '7d', label: '7d', param: 'period' },
            //   { name: '30d', label: '30d', param: 'period' },
            // ]}
            headerTitle="Largest Floor Change (24h)"
            headerTitleStyle={{
              color: 'var(--fontColor)',
              fontSize: 18,
              padding: 16,
            }}
            containerStyle={{
              backgroundColor: 'var(--sidebarBg)',
              borderRadius: '10px',
            }}
          />
        </Grid>
        <Grid item lg={3.9} md={3.9} sm={12} xs={12}>
          <InfiniteContainer
            component={PaperComponent}
            load={top24sales}
            threshold={750}
            loadingItems={5}
            perPage={10}
            initialLoad={true}
            renderItem={topSalesItem}
            headerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
            headerTitle="Top Sales (24h)"
            headerTitleStyle={{
              color: 'var(--fontColor)',
              fontSize: 18,
              padding: 16,
            }}
            containerStyle={{
              backgroundColor: 'var(--sidebarBg)',
              borderRadius: '10px',
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MarketOverview;
