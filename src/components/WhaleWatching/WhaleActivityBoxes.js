import { Box, Button, Divider, Grid, Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { getTopSales, getTrending } from 'apiProvider';
import InfiniteContainer from 'components/common/InfiniteContainer';
import { useCallback } from 'react';

const CollectionListItem = dynamic(
  () => import('components/CollectionListItem/CollectionListItem'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const TrendingListItem = dynamic(
  () => import('components/CollectionListItem/CollectionTrendingItem'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const TopSalesItem = dynamic(
  () => import('components/CollectionListItem/AssetTopSalesItem'),
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
      bookmarks
    />
  );
};

const trendingListItem = (item, index, arr) => {
  return (
    <TrendingListItem
      key={index}
      collection={item}
      isLast={index === 4}
      loading={!item}
      bookmarks
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
      bookmarks
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

const WhaleActivityBoxes = () => {
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
    <>
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', mt: 3 }}
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
            renderItem={trendingListItem}
            headerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
            headerTitle="Most bought"
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
            renderItem={trendingListItem}
            headerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
            headerTitle="Most Sold"
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
            headerTitle="Most Volume"
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
    </>
  );
};

export default WhaleActivityBoxes;
