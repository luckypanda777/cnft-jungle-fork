import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import './WatchlistOldListings.module.scss';
import {
  Box,
  capitalize,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
} from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { useAppContext } from 'context/AppContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/router';
import LiveListingBox from 'components/LiveListings/LiveListingBox';
import { useAuth } from 'hooks/useAuth';
import { getAssets, getSingleAssetInfo } from 'apiProvider';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import styles from './WatchlistOldListings.module.scss';
import Accordion from 'components/common/Accordion';
import InfinitePortfolio from 'components/common/InfinitePortfolio';
import { utf8ToHex } from 'utils/cardanoUtils';
import { AccordionSkeleton } from 'components/Portfolio/components/LoadingSkeletons';
import Select from 'components/common/Select';
import { sortOpts } from 'components/Assets/filterOptions';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import junglelogo from 'assets/junglelogoplain.png';
import { middlen } from 'utils/shorten';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import { Context as AuthContext } from 'context/AuthContext';

const WatchlistListings = ({ onClick, selected }) => {
  const router = useRouter();
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();
  const {
    state: { user },
    setAuth,
  } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    sort: 'price',
    sortDirection: 'asc',
    onSale: true,
  });
  const [sort, setSort] = useState({
    sort: 'price',
    sortDirection: 'asc',
  });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  // useEffect(() => {
  //   if (query) {
  //     setFilteredAssets(
  //       flattenArrays(
  //         assets.map((a) =>
  //           a.assets.filter(
  //             (asset) =>
  //               asset.assetName?.toLowerCase().includes(query?.toLowerCase()) ||
  //               asset.policy_id?.toLowerCase().includes(query?.toLowerCase())
  //           )
  //         )
  //       )
  //     );
  //   } else {
  //     setFilteredAssets([]);
  //   }
  // }, [query]);

  useEffect(() => {
    console.log('3 LOOP HERE');
    if (user) {
      getOldListings(true);
    }
  }, [filters, selected, user.watchlist, walletInfo.address]);

  const getOldListings = useCallback(
    async (forceRefresh) => {
      console.log(
        user.watchlist?.filter(
          ({ kind, identifier, watchlistName }) =>
            kind === 'collection' &&
            identifier &&
            (selected ? selected === watchlistName : true)
        ).length
      );
      if (forceRefresh) {
        setLoading(true);
      }
      if (assets.length > 0) {
        setBackgroundLoading(true);
      } else {
        setLoading(true);
      }
      try {
        const assetsPromises = await Promise.all(
          user.watchlist
            .filter(
              ({ kind, identifier, watchlistName }) =>
                kind === 'asset' &&
                identifier &&
                (selected ? selected === watchlistName : true)
            )
            .map(({ identifier }) => {
              const [policy_id, assetName] = identifier.split('.');
              const hexifiedAssetId = `${policy_id}${utf8ToHex(assetName)}`;

              return getSingleAssetInfo(hexifiedAssetId).then((asset) => ({
                assetID: identifier,
                assetImage: imgLinkReplace(
                  asset.optimized_image || asset.image
                ),
                assetName: asset.asset_name,
                name: asset.asset_name,
                assetNumber: asset.asset_number,
                price: asset.listing_price * 1000000,
                ...asset,
                collection: {
                  traitlist: asset.collection_traitslist || {},
                  collection_name: asset.collection_name || '',
                  supply: Object.values(
                    asset.collection_traitslist?.traitcount
                  )?.reduce((a, b) => a + b),
                },
              }));
            })
        );

        const assetsInfo = {
          collection: {
            collection_name: 'Watchlist Assets',
            image: junglelogo.src,
            areWatchedAssets: true,
          },
          assets: assetsPromises,
        };

        console.log('ASSETS', assetsPromises);

        const collectionPromises = await Promise.all(
          user.watchlist
            .filter(
              ({ kind, identifier, watchlistName }) =>
                kind === 'collection' &&
                identifier &&
                (selected ? selected === watchlistName : true)
            )
            .map(({ identifier }) => getAssets(identifier, filters))
        );

        const response = collectionPromises.map(({ assets, collection }) => ({
          assets: assets
            .map((asset) => ({
              assetID: asset.asset_id,
              assetImage: imgLinkReplace(asset.optimized_image || asset.image),
              assetName: asset.name,
              assetNumber: asset.asset_num,
              price: asset.listing_price * 1000000,
              rank: asset.rarity_rank,
              ...asset,
              collection,
            }))
            .reduce((acc, asset) => {
              if (!acc.find((a) => a.assetID === asset.assetID)) {
                acc.push(asset);
              }
              return acc;
            }, []),
          collection,
        }));

        setAssets([assetsInfo, ...response]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setBackgroundLoading(false);
      }
    },
    [user.watchlist, filters, selected]
  );

  const handleSort = (event) => {
    const {
      target: { value },
    } = event;
    const [sort, sortDirection] = value.split(/(asc|desc)/gi);
    const newSort = { sort, sortDirection: sortDirection.toLowerCase() };
    if (sort === 'price') {
      const newFilters = { ...filters, onSale: true, ...newSort };
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, ...newSort });
    }

    setSort(newSort);
  };

  const tierColor =
    user.snipeTier === 'orca'
      ? 'var(--logoColor)'
      : user.snipeTier === 'apex'
      ? 'goldenrod'
      : user.snipeTier === 'hunter'
      ? '#f89993'
      : user.snipeTier === 'yummi'
      ? 'var(--primaryColor)'
      : 'var(--undervaluedColor)';

  const anyLoading = useMemo(() => {
    return loading || walletInfo?.loading || backgroundLoading;
  }, [loading, walletInfo?.loading, backgroundLoading]);

  return (
    <WhiteCard
      sx={{
        width: 'auto',
        p: 0,
        mx: 0,
        my: 2,
        height: 'fit-content',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            pl: 2.5,
            position: 'relative',
            lineHeight: 1.5,
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 0.5,
                flex: 1,
              }}
            >
              <span>Watchlist </span>
              {/* <Divider
                sx={{
                  height: 20,
                  width: '1px',
                  color: 'var(--fontColor)',
                  mx: 0.5,
                }}
                orientation="vertical"
              />
              <FilterInput
                placeholder="Search collection or asset"
                style={{ minWidth: 200 }}
                onChange={(e) => setQuery(e.target.value)}
              /> */}

              <Divider
                sx={{
                  height: 20,
                  width: '1px',
                  color: 'var(--fontColor)',
                  mx: 0.5,
                }}
                orientation="vertical"
              />
              <Select
                style={{ width: '100%', flexGrow: 1 }}
                options={[...sortOpts]}
                name="sort"
                onChange={handleSort}
                value={sort.sort + capitalize(sort.sortDirection)}
              />
              {/* <Box
                sx={{
                  color: 'var(--undervaluedColor)',
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 0.5,
                }}
              >
                50 per collection limit
              </Box> */}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            {backgroundLoading ? (
              <CircularProgress size={18} sx={{ m: 1.5 }} />
            ) : (
              <IconButton className={styles.refresh} onClick={getOldListings}>
                <RefreshIcon />
              </IconButton>
            )}
            <Divider
              sx={{
                height: 20,
                width: '1px',
                color: 'var(--fontColor)',
                mx: 0.5,
              }}
              orientation="vertical"
            />

            <Chip
              label="Beta"
              size="small"
              sx={{
                borderRadius: 4,
                fontWeight: 'bold',
                backgroundColor: tierColor,
                color: 'white',
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            rowGap: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            m: 2,
          }}
        >
          {assets.length === 0 && !anyLoading ? (
            <h3 style={{ textAlign: 'center' }}>Nothing found</h3>
          ) : (
            (anyLoading ? new Array(3).fill({}) : assets).map(
              (record, index) => {
                const areWatchedAssets = record.collection?.areWatchedAssets;
                const isUpcoming = Date.now() < record.collection?.addedAt;

                if (isUpcoming && !areWatchedAssets) return null;

                return (
                  <Accordion
                    sidebar
                    fullWidthLabel
                    key={index}
                    loading={anyLoading}
                    defaultExpanded={index === 0}
                    sharp={false}
                    style={{ width: '100%' }}
                    label={
                      anyLoading ? (
                        <AccordionSkeleton height={50} />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'space-between',
                          }}
                        >
                          <img
                            src={imgLinkReplace(record.collection?.image)}
                            style={{
                              borderRadius: 10,
                              width: 50,
                              height: 50,
                              marginRight: 10,
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              columnGap: 2,
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flex: 1,
                              width: '100%',
                            }}
                          >
                            {!areWatchedAssets ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  columnGap: 1,
                                  textAlign: 'left',
                                }}
                              >
                                <Box sx={{ width: 250 }}>
                                  <span
                                    style={{
                                      fontSize: 16,
                                      display: 'flex',
                                      alignItems: 'center',
                                      columnGap: 5,
                                      fontFamily: 'newgilroybold',
                                    }}
                                    onClick={() =>
                                      window.open(
                                        `/collections/${record.collection?.policies}`,
                                        '_blank'
                                      )
                                    }
                                  >
                                    {record.collection?.collection_name}
                                    <VerifiedBadge
                                      verified={record.collection?.verified}
                                    />
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 14,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    Floor: {record.collection?.floor} ADA
                                  </span>
                                </Box>
                                <Divider
                                  sx={{
                                    width: 3,
                                    height: 30,
                                    mx: 1,
                                    my: 'auto',
                                  }}
                                  orientation="vertical"
                                />
                                <Box>
                                  <span
                                    style={{
                                      fontSize: 16,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {record.collection?.volume_d?.toLocaleString()}{' '}
                                    ADA Volume/day
                                  </span>
                                  <span>
                                    {record.collection?.volume_w?.toLocaleString()}{' '}
                                    ADA Volume/month
                                  </span>
                                </Box>
                              </Box>
                            ) : (
                              <Box>
                                <span
                                  style={{
                                    fontSize: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: 'newgilroybold',
                                  }}
                                  onClick={() =>
                                    !areWatchedAssets &&
                                    window.open(
                                      `/collections/${record.collection?.policies}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  {record.collection?.collection_name}
                                </span>
                                <span style={{ fontFamily: 'newgilroybold' }}>
                                  {record.assets?.length} NFTs{' '}
                                </span>
                              </Box>
                            )}

                            {!areWatchedAssets && (
                              <Box sx={{ display: 'flex', columnGap: 1 }}>
                                <BookmarkedBadge
                                  kind="collection"
                                  identifier={record.collection?.policies}
                                  additionalInfo={{
                                    name: record.collection?.collection_name,
                                    image: record.collection?.optimized_image,
                                  }}
                                />
                                <Divider
                                  sx={{
                                    width: 3,
                                    height: 15,
                                    mx: 0.5,
                                    my: 'auto',
                                    mr: 2,
                                  }}
                                  orientation="vertical"
                                />
                                <Link
                                  sx={{
                                    color: 'var(--fontColor)',
                                    fontSize: 16,
                                    marginRight: 15,
                                    cursor: 'pointer',
                                    paddingBottom: 0.25,
                                    borderBottom: '2px solid var(--logoColor)',
                                    '&:hover': {
                                      textDecoration: 'none',
                                      color: 'var(--logoColor)',
                                    },
                                  }}
                                  onClick={() =>
                                    window.open(
                                      `/collections/${record.collection?.policies}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  Open collection view
                                </Link>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      )
                    }
                  >
                    {areWatchedAssets ? (
                      <Box
                        sx={{
                          flexWrap: 'wrap',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1,
                          maxHeight: 400,
                          overflowY: 'auto',
                        }}
                      >
                        {(anyLoading
                          ? new Array(10).fill({ loading: true })
                          : record.assets
                        )?.map((asset) => (
                          <LiveListingBox
                            sx={{
                              width: '100%',
                              maxWidth: 325,
                              // flex: '1 0 40%',
                              background: 'var(--bgColor)',
                            }}
                            asset={asset}
                            key={asset.assetID}
                            onClick={onClick}
                            loading={asset.loading}
                            tier="SNIPE"
                          />
                        ))}
                      </Box>
                    ) : (
                      record.collection?.policies && (
                        <InfinitePortfolio
                          startFromPage={2}
                          height={400}
                          initialFilters={filters}
                          loading={anyLoading}
                          defaultExpanded={false}
                          component={({ data }) => (
                            <Box
                              sx={{
                                flexWrap: 'wrap',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 1,
                              }}
                            >
                              {data?.map((asset) => (
                                <LiveListingBox
                                  sx={{
                                    width: '100%',
                                    maxWidth: 325,
                                    background: 'var(--assetsBg)',
                                  }}
                                  asset={asset}
                                  key={asset.assetID}
                                  onClick={onClick}
                                  loading={asset.loading}
                                  tier="JUNGLE"
                                />
                              ))}
                            </Box>
                          )}
                          load={(pagination) =>
                            getAssets(record.collection?.policies, {
                              ...pagination,
                              ...filters,
                            }).then((res) => ({
                              data: res.assets
                                .map((asset) => ({
                                  assetID: asset.asset_id,
                                  assetImage: imgLinkReplace(
                                    asset.optimized_image || asset.image
                                  ),
                                  assetName: asset.name,
                                  assetNumber: asset.asset_num,
                                  price: asset.listing_price * 1000000,
                                  ...asset,
                                  collection: record.collection,
                                }))
                                .reduce((acc, asset) => {
                                  if (
                                    !acc.find(
                                      (a) => a.assetID === asset.assetID
                                    )
                                  ) {
                                    acc.push(asset);
                                  }
                                  return acc;
                                }, []),
                            }))
                          }
                          threshold={505}
                          loadingItems={24}
                          perPage={24}
                          initialLoad={loading}
                          headerStyle={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2,
                            pb: 1,
                            ml: 1,
                          }}
                          data={assets}
                          headerTitle={
                            record.assets.length > 0
                              ? `${record.collection?.collection_name} Listings`
                              : 'No Listings'
                          }
                          fullWidth={false}
                          forceLoad={loading}
                          white
                        />
                      )
                    )}
                  </Accordion>
                );
              }
            )
          )}
        </Box>
      </Box>
    </WhiteCard>
  );
};

export default WatchlistListings;
