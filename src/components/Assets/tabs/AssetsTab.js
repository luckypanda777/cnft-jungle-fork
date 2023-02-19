import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { getAssets, getSingleAsset } from '../../../apiProvider';
import styles from '../Assets.module.scss';
import Card from 'components/cards/AssetCard';
import AssetModal from 'components/modals/AssetModal';
import NotFound from 'components/layout/NotFound';
import Sidebar from 'components/layout/AssetsSidebar';
import FilterAccordion from 'components/common/FilterAccordion';
import useDebounce from '../../../hooks/useDebounce';
import { Box, CircularProgress, IconButton, List } from '@mui/material';
import { MobileView } from 'react-device-detect';
import {
  isEmptyObject,
  getFromLocalStorage,
  removeFromLocalStorage,
  setLocalStorage,
} from 'utils/isEmptyObject';
import { collectionNameToIdMapping } from '../collectionMappings';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useEventListener } from '../../../hooks/useEventListener';
import { useRouter } from 'next/router';
import { getLocationSearch } from 'utils/getSearch';
import AssetListItem from '../../common/AssetListItem';
import dynamic from 'next/dynamic';
import { eventTrack } from 'config/analytics';
import InfiniteScroll from 'react-infinite-scroll-component';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import { temporaryAssetBlacklist } from '../temporaryAssetBlacklist';
import LeftSidebar from 'components/layout/AssetsSidebar/LeftSidebar';
import SelectedFilters from 'components/filters/SelectedFilters';
import LiveListings from 'components/LiveListings';

const AssetsFilters = dynamic(
  () => import('components/filters/AssetsFilters'),
  {
    ssr: false,
  }
);

const perPage = 50;

const checkFilters = () => {
  const parsedQuery = getLocationSearch();
  return (
    Object.keys(parsedQuery).length && !parsedQuery.assetId && !parsedQuery.tab
  );
};

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
    <CircularProgress />
  </Box>
);

const Assets = ({ collection, collectionData }) => {
  const router = useRouter();

  const { state, setCollection } = useAppContext();
  const { isMobile, localFilters } = state;
  const { display } = localFilters;

  const search = getLocationSearch();

  const [queryFiltersLoaded, setQueryFiltersLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState([]);
  const [infiniteLoading, setInfiniteLoading] = useState(() => !checkFilters());
  const [filterLoading, setFilterLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [modalShown, setModalShown] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [traitsFilters, setTraitsFilters] = useState({});
  const [minMaxFilters, setMinMaxFilters] = useState({});
  const [marketplacesFilters, setMarketplacesFilters] = useState({
    marketplaces: getFromLocalStorage('marketplaces', 'array', []),
    listingTypes: getFromLocalStorage('listingTypes', 'array', []),
  });
  const [openModal, setOpenModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [totalAssets, setTotalAssets] = useState(0);
  const [adjacentAssetsIds, setAdjacentAssetsIds] = useState([]);
  const searchQuery = query ? { query } : {};

  const [sort, setSort] = useState(
    getFromLocalStorage('sort', 'object', {
      sort: 'assetNumber',
      sortDirection: 'asc',
    })
  );
  const [filters, setFilters] = useState(
    getFromLocalStorage('filters', 'object', {
      traitFilterLogic: 'union',
    })
  );

  const collectionName = collection || search.collection;
  const collectionId = collectionNameToIdMapping[collectionName?.toLowerCase()]
    ? collectionNameToIdMapping[collectionName?.toLowerCase()]
    : collectionData?.collection?.id || collection;

  const collectionRoute = collectionNameToIdMapping[
    collectionName?.toLowerCase()
  ]
    ? `/${collection}`
    : `/collections/${collection}`;

  const noRecords = router.isFallback
    ? false
    : !infiniteLoading && !filterLoading && !assets.length;

  const fetchAssets = async ({
    manualPage = undefined,
    additionalProps = {},
  } = {}) => {
    const requestTraits = formatTraits();
    const requestMarketplaceFilters = formatMarketplaceFilters();
    const pg = manualPage || page;

    const params = {
      page: pg,
      perPage,
      ...sort,
      ...filters,
      ...searchQuery,
      ...minMaxFilters,
      ...requestTraits,
      ...requestMarketplaceFilters,
      ...additionalProps,
      whitelist: state?.wallet || getFromLocalStorage('wallet', 'string', ''),
    };

    setInfiniteLoading(true);
    try {
      const response = await getAssets(collectionId, params);
      const tempFilteredAssets = response.assets.filter(
        (a) => !temporaryAssetBlacklist.includes(a.name)
      );

      if (!state.collection) {
        setCollection(response.collection);
      }

      setTotalAssets(
        response.total_assets_in_query < response.collection.supply
          ? response.total_assets_in_query
          : response.collection.supply
      );
      setAssets((prevState) =>
        pg === 1
          ? [].concat(tempFilteredAssets)
          : prevState.concat(tempFilteredAssets)
      );
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setPage(1);
      setAssets([]);
    }
    setInfiniteLoading(false);
  };

  const refreshAssets = (newFilters = {}, scroll) => {
    setFilterLoading(true);
    setPage(1);

    fetchAssets({
      manualPage: 1,
      additionalProps: { ...newFilters },
    }).then(() => setFilterLoading(false));
  };

  const handleKeydown = ({ key }) => {
    if (key === 'ArrowLeft') {
      navigateToAsset('previous');
    }

    if (key === 'ArrowRight') {
      navigateToAsset('next');
    }
  };

  useEventListener('keydown', handleKeydown);

  const switchCurrentAsset = (newCurrentAsset) => {
    setCurrentAsset(newCurrentAsset);
    handleSetAdjacent(newCurrentAsset);
  };

  const handleSetAdjacent = (newCurrentAsset) => {
    const previousIndex =
      assets.findIndex((a) => a.asset_id === newCurrentAsset.asset_id) - 1;
    const nextIndex =
      assets.findIndex((a) => a.asset_id === newCurrentAsset.asset_id) + 1;

    setAdjacentAssetsIds([
      previousIndex < 0 ? null : assets[previousIndex]?.asset_id,
      nextIndex > assets.length - 1 ? null : assets[nextIndex]?.asset_id,
    ]);
  };

  const handleOpenModal = (asset) => {
    console.log(asset);
    setOpenModal(true);
    setCurrentAsset(asset);
    handleSetAdjacent(asset);

    router.push(
      {
        pathname: collectionRoute,
        query: { assetId: encodeURIComponent(asset?.asset_id), tab: 'assets' },
      },
      undefined,
      { shallow: true }
    );
  };

  const navigateToAsset = (direction = 'previous') => {
    const navigateToAssetId =
      direction === 'previous' ? adjacentAssetsIds[0] : adjacentAssetsIds[1];

    if (!navigateToAssetId) return;

    const newCurrentAssetIndex = assets.findIndex(
      (a) => a.asset_id === navigateToAssetId
    );
    const newCurrentAsset = assets[newCurrentAssetIndex];

    switchCurrentAsset(newCurrentAsset);

    if (newCurrentAssetIndex === Math.round(assets.length / 2)) {
      setInfiniteLoading(true);
    }

    router.push(
      {
        pathname: collectionRoute,
        query: {
          assetId: encodeURIComponent(navigateToAssetId),
          tab: 'assets',
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const scrollUp = () => {
    if (!isMobile) {
      window.scrollTo({
        behavior: 'smooth',
        top: 100,
      });
    }
  };

  const handleSort = (event) => {
    const {
      target: { value },
    } = event;
    const [sort, sortDirection] = value.split(/(asc|desc)/gi);
    const newSort = { sort, sortDirection: sortDirection.toLowerCase() };
    if (sort === 'price') {
      const newFilters = { ...filters, onSale: true };
      setFilters(newFilters);
      setLocalStorage('filters', JSON.stringify(newFilters));
    }

    setLocalStorage('sort', JSON.stringify(newSort));
    setSort(newSort);
    setPage(1);
    scrollUp();
  };

  const handleMinMaxFilter = (minMax) => {
    const newMinMaxFilters = Object.keys(minMax).reduce((acc, key) => {
      if (minMax[key]) {
        acc[key] = minMax[key];
      }
      return acc;
    }, {});

    setMinMaxFilters(newMinMaxFilters);

    if (minMax.priceMin || minMax.priceMax) {
      const newFilters = { ...filters, onSale: true };
      setFilters(newFilters);
      setLocalStorage(
        'filters',
        JSON.stringify({ ...newFilters, ...newMinMaxFilters })
      );
    }

    setPage(1);
    scrollUp();
  };

  const handleFilterChange = (name, state) => {
    setPage(1);
    setFilters((prevState) => {
      const temp = { ...prevState, [name]: state };
      setLocalStorage('filters', JSON.stringify(temp));
      if (!state) {
        delete temp[name];
      }
      return temp;
    });
    scrollUp();
  };

  const handleAssetQueryFilter = (query) => {
    refreshAssets(query);
  };

  const formatTraits = (traits = traitsFilters) => {
    const formattedTraits = Object.keys(traits).reduce((acc, key) => {
      if (traits[key].length > 0) {
        acc[key] = traits[key];
      }
      return acc;
    }, {});

    return isEmptyObject(formattedTraits)
      ? { traits: '' }
      : { traits: JSON.stringify(formattedTraits) };
  };

  const handleTraitsFilter = (traits) => {
    const requestTraits = formatTraits(traits);

    setTraitsFilters(traits);

    // event track for each trait
    Object.keys(traits).forEach((trait) => {
      if (traits[trait].length > 0) {
        traits[trait].forEach((value) => {
          eventTrack(
            'trait',
            'filter',
            `${state.collection.id}-${trait}-${value}`
          );
        });
      }
    });
    scrollUp();
  };

  const handleTraitsSlider = ({ traitKey, minMax }) => {
    scrollUp();
  };

  const handleTraitFilterFromModal = (traitKey, traitValue) => {
    setOpenModal(false);

    setQuery('');
    setFilters((prev) => ({ ...prev, onSale: true }));
    setTraitsFilters({ [traitKey]: [traitValue] });

    eventTrack(
      'trait',
      'filter',
      `${state.collection.id}-${traitKey}-${traitValue}`
    );
    scrollUp();
  };

  const handleTraitFilter = (traitKey, traitValue) => {
    setTraitsFilters({ [traitKey]: [traitValue] });
    setQuery('');

    eventTrack(
      'trait',
      'filter',
      `${state.collection.id}-${traitKey}-${traitValue}`
    );
    scrollUp();
  };

  const handleMarketplaceFilters = ({ marketplaces, listingTypes }) => {
    const newFilters = { ...filters, onSale: true };
    setLocalStorage('marketplaces', marketplaces);
    setLocalStorage('listingTypes', listingTypes);
    setLocalStorage('filters', JSON.stringify(newFilters));

    setMarketplacesFilters({
      marketplaces,
      listingTypes,
    });
    setFilters(newFilters);
  };

  const formatMarketplaceFilters = (
    newMarketplaces = marketplacesFilters.marketplaces,
    newListinTypes = marketplacesFilters.listingTypes
  ) => {
    return {
      marketplaces: newMarketplaces.join(','),
      listingTypes: newListinTypes.join(','),
    };
  };

  useEffect(() => {
    if (router.query && router.query.assetId && !modalShown && assets.length) {
      const asset = assets.find((el) => el.asset_id === router.query.assetId);
      if (asset) {
        setCurrentAsset(asset);
        handleSetAdjacent(asset);
        setOpenModal(true);
        setModalShown(true);
      } else {
        getSingleAsset(router.query.assetId).then((response) => {
          setCurrentAsset(response);
          handleSetAdjacent(response);
          setOpenModal(true);
          setModalShown(true);
        });
      }
    }
  }, [assets, router.query]);

  useEffect(() => {
    if (mounted) {
      if (!queryFiltersLoaded) {
        setQueryFiltersLoaded(true);
      }

      const allFilters = {
        ...sort,
        ...filters,
        ...searchQuery,
        ...minMaxFilters,
        ...formatTraits(),
        ...formatMarketplaceFilters(),
      };

      for (const key of Object.keys(allFilters)) {
        if (allFilters[key] === '' || allFilters[key] === undefined) {
          delete allFilters[key];
        }
      }
    }

    if (!infiniteLoading && mounted) {
      refreshAssets();
    }
  }, [debouncedQuery, sort, filters, minMaxFilters, traitsFilters]);

  useEffect(() => {
    if (checkFilters() && !queryFiltersLoaded) {
      const parsedFilters = getLocationSearch();
      // Idk if react 17 already has auto batching
      // but just in case to update all states and then re-render 1 time
      // instead of re-rendering each state update
      ReactDOM.unstable_batchedUpdates(() => {
        setSort({
          sort: parsedFilters.sort || 'assetNumber',
          sortDirection: parsedFilters.sortDirection || 'asc',
        });
        setMarketplacesFilters({
          marketplaces: parsedFilters.marketplaces?.split(',') || [],
          listingTypes: parsedFilters.listingTypes?.split(',') || [],
        });
        try {
          setTraitsFilters(JSON.parse(parsedFilters.traits));
        } catch (e) {
          setTraitsFilters({});
        }
      });

      setQueryFiltersLoaded(true);
      setInfiniteLoading(true);
    }

    setMounted(true);
  }, []);

  // make request after all filters in query are parsed
  // or if collection changes
  useEffect(() => {
    if (mounted) {
      fetchAssets({ manualPage: 1 });
    }
  }, [mounted]);

  // if collection changes
  useEffect(() => {
    if (mounted) {
      setTraitsFilters({});
      setAssets([]);
      fetchAssets({
        manualPage: 1,
        additionalProps: {
          traits: undefined,
        },
      });
    }
  }, [collection]);

  useEffect(() => {
    if (collectionData && collectionData.collection) {
      setCollection(collectionData.collection);
    }
  }, [collectionData]);

  const handleFilterReset = () => {
    removeFromLocalStorage('marketplaces');
    removeFromLocalStorage('listingTypes');
    removeFromLocalStorage('filters');
    removeFromLocalStorage('sort');
    setQuery('');
    setTraitsFilters({});
    setMinMaxFilters({
      priceType: 'ada',
      priceMin: null,
      priceMax: null,
      rarityType: 'score',
      rarityMin: null,
      rarityMax: null,
      rewardType: 'staking',
      rewardMin: null,
      rewardMax: null,
    });
    setSort({
      sort: 'assetNumber',
      sortDirection: 'asc',
    });
    setFilters({});
    setMarketplacesFilters({
      marketplaces: [],
      listingTypes: [],
    });
    setRefresh(!refresh);
  };

  const handleTraitsReset = () => {
    setTraitsFilters({});
    setRefresh(!refresh);
  };

  const handleRankingFilter = (rankingFilters) => {
    setFilters((prevState) => ({
      ...prevState,
      ...rankingFilters,
    }));
  };

  const handleTraitFilterLogic = () => {
    const newTraitFilterLogic =
      filters.traitFilterLogic === 'intersection' ? 'union' : 'intersection';
    setFilters({ ...filters, traitFilterLogic: newTraitFilterLogic });
    setLocalStorage('traitFilterLogic', newTraitFilterLogic);
  };

  const handleFilterRemove = (type, ...data) => {
    if (type === 'minMax') {
      setMinMaxFilters({
        ...minMaxFilters,
        [data[0]]: null,
      });
    }

    if (type === 'marketplaces' || type === 'listingTypes') {
      handleMarketplaceFilters({
        ...marketplacesFilters,
        [type]: marketplacesFilters[type].filter((d) => d !== data[0]),
      });
    }

    if (type === 'traits') {
      const newTraitFilters = {
        ...traitsFilters,
        [data[0]]: traitsFilters[data[0]].filter((value) => value !== data[1]),
      };
      setTraitsFilters({ ...newTraitFilters });
    }
  };

  const loading = filterLoading || infiniteLoading;
  const hasMore = assets.length < totalAssets;

  return (
    <>
      <Box
        className={display === 'small' ? styles.gallery : styles.galleryLarge}
      >
        <Sidebar
          onFilter={handleFilterChange}
          onMinMaxFilter={handleMinMaxFilter}
          onTraitsFilter={handleTraitsFilter}
          onTraitSliderFilter={handleTraitsSlider}
          onFilterReset={handleFilterReset}
          onTraitsReset={handleTraitsReset}
          onRankingFilter={handleRankingFilter}
          onMarketplacesFilter={handleMarketplaceFilters}
          handleTraitFilterSidebar={handleTraitFilter}
          handleSort={handleSort}
          setSort={setSort}
          refresh={refresh}
          selectedTraits={traitsFilters}
          traitFilterLogic={filters.traitFilterLogic}
          onTraitsFilterLogic={handleTraitFilterLogic}
          showTraitCount={sort.sort === 'scoreWithTraitCount'}
          advanced={advanced}
          filters={filters}
          minMaxFilters={minMaxFilters}
          marketplacesFilters={marketplacesFilters}
        />
        <div style={{ flex: 1 }}>
          <FilterAccordion style={isMobile && { width: '100%' }}>
            <AssetsFilters
              sort={sort}
              query={query}
              setQuery={setQuery}
              loading={loading}
              filters={filters}
              handleSort={handleSort}
              handleFilterReset={handleFilterReset}
              handleListingsRefresh={() => refreshAssets()}
              handleFilterChange={handleFilterChange}
              handleAssetQueryFilter={handleAssetQueryFilter}
              totalAssets={totalAssets}
              advanced={advanced}
              setAdvanced={setAdvanced}
            />
          </FilterAccordion>
          {!isMobile && (
            <SelectedFilters
              selectedTraits={traitsFilters}
              filters={filters}
              minMaxFilters={minMaxFilters}
              handleFilterRemove={handleFilterRemove}
              marketplacesFilters={marketplacesFilters}
            />
          )}

          <InfiniteScroll
            next={fetchAssets}
            hasMore={hasMore}
            style={{ overflow: 'visible' }}
            loader={<Loader />}
            dataLength={assets.length}
          >
            <Box className={styles.galleryGrid}>
              {noRecords ? (
                <Box className={styles.noRecords}>
                  <NotFound title="No assets found." />
                </Box>
              ) : display !== 'list' ? (
                (assets.length ? assets : Array.from(new Array(40))).map(
                  (asset, i) => {
                    if (
                      asset?.policy_id ===
                      '62233242a696c5eb394ee392df49727b61bfc797329108fccf3450f0'
                    ) {
                      asset.image = asset?.onchain_data?.asset.ipfs;
                      asset.onchain_data.image =
                        asset?.onchain_data?.asset.ipfs;
                    }

                    if (asset && (asset.image || asset.optimized_image)) {
                      if (asset.optimized_image) {
                        asset.optimized_image = imgOptimizerReplace(asset);
                      } else {
                        asset.image = imgOptimizerReplace(asset);
                      }
                    }

                    return (
                      <Card
                        key={`${asset?.asset_id}_${i}`}
                        {...asset}
                        loading={!asset}
                        style={{ margin: '10px' }}
                        onClick={() => handleOpenModal(asset)}
                        sort={sort}
                        nextImg={false}
                        currency={minMaxFilters.priceType}
                        sortOrFilerLoading={filterLoading}
                        collectionTraits={state.collection?.traitlist}
                        collectionSupply={state.collection?.supply}
                      />
                    );
                  }
                )
              ) : (
                <List className={styles.galleryList}>
                  {(assets.length ? assets : Array.from(new Array(40))).map(
                    (asset, i) => {
                      return (
                        <AssetListItem
                          key={`${asset?.asset_id}_${i}`}
                          onClick={() => handleOpenModal(asset)}
                          asset={asset}
                          loading={!asset}
                          sortOrFilerLoading={filterLoading}
                          isLast={i === assets.length - 1}
                          collectionTraits={state.collection?.traitlist}
                        />
                      );
                    }
                  )}
                </List>
              )}
            </Box>
          </InfiniteScroll>
        </div>
        {/* TODO: Put holders & rarity table here and move live listings */}
        <LeftSidebar
          handleOpenModal={handleOpenModal}
          filters={filters}
          selectedTraits={traitsFilters}
        />
      </Box>
      <MobileView>
        {loading && <CircularProgress size={20} className={styles.loader} />}
        <IconButton className={styles.refresh} onClick={() => refreshAssets()}>
          <RefreshIcon />
        </IconButton>
        <IconButton className={styles.reset} onClick={handleFilterReset}>
          <FilterListOffIcon />
        </IconButton>
      </MobileView>
      <AssetModal
        open={openModal}
        assetId={currentAsset?.asset_id}
        initialAsset={currentAsset}
        collection={collectionData?.collection}
        setOpenModal={setOpenModal}
        onClose={() =>
          router.push(
            {
              pathname: collectionRoute,
              query: { tab: 'assets' },
            },
            undefined,
            { shallow: true }
          )
        }
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

export default Assets;
