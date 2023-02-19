import { Box, Button, CircularProgress, List, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { getWalletAssets } from 'apiProvider';
import NotFound from 'components/layout/NotFound';
import AssetListItem from 'components/common/AssetListItem';
import AssetModal from 'components/modals/AssetModal';
import useWindowSize from 'hooks/useWindowSize';
import styles from '../Assets.module.scss';
import { useAppContext } from 'context/AppContext';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import Card from 'components/cards/AssetCard';
import FilterAccordion from 'components/common/FilterAccordion';
import FilterInput from 'components/common/Input';
import useDebounce from 'hooks/useDebounce';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useRouter } from 'next/router';
import CustomTooltip from 'components/common/CustomTooltip';

const CollectionHoldings = ({
  collectionData,
  navigateToAsset,
  handleTraitFilterFromModal,
  sort = {},
  minMaxFilters = {},
  openModal,
  handleTab,
}) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowSize();
  const [openModal, setOpenModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [sortBy, setSortBy] = useState('name');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const router = useRouter();

  const { state } = useAppContext();
  const { isMobile, walletInfo } = state;

  useEffect(() => {
    if (walletInfo.address) {
      getWalletHoldings();
    }
  }, [walletInfo.address]);

  const getWalletHoldings = async () => {
    setLoading(true);
    try {
      const response = await getWalletAssets(walletInfo.address).then(
        (res) => res.assets
      );

      const holdings = response
        .filter(
          (asset) => asset.policy_id === collectionData.collection.policies
        )
        .sort((a, b) => a.asset_num - b.asset_num);

      setAssets(holdings);
      setFilteredAssets(holdings);
    } catch (err) {
      console.log(err);
      setAssets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debouncedQuery) {
      return setFilteredAssets(
        assets
          .filter(
            (asset) =>
              asset.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              asset.asset_num.toString().includes(debouncedQuery.toString())
          )
          .sort((a, b) => a.asset_num - b.asset_num)
      );
    }

    setFilteredAssets(assets.sort((a, b) => a.asset_num - b.asset_num));
  }, [debouncedQuery]);

  const handleOpenModal = (asset) => {
    setOpenModal(true);
    setCurrentAsset(asset);
  };

  const changePortfolioSortBy = () => {
    const newSortBy = sortBy === 'rank' ? 'name' : 'rank';
    setSortBy(newSortBy);

    if (newSortBy === 'rank') {
      setFilteredAssets(
        assets.sort((a, b) => (a.rarity_rank || 0) - (b.rarity_rank || 0))
      );
    } else {
      setFilteredAssets(assets.sort((a, b) => a.asset_num - b.asset_num));
    }
  };

  const handleTraitFilterFromModal = (traitKey, traitValue) => {
    router.push(
      `/collections/${
        collectionData.collection.policies
      }?traits=${JSON.stringify({
        [traitKey.toLowerCase()]: [traitValue.toLowerCase()],
      })}`
    );
  };

  const noRecords = (!loading && !filteredAssets.length) || !walletInfo.address;

  return (
    <Box className={styles.main}>
      <FilterAccordion
        style={isMobile && { width: 310, ml: '-27.5%', mr: 'auto' }}
      >
        <Box className={styles.galleryFilters}>
          <Box className={styles.mainFilters}>
            <Box className={styles.assetFilter}>
              <Box className={styles.filterContainer}>
                <FilterInput
                  placeholder="Search Asset"
                  name="filterAssetQuery"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <CustomTooltip
                  title={sortBy === 'rank' ? 'Most Rare' : 'Order by Name'}
                >
                  <Button
                    sx={{
                      fontSize: 10,
                      width: 100,
                      alignItems: 'center',
                      mr: '8px',
                      borderRadius: 2,
                    }}
                    onClick={changePortfolioSortBy}
                    variant="contained"
                  >
                    {sortBy === 'rank' ? 'Name' : 'Rank'}
                    <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                  </Button>
                </CustomTooltip>
              </Box>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <span className={styles.assetCount}>
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress
                      size={15}
                      sx={{ color: 'var(--logoColor)', mr: 1 }}
                    />
                  </Box>
                ) : (
                  <span style={{ marginRight: 6 }}>
                    {filteredAssets.length}
                  </span>
                )}{' '}
                Assets
              </span>
            </Box>
          )}
        </Box>
      </FilterAccordion>
      <Box className={styles.gallery}>
        <Box
          className={styles.traits}
          sx={{ alignItems: loading ? 'center' : 'initial' }}
        >
          {loading || walletInfo.loading ? (
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
            <Box className={styles.galleryGrid}>
              {noRecords ? (
                <Box className={styles.noRecords}>
                  <NotFound
                    title={
                      walletInfo.address
                        ? 'No assets found.'
                        : 'No wallet connected'
                    }
                  />
                </Box>
              ) : (
                (filteredAssets.length
                  ? filteredAssets
                  : Array.from(new Array(40))
                ).map((asset, i) => {
                  if (
                    asset?.policy_id ===
                    '62233242a696c5eb394ee392df49727b61bfc797329108fccf3450f0'
                  ) {
                    asset.image = asset?.onchain_data?.asset.ipfs;
                    asset.onchain_data.image = asset?.onchain_data?.asset.ipfs;
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
                      sortOrFilerLoading={loading}
                      collectionTraits={state.collection?.traitlist}
                      collectionSupply={state.collection?.supply}
                      forceSmallDisplay
                      isOwned
                    />
                  );
                })
              )}
            </Box>
          )}
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
          hideArrows
          handleTraitFilterFromModal={handleTraitFilterFromModal}
        />
      </Box>
    </Box>
  );
};

export default CollectionHoldings;
