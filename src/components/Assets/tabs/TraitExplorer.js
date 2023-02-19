import React, { useEffect, useRef, useState } from 'react';
import styles from '../Assets.module.scss';
import AssetModal from 'components/modals/AssetModal';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  getCollectionExplorer,
  getCollectionExplorerSales,
} from '../../../apiProvider';
import { shorten } from 'utils/shorten';
import Card from 'components/cards/AssetCard';
import { capitalize } from 'utils/capitalize';
import useWindowSize from 'hooks/useWindowSize';
import FilterAccordion from 'components/common/FilterAccordion';
import FilterInput from 'components/common/Input';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useAppContext } from 'context/AppContext';
import useDebounce from '../../../hooks/useDebounce';
import {
  AutoSizer,
  List,
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized';
import PredatorSwitch from 'components/Assets/graphs/PredatorSwitch';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import SalesCard from 'components/cards/SalesCard';
import CustomTooltip from 'components/common/CustomTooltip';

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
    <CircularProgress />
  </Box>
);

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
});

const getIndexes = (list, index) => {
  // example
  // index 0 - 79
  // list = [ {..., values: [40]}, {..., values: [15]}, {..., values: [25]} ];
  // return colIdx: 4, rowIdx: 1

  let totalLength = 0;
  let columnIndex = 0;
  let rowIndex = 0;

  if (index === 0) {
    return { columnIndex, rowIndex };
  }

  list.every((row, i) => {
    totalLength += row.values.length;

    if (index < totalLength) {
      rowIndex = i;
      columnIndex = row.values.length - (totalLength - index);
      return false;
    }

    return true;
  });
  return { rowIndex, columnIndex };
};

const TraitRow = ({
  traitItems,
  traitPercentage,
  traitValue,
  data,
  handleOpenModal,
  isSaleHistory,
}) => {
  const { width } = useWindowSize();

  data = data.map((asset) => {
    if (asset && (asset.image || asset.optimized_image)) {
      if (asset.optimized_image) {
        asset.optimized_image = imgOptimizerReplace(asset);
      } else {
        asset.image = imgOptimizerReplace(asset);
      }
    }

    return asset;
  });

  const cheapest = data[0];
  const rest = data.slice(1, 4);

  if (!cheapest) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <span>{traitValue}</span>
        <span>No assets found</span>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 2 }}>
      <h2 className={styles.traitName}>
        {capitalize(traitValue)}
        {cheapest &&
          (cheapest.listing_price || cheapest.sale_price
            ? ` / ${cheapest.listing_price || cheapest.sale_price} ADA ${
                isSaleHistory ? 'Most Recent Sale' : 'Floor'
              }`
            : ' / No Floor')}
        {traitItems && ` / ${traitItems} Assets`}
        {traitPercentage && ` (${traitPercentage}% chance)`}
      </h2>
      <Box
        className={styles.traitExplorerCards}
        sx={{ justifyContent: rest.length > 1 ? 'flex-start' : 'center' }}
      >
        {cheapest &&
          (isSaleHistory ? (
            <SalesCard
              {...cheapest}
              loading={!cheapest}
              style={{ margin: '10px' }}
              className={styles.cheapestCard}
              onClick={() => handleOpenModal(cheapest)}
              sort={{}}
              showRanks
              collectionTraits={cheapest.collection_traits || {}}
              forceSmallDisplay
              showRarestTrait={false}
              showPurchasePopover
            />
          ) : (
            <Card
              {...cheapest}
              loading={!cheapest}
              style={{ margin: '10px' }}
              className={styles.cheapestCard}
              onClick={() => handleOpenModal(cheapest)}
              sort={{}}
              showRanks
              collectionTraits={cheapest.collection_traits || {}}
              forceSmallDisplay
              showRarestTrait={false}
              showPurchasePopover
            />
          ))}
        {rest.length > 1 && (
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: 'auto 24px', height: 250 }}
          />
        )}
        {rest.map((asset, i) =>
          isSaleHistory ? (
            <SalesCard
              key={i}
              {...asset}
              loading={!asset}
              style={{ margin: '10px' }}
              onClick={() => handleOpenModal(asset)}
              sort={{}}
              showRanks
              collectionTraits={asset.collection_traits || {}}
              forceSmallDisplay
              showRarestTrait={false}
              showPurchasePopover
            />
          ) : (
            <Card
              key={i}
              {...asset}
              loading={!asset}
              style={{ margin: '10px' }}
              onClick={() => handleOpenModal(asset)}
              sort={{}}
              showRanks
              collectionTraits={asset.collection_traits || {}}
              forceSmallDisplay
              showRarestTrait={false}
              showPurchasePopover
            />
          )
        )}
      </Box>
    </Box>
  );
};

const filterFloors = (floors) => {
  return Object.entries(floors).map(([traitKey, traitValue]) => {
    return {
      traitKey,
      values: Object.entries(traitValue)
        .map(([key, value]) => {
          return {
            traitValue: key,
            data: value,
          };
        })
        .filter(({ data }) => data.length), // filter out empty traits
    };
  });
};

const TraitExplorer = ({
  collection,
  collectionData,
  openModal,
  collectionRoute,
  navigateToAsset,
  handleTraitFilterFromModal,
  sort = {},
  minMaxFilters = {},
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [filterWord, setFilterWord] = useState('');
  const { width } = useWindowSize();
  const { state, setLocalFilters } = useAppContext();
  const { isMobile } = state;
  const [sortBy, setSortBy] = useState('name');
  const debouncedQuery = useDebounce(filterWord, 400);

  const [view, setView] = useState('traits');
  const [data, setData] = useState({ traits: [], sales: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);

  const listRef = useRef(null);

  const changePortfolioSortBy = () => {
    const newSortBy = sortBy === 'expensive' ? 'name' : 'expensive';
    setSortBy(newSortBy);

    if (newSortBy === 'expensive') {
      setFilteredData(
        [].concat(
          filteredData.sort((a, b) => {
            if (view === 'sales') {
              return (
                b.values.sort((val1, val2) => {
                  return (
                    val2.data.sort((d1, d2) => {
                      return d2.sale_price - d1.sale_price;
                    })[0].sale_price -
                    val1.data.sort((d1, d2) => {
                      return d2.sale_price - d1.sale_price;
                    })[0].sale_price
                  );
                })[0].data[0].sale_price -
                a.values.sort((val1, val2) => {
                  return (
                    val2.data.sort((d1, d2) => {
                      return d2.sale_price - d1.sale_price;
                    })[0].sale_price -
                    val1.data.sort((d1, d2) => {
                      return d2.sale_price - d1.sale_price;
                    })[0].sale_price
                  );
                })[0].data[0].sale_price
              );
            }

            return (
              b.values.sort((val1, val2) => {
                return (
                  val2.data.sort((d1, d2) => {
                    return d2.listing_price - d1.listing_price;
                  })[0].listing_price -
                  val1.data.sort((d1, d2) => {
                    return d2.listing_price - d1.listing_price;
                  })[0].listing_price
                );
              })[0].data[0].listing_price -
              a.values.sort((val1, val2) => {
                return (
                  val2.data.sort((d1, d2) => {
                    return d2.listing_price - d1.listing_price;
                  })[0].listing_price -
                  val1.data.sort((d1, d2) => {
                    return d2.listing_price - d1.listing_price;
                  })[0].listing_price
                );
              })[0].data[0].listing_price
            );
            //return (b.traitKey || 0) - (a.traitKey || 0)
          })
        )
      );
    } else {
      setFilteredData(
        filteredData.sort((a, b) =>
          a.traitKey?.toLowerCase() > b.traitKey?.toLowerCase() ? 1 : -1
        )
      );
    }
  };

  const handleOpenModal = (asset) => {
    setOpenModal(true);
    setCurrentAsset(asset);
  };

  useEffect(() => {
    if (filterWord) {
      const filtered = filteredData
        .filter(({ values }) => {
          return values.some(({ traitValue }) =>
            traitValue.toLowerCase().includes(filterWord.toLowerCase())
          );
        })
        .map(({ traitKey, values }) => {
          return {
            traitKey,
            values: values.filter(({ traitValue }) =>
              traitValue.toLowerCase().includes(filterWord.toLowerCase())
            ),
          };
        });

      setFilteredData(filtered);
    } else {
      setFilteredData(data.traits);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    cache.clearAll();
    if (listRef && listRef.current) {
      listRef.current.forceUpdateGrid();
    }
  }, [filteredData]);

  useEffect(() => {
    if (view === 'sales' && !data.sales.length) {
      return fetchData('sales');
    } else if (view === 'traits' && !data.traits.length) {
      return fetchData('traits');
    }

    if (data.sales.length && data.traits.length) {
      setFilteredData([...data[view]]);
    }
  }, [view]);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const getData =
        type === 'traits' ? getCollectionExplorer : getCollectionExplorerSales;

      const { floors } = await getData(collectionData.collection.id);

      setData((prev) => ({ ...prev, [type]: [...filterFloors(floors)] }));
      setFilteredData([...filterFloors(floors)]);
    } catch (err) {
      console.log(err);
      setData((prev) => ({ ...prev, [type]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const handleSales = (e) => {
    setView(e.target.checked ? 'sales' : 'traits');
  };

  const rowRenderer = ({ index, key, parent, style }) => {
    const { columnIndex, rowIndex } = getIndexes(filteredData, index);

    const { traitKey, values } = filteredData[rowIndex];
    const { traitValue } = values[columnIndex];

    const traitItems =
      collectionData?.collection?.traitlist?.[traitKey]?.[traitValue] || 0;

    const traitPercentage = (
      (traitItems / collectionData?.collection?.supply) *
      100
    ).toFixed(2);

    return (
      <CellMeasurer cache={cache} key={key} rowIndex={index} parent={parent}>
        {({ measure, registerChild }) => (
          <div ref={registerChild} style={style}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {columnIndex === 0 && (
                <Box
                  sx={{
                    margin: rowIndex > 0 ? '42px 0' : 0,
                    width: '100%',
                    mb: 2,
                  }}
                >
                  <Divider>
                    <Chip
                      sx={{
                        height: 42,
                        borderRadius: '6px',
                        pl: 5,
                        pr: 5,
                        py: 3,
                        border: '3px solid var(--primaryColor)',
                        background: 'var(--tabBg)',
                      }}
                      label={
                        <>
                          <h2 className={styles.traitType}>
                            {capitalize(shorten(traitKey || 'Unknown', 30))}
                          </h2>
                          <span className={styles.traitExplorerHightlight}>
                            ({values.length} traits)
                          </span>
                        </>
                      }
                    />
                  </Divider>
                </Box>
              )}

              <Box className={styles.traitExplorerRow}>
                <TraitRow
                  traitItems={traitItems}
                  traitPercentage={traitPercentage}
                  handleOpenModal={handleOpenModal}
                  traitValue={traitValue}
                  data={values[columnIndex].data}
                  index={columnIndex}
                  isSaleHistory={view === 'sales'}
                />
              </Box>
            </Box>
          </div>
        )}
      </CellMeasurer>
    );
  };

  const GroupedByTraitKey = () => {
    if (filteredData.length === 0 && !loading) {
      return (
        <Box className={width > 1200 ? styles.galleryLarge : styles.gallery}>
          <Box
            className={styles.traits}
            sx={{ alignItems: 'center', fontSize: 18, marginTop: 2 }}
          >
            No traits found
          </Box>
        </Box>
      );
    }

    const rowCount = filteredData.reduce(
      (prev, curr) => prev + curr.values.length,
      0
    );

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={listRef}
                autoHeight
                width={width}
                height={height}
                isScrolling={isScrolling}
                deferredMeasurementCache={cache}
                rowCount={rowCount}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  };

  return (
    <>
      <FilterAccordion
        style={isMobile && { width: 310, ml: '-27.5%', mr: 'auto' }}
      >
        <Box className={styles.galleryFilters}>
          <Box className={styles.mainFilters}>
            <Box className={styles.assetFilter}>
              <Box className={styles.filterContainer}>
                <FilterInput
                  placeholder="Search Traits"
                  name="filterTraitsQuery"
                  //value={filterWord}
                  onChange={(e) => setFilterWord(e.target.value)}
                />
                <CustomTooltip
                  title={
                    sortBy === 'expensive'
                      ? 'Most Extensive First'
                      : 'Order by Name'
                  }
                >
                  <Button
                    sx={{
                      fontSize: 10,
                      width: 100,
                      alignItems: 'center',
                      borderRadius: 2,
                      mr: 2,
                      ml: 1,
                      height: 32.5,
                    }}
                    onClick={changePortfolioSortBy}
                    variant="contained"
                  >
                    {sortBy === 'expensive'
                      ? 'Name'
                      : view === 'sales'
                      ? 'Price'
                      : 'Floor'}
                    <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                  </Button>
                </CustomTooltip>
                <CustomTooltip
                  title={`Toggle to show ${
                    view === 'sales' ? 'listings' : 'sales'
                  } instead of ${view === 'sales' ? 'sales' : 'listings'}`}
                >
                  <Box>
                    <PredatorSwitch onChange={handleSales} name="Sales" />
                  </Box>
                </CustomTooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </FilterAccordion>
      <Box className={width > 1200 ? styles.galleryLarge : styles.gallery}>
        <Box
          className={styles.traits}
          sx={{ alignItems: loading ? 'center' : 'initial' }}
        >
          {loading ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: 20,
              }}
            >
              Experimental query, loading can take a while{' '}
              <CircularProgress size={35} sx={{ marginTop: 2 }} />
            </span>
          ) : (
            <GroupedByTraitKey />
          )}
        </Box>
      </Box>

      <AssetModal
        open={openModal}
        assetId={currentAsset?.asset_id}
        collection={collectionData?.collection}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        sort={sort}
        currency={minMaxFilters.priceType}
        showTraitCount={sort.sort === 'scoreWithTraitCount'}
        handleNext={() => navigateToAsset('next')}
        handlePrevious={() => navigateToAsset('previous')}
        handleTraitFilterFromModal={handleTraitFilterFromModal}
      />
    </>
  );
};

export default TraitExplorer;
