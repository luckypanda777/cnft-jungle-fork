import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  capitalize,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import { shorten } from 'utils/shorten';
import {
  AutoSizer,
  InfiniteLoader,
  Column,
  Table,
  SortDirection,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import styles from './CollectionTable.module.scss';
import classNames from 'classnames';
import DefaultListItemText from '../CollectionListItem/ListItemText';
import { nFormatter } from 'utils/formatCurrency';
import dynamic from 'next/dynamic';
import ListPeriodFilters from '../filters/ListPeriodFilters';
import { eventTrack } from 'config/analytics';
import { useRouter } from 'next/router';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { useAppContext } from '../../context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const SimpleLineGraph = dynamic(() => import('./graphs/SimpleGraph'), {
  ssr: false,
});

const FIXED_TABLE_WIDTH = 1500;

function HeaderRowRenderer({ className, columns, style }) {
  return (
    <div
      className={classNames(className, styles.headerRow)}
      role="row"
      style={style}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          '& > div:not(:first-child)': {
            textAlign: 'center',
          },
        }}
      >
        {columns}
      </Box>
    </div>
  );
}

class VirtualizedTable extends React.PureComponent {
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      sortBy: 'timestamp_volume',
      sortDirection: SortDirection.DESC,
    };

    this.renderValue = this.renderValue.bind(this);
    this.renderCollection = this.renderCollection.bind(this);
    this.renderListings = this.renderListings.bind(this);
    this.sort = this.sort.bind(this);
    this.cellDataGetter = this.cellDataGetter.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
  }

  // update grid on new items length
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.table) {
      this.table.forceUpdateGrid();
    }
  }

  onRowClick = ({ event, rowData }) => {
    if (!rowData) return;
    const link = `/collections/${rowData?.policies}`;
    if (event.metaKey) {
      return window.open(link, '_blank');
    }

    this.props.onRouter(link);
  };

  sort = ({ sortBy }) => {
    const sortDirection =
      this.state.sortDirection === SortDirection.ASC ||
      this.state.sortBy !== sortBy
        ? SortDirection.DESC
        : SortDirection.ASC;

    try {
      eventTrack('table', 'sort', `${sortBy}-${sortDirection}`);
    } catch (err) {}

    this.setState({ sortBy, sortDirection });
    this.props.setPage(1);
    this.props.setFilters((prevState) => ({
      ...prevState,
      perPage: 50,
      sort: sortBy === 'collection' ? 'timestamp_volume' : sortBy,
      sortDirection: sortDirection.toLowerCase(),
      upcoming: false,
      mintingNow: false,
    }));
  };

  cellDataGetter = (columnData, dataKey, rowData) => {
    if (!rowData) return;

    if (typeof rowData.get === 'function') {
      return rowData.get(dataKey);
    } else {
      return rowData[dataKey];
    }
  };

  renderCollection = (props) => {
    const { rowData, rowIndex } = props;

    if (!rowData || this.props.loading) {
      return (
        <Box sx={{ display: 'flex' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box
            sx={{
              flexGrow: 1,
              marginLeft: '12px',
            }}
          >
            <Skeleton animation="wave" height={22} width="90%" />
            <Skeleton animation="wave" height={22} width="60%" />
          </Box>
        </Box>
      );
    }

    const sortOrFilerLoading = false;

    const {
      optimized_image,
      image,
      supply,
      collection_name,
      policies,
      featured,
    } = rowData;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          fontFamily: 'newgilroymedium',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginRight: '12px',
            fontSize: '16px',
          }}
        >
          <span>{rowIndex + 1}</span>
        </Box>
        {!image && !optimized_image ? (
          <Avatar sx={avatarStyle}>
            <ImageWithErrorHandler
              src="assets/catunsupported.webp"
              alt="unsupported"
              style={{
                width: 45,
                height: 45,
                objectFit: 'var(--objectFit)',
              }}
              layout="fill"
            />
          </Avatar>
        ) : (
          <Avatar alt={collection_name} sx={avatarStyle}>
            <ImageWithErrorHandler
              src={optimized_image || image}
              alt="unsupported"
              style={{
                width: 45,
                height: 45,
                objectFit: 'var(--objectFit)',
              }}
              nextImg
              layout="fill"
            />
          </Avatar>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span variant="body1">
            <span
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                width: 100,
              }}
            >
              {shorten(collection_name || policies, 25)}
            </span>
          </span>
          <Box
            sx={{
              display: 'flex',
              columnGap: 0.5,
              fontSize: 12,
              justifyContent: 'flex-start',
              textAlign: 'left',
              fontFamily: 'newgilroysemibold',
              letterSpacing: 0.25,
            }}
          >
            <span style={{ color: 'var(--rankGrey)' }}>Supply: </span>
            {sortOrFilerLoading ? (
              <CircularProgress size={15} sx={{ color: 'var(--logoColor)' }} />
            ) : (
              <span> {supply || '0'} NFTs</span>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  renderListings = ({ rowData }) => {
    if (!rowData || this.props.loading) {
      return <Skeleton animation="wave" height={22} width="90%" />;
    }

    const { listings, supply } = rowData;
    const sortOrFilerLoading = false;
    const nfts = listings ? listings : undefined;
    const isAll = this.props.filters && this.props.filters.period === 'all';

    return (
      <DefaultListItemText
        loading={sortOrFilerLoading}
        value={nfts ? `${nfts} NFTs` : ''}
        defaultValue="None"
        postfix={
          nfts && !isAll ? `/ ${Math.round((nfts / supply) * 100)}%` : ''
        }
        style={{ width: 100 }}
        textStyle={{
          textAlign: 'center',
          fontFamily: 'newgilroymedium',
        }}
      />
    );
  };

  renderValue =
    (field) =>
    ({ rowData }) => {
      const sortOrFilerLoading = false;
      const isAll = this.props.filters && this.props.filters.period === 'all';

      if (!rowData || this.props.loading) {
        return <Skeleton animation="wave" height={22} width="90%" />;
      }

      if (field === 'floor_history') {
        if (!rowData.floor_history)
          return (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 14 }}>No History</span>
            </div>
          );

        return <SimpleLineGraph name="floor" data={rowData.floor_history} />;
      }

      if (field === 'volume_history') {
        if (!rowData.volume_history)
          return <span style={{ fontSize: 14 }}>No History</span>;

        return (
          <SimpleLineGraph
            name="volume"
            data={rowData.volume_history}
            type="bar"
          />
        );
      }

      const adaFields = [
        'floor_sale',
        'timestamp_volume',
        'average_price',
        'market_cap',
        'floor',
      ];

      const change = rowData?.[field + '_change'];
      const changeColor =
        change > 0
          ? 'var(--undervaluedColor)'
          : change < 0
          ? 'var(--overvaluedColor)'
          : 'goldenrod';
      const plus = change > 0 ? '+' : '';

      return (
        <DefaultListItemText
          loading={sortOrFilerLoading}
          value={
            rowData?.[field] && rowData?.[field] > 0
              ? nFormatter(rowData?.[field], 1)
              : null
          }
          prefix={adaFields.includes(field) && rowData?.[field] ? '₳' : ''}
          postfix={
            field === 'floor' || isAll
              ? undefined
              : rowData?.[field]
              ? !isNaN(change) && (
                  <span
                    style={{
                      fontSize: 12,
                      color: changeColor,
                      fontWeight: 'normal',
                    }}
                  >
                    {change
                      ? `(${plus}${(change * 100).toFixed(2)}%)`
                      : '(=0%)'}
                  </span>
                )
              : 'No Sales'
          }
          //style={{ width: 100 }}
          textStyle={{
            textAlign: 'center',
            fontFamily: 'newgilroymedium',
          }}
        />
      );
    };

  isRowLoaded = ({ index }) => {
    return !!this.props.collections[index];
  };

  render() {
    const { sortBy, sortDirection } = this.state;
    const {
      rowHeight,
      isMobile,
      loading,
      handleFilterChange,
      fetchCollectionTable,
      totalCollections,
      collections,
      ...tableProps
    } = this.props;

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={fetchCollectionTable}
        rowCount={1000000}
        threshold={1}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => {
              const tableWidth =
                width !== 0 && width < FIXED_TABLE_WIDTH
                  ? FIXED_TABLE_WIDTH
                  : width;

              return (
                <>
                  {isMobile ? (
                    <ListPeriodFilters
                      style={{ width: tableWidth }}
                      loading={loading}
                      handleFilterChange={handleFilterChange}
                    />
                  ) : null}
                  <Table
                    onRowsRendered={onRowsRendered}
                    ref={(ref) => {
                      this.table = ref;
                      registerChild(ref);
                    }}
                    headerRowRenderer={HeaderRowRenderer}
                    onRowClick={this.onRowClick}
                    headerHeight={50}
                    height={height}
                    width={tableWidth}
                    //autoHeight
                    rowHeight={rowHeight}
                    className={'collectionsTable'}
                    gridStyle={{ direction: 'inherit' }}
                    rowStyle={{ cursor: 'pointer' }}
                    rowClassName={styles.virtualizedRow}
                    sort={this.sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    {...tableProps}
                  >
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Collection</span>
                        </div>
                      }
                      width={400}
                      dataKey="collection"
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderCollection}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Floor</span>
                          <CustomTooltip title="Cheapest currently available asset for sale." />
                        </div>
                      }
                      dataKey="floor"
                      width={130}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('floor')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Sales Floor</span>
                          <CustomTooltip title="Lowest recorded sale in the selected time period." />
                        </div>
                      }
                      dataKey="floor_sale"
                      width={225}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('floor_sale')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Sales</span>
                          <CustomTooltip title="Amount of sold NFTs in the selected time period." />
                        </div>
                      }
                      dataKey="count_sales"
                      width={150}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('count_sales')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Volume</span>
                          <CustomTooltip title="Total volume traded in the selected time period." />
                        </div>
                      }
                      dataKey="timestamp_volume"
                      width={200}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('timestamp_volume')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Avg. Price</span>
                          <CustomTooltip title="Average price for currently listed collection NFTs." />
                        </div>
                      }
                      dataKey="average_price"
                      width={200}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('average_price')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Mkt. Cap</span>
                          <CustomTooltip title="Market Cap = Floor * Supply." />
                        </div>
                      }
                      dataKey="market_cap"
                      width={170}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('market_cap')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>Listings/%</span>
                          <CustomTooltip title="Currently listed for sale NFTs and percentage of total supply." />
                        </div>
                      }
                      dataKey="listings"
                      width={200}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderListings}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>7d Floor</span>
                          <CustomTooltip title="Last 7 day floor history." />
                        </div>
                      }
                      dataKey="floor_history"
                      width={200}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('floor_history')}
                    />
                    <Column
                      label={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'newgilroymedium',
                          }}
                        >
                          <span>7d Volume</span>
                          <CustomTooltip title="Last 7 day volume history." />
                        </div>
                      }
                      dataKey="volume_history"
                      width={200}
                      cellDataGetter={this.cellDataGetter}
                      cellRenderer={this.renderValue('volume_history')}
                    />
                  </Table>
                </>
              );
            }}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}

const CollectionTable = ({ collections = [], ...other }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;

  const onRouter = (link) => {
    router.push(link);
  };

  return (
    <div className={styles.tableWrap}>
      <VirtualizedTable
        rowCount={collections.length}
        onRouter={onRouter}
        rowHeight={80}
        rowGetter={({ index }) => collections[index]}
        collections={collections}
        isMobile={isMobile}
        {...other}
      />
    </div>
  );
};

export default CollectionTable;
