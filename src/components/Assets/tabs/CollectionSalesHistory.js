import { Box } from '@mui/system';
import SaleListItem from 'components/modals/AssetModal/SaleListItem';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import MainCard from '../../MarketOverview/graphs/MainCard';
import { useAppContext } from 'context/AppContext';
import axios from 'axios';
import { getTradeHistory } from 'apiProvider';
import InfiniteContainer from 'components/common/InfiniteContainer';
import TopSalesItem from '../../CollectionListItem/AssetTopSalesItem';
import AssetModal from '../../modals/AssetModal/Modal';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import { Paper } from '@mui/material';

export const getSalesHistory = async (collectionId, { page, perPage }) => {
  return getTradeHistory(collectionId, {
    page,
    perPage,
    type: 'tradeHistory',
    period: '1w',
  })
    .then((res) => {
      return { data: res?.tradeHistory?.map((t) => ({ ...t, ...t.asset })) };
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const PaperComponent = (props) => (
  <Paper
    variant="outlined"
    elevation={0}
    {...props}
    style={{ maxHeight: 80 * 4 }}
  />
);

const CollectionSalesHistory = () => {
  const { state } = useAppContext();
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [trades, setTrades] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // modal
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sort, setSort] = useState({
    sort: 'score',
    sortDirection: 'asc',
  });

  const onChange = (value) => {
    setFilter(value);

    const newFiltered = trades.filter(
      (sale) =>
        sale.asset_id.toLowerCase().includes(value.toLowerCase()) ||
        sale.price == value ||
        sale.price + 'ADA' == value
    );

    if (newFiltered.length === 0) {
      setFiltered(trades);
    } else {
      setFiltered(newFiltered);
    }
  };

  const changeSalesSortBy = () => {
    const newSortBy = sortBy === 'recent' ? 'expensive' : 'recent';
    setSortBy(newSortBy);

    if (newSortBy === 'recent') {
      setFiltered(filtered.sort((a, b) => moment(b.time).diff(moment(a.time))));
    } else {
      setFiltered(filtered.sort((a, b) => b.price - a.price));
    }
  };

  const rowRenderer = ({ key, index, style }) => {
    return (
      <Box key={key} sx={{ ...style, height: 70 }}>
        <SaleListItem
          {...(filtered.length > 0 ? filtered : trades)[index]}
          index={index}
          isLast={
            index === (filtered.length > 0 ? filtered : trades).length - 1
          }
          loading={loading}
        />
      </Box>
    );
  };

  const handleClick = (asset) => {
    if (asset && (asset.image || asset.optimized_image)) {
      if (asset.optimized_image) {
        asset.optimized_image = imgOptimizerReplace(asset);
      } else {
        asset.image = imgOptimizerReplace(asset);
      }
    }

    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const item = (item, index) => {
    return (
      <TopSalesItem
        key={index}
        asset={item}
        isLast={index === 4}
        loading={!item}
        onClick={() => handleClick(item)}
        showTime
      />
    );
  };

  return (
    <Box sx={{ borderRadius: '10px', backgroundColor: 'var(--bgColor)', p: 2 }}>
      <InfiniteContainer
        component={PaperComponent}
        load={(pagination) => getSalesHistory(state.collection.id, pagination)}
        threshold={750}
        loadingItems={5}
        perPage={10}
        initialLoad={true}
        renderItem={item}
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
            Sales History
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
      />
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={state.collection}
        setOpenModal={setModalOpen}
        sort={sort}
      />
    </Box>
  );
};

export default CollectionSalesHistory;
