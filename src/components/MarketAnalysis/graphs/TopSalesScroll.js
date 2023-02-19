import React, { useEffect, useMemo } from 'react';
import { getTopSales } from 'apiProvider';
import {
  getTopSoldAssets,
  PaperComponent,
} from 'components/MarketOverview/MarketOverview';
import InfiniteContainer from 'components/common/InfiniteContainer';
import AssetTopSalesItem from 'components/CollectionListItem/AssetTopSalesItem';

const topSalesItem = (item, index, arr) => {
  return (
    <AssetTopSalesItem
      key={index}
      asset={item}
      isLast={index === 4}
      loading={!item}
      // showTime
    />
  );
};

const TopSalesScroll = ({ interval }) => {
  return (
    <InfiniteContainer
      component={PaperComponent}
      load={(pagination) =>
        getTopSoldAssets({ ...pagination, period: interval })
      }
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
      // filterButtons={[
      //   { name: '15m', label: '15m', param: 'period' },
      //   { name: '1h', label: '1h', param: 'period' },
      //   { name: '4h', label: '4h', param: 'period' },
      //   { name: '24h', label: '24h', param: 'period', default: true },
      //   { name: '7d', label: '7d', param: 'period' },
      //   { name: '30d', label: '30d', param: 'period' },
      // ]}
      headerTitle={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          Top Sales ({interval})
        </span>
      }
      headerTitleStyle={{
        color: 'var(--fontColor)',
        fontSize: 18,
        padding: 16,
      }}
      containerStyle={{
        backgroundColor: 'var(--sidebarBg)',
        borderRadius: '10px',
        width: '100%',
      }}
      shouldRerender={interval}
    />
  );
};

export default TopSalesScroll;
