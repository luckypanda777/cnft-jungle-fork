/* global chrome */

import { useEffect, useState, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import walletImage from 'assets/wallet.webp';
import Card from '../cards/AssetCard';
import AssetModal from 'components/modals/AssetModal';
import styles from './Wallet.module.scss';
import JungleLogo from 'assets/icons/logovertical.svg';
import { getWalletAssets, getSingleAsset } from 'apiProvider';
import ScrollToTopOnMount from 'components/common/ScrollToTop';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  CircularProgress,
  Button,
  List,
  Typography,
  ListItem,
  Divider,
  TextField,
  Link,
} from '@mui/material';
import FilterAccordion from 'components/common/FilterAccordion/FilterAccordion';
import FilterInput from 'components/common/Input';
import AssetListItem from 'components/common/AssetListItem';
import useDebounce from 'hooks/useDebounce';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { getFromLocalStorage } from 'utils/isEmptyObject';
import { shorten } from 'utils/shorten';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Cookies from 'js-cookie';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import ToggleView from '../common/AssetToggle';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import CustomTooltip from 'components/common/CustomTooltip';

const perPage = 40;

const Wallet = ({ wallet }) => {
  const router = useRouter();
  const { showFeedback } = useContext(FeedbackContext);
  const [assets, setAssets] = useState([]);
  const [portfolioFloorValue, setPortfolioFloorValue] = useState(0);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [openModal, setOpenModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [modalShown, setModalShown] = useState(false);
  const [sort, setSort] = useState({
    sort: 'score',
    sortDirection: 'asc',
  });
  const [filters, setFilters] = useState({});
  const [query, setQuery] = useState('');
  const [inputWallet, setInputWallet] = useState('');
  const [wallets, setWallets] = useState([
    ...new Set([
      wallet || router.query.wallet,
      ...getFromLocalStorage('wallets', 'array'),
    ]),
  ]);
  const debouncedQuery = useDebounce(query, 400);
  const { state, setLocalFilters, setWallet } = useAppContext();
  const {
    isMobile,
    localFilters: { display },
  } = state;

  const noRecords = !filterLoading && !assets.length;
  const [localWallet, setLocalWallet] = useState(router.query.wallet || '');

  const handleDisplay = (newValue) => {
    if (newValue !== null) {
      Cookies.set('asset_card_variant', newValue, { expires: 365 * 5 });
      setLocalFilters({ display: newValue });
    }
  };

  const handleOpenModal = (asset) => {
    setOpenModal(true);
    setCurrentAsset(asset);

    router.push(
      {
        pathname: `/addresses/${localWallet}`,
        query: { assetId: encodeURIComponent(asset?.asset_id) },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changePortfolioSortBy = () => {
    const newSortBy = sortBy === 'expensive' ? 'name' : 'expensive';
    setSortBy(newSortBy);

    if (newSortBy === 'expensive') {
      setFilteredAssets(
        assets.sort(
          (a, b) => (b.collection_floor || 0) - (a.collection_floor || 0)
        )
      );
    } else {
      setFilteredAssets(
        assets.sort((a, b) =>
          a.collection_name?.toLowerCase() > b.collection_name?.toLowerCase()
            ? 1
            : -1
        )
      );
    }
  };

  const refreshWalletAssets = () => {
    window.scrollTo(0, 0);
    setFilterLoading(true);
    setPortfolioFloorValue(0);
    setFilteredAssets([]);

    return Promise.all(
      [...new Set(wallets)].map((walllet) =>
        getWalletAssets(walllet, {
          ...sort,
          ...filters,
          page,
          perPage,
        }).catch((err) => {
          console.error(err);
          return [];
        })
      )
    )
      .then((response) => {
        const merged = [].concat.apply(
          [],
          response.map((a) => a.assets || [])
        );
        setAssets(
          merged.sort((a, b) =>
            a.collection_name?.toLowerCase() > b.collection_name?.toLowerCase()
              ? 1
              : -1
          )
        );
        setFilteredAssets(
          merged.sort((a, b) =>
            a.collection_name?.toLowerCase() > b.collection_name?.toLowerCase()
              ? 1
              : -1
          )
        );
        setPortfolioFloorValue(
          response.reduce((a, b) => a + (b.calculated_value || 0), 0)
        );
        setPage(2);
        setFilterLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAssets([]);
        setFilteredAssets([]);
        setPage(1);
        setFilterLoading(false);
      });
  };

  // const handleExtensionLogin = async () => {
  //         const enabled = await window.cardano.enable();

  //     if (!enabled) {
  //       return
  //     }

  //     const { Address } = await import(
  //       '@emurgo/cardano-serialization-lib-browser'
  //     );
  //     const [usedAddresses] = await window.cardano.getUsedAddresses();

  //     const decodedAddress = Address.from_bytes(
  //       Buffer.from(usedAddresses, 'hex')
  //     ).to_bech32();

  //     console.log('DECODED ADDRESS', decodedAddress);
  //     localStorage.setItem('wallet', decodedAddress);
  //     navigate(`/addresses/${decodedAddress}`);

  //     if (chrome.runtime) {
  //         console.log('CHROME RUNTIME');
  //         const editorExtensionId = 'onmieokgdenmhjijkcfmgnnlngdflmik';

  //         chrome.runtime.sendMessage(editorExtensionId, {
  //           type: 'NAMI_WALLET_SYNC',
  //           address: decodedAddress,
  //         });
  //       }
  //   };

  const handleFilterChange = (name, state) => {
    setPage(1);
    setFilters((prevState) => {
      const temp = { ...prevState, [name]: state };
      if (!state) {
        delete temp[name];
      }
      return temp;
    });
  };

  useEffect(() => {
    if (router.query && router.query.assetId && !modalShown && assets.length) {
      const asset = assets.find((el) => el.asset_id === router.query.assetId);
      if (asset) {
        setCurrentAsset(asset);
        setOpenModal(true);
        setModalShown(true);
      } else {
        getSingleAsset(router.query.assetId).then((response) => {
          setCurrentAsset(response);
          setOpenModal(true);
          setModalShown(true);
        });
      }
    }
  }, [assets]);

  useEffect(() => {
    if (localWallet && !filterLoading) {
      refreshWalletAssets();
    }
  }, [localWallet, wallets]);

  useEffect(() => {
    window.scrollTo(0, 0);
    refreshWalletAssets();
  }, [filters, sort]);

  useEffect(() => {
    if (debouncedQuery) {
      return setFilteredAssets(
        assets
          .filter(
            (asset) =>
              asset.asset_id
                .toLowerCase()
                .includes(debouncedQuery.toLowerCase()) ||
              asset.name.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .sort((a, b) => a.collection_id - b.collection_id)
      );
    }

    setFilteredAssets(assets.sort((a, b) => a.collection_id - b.collection_id));
  }, [debouncedQuery]);

  const handleAddWallet = () => {
    if (inputWallet === '' || !inputWallet.startsWith('addr')) {
      return showFeedback({
        open: true,
        message: 'Should be a valid ADA address',
        kind: 'error',
      });
    }

    if (wallets.includes(inputWallet)) {
      return showFeedback({
        open: true,
        message: 'Wallet already added!',
        kind: 'error',
      });
    }

    const newWallets = [...wallets, inputWallet];
    setWallet(inputWallet);
    setWallets(newWallets);
    localStorage.setItem('wallets', newWallets.join(','));
    setInputWallet('');
    return showFeedback({
      open: true,
      message: 'New wallet has been added',
      kind: 'success',
    });
  };

  const handleRemoveWallet = (removeAddr) => {
    const newWallets = wallets.filter((addr) => addr !== removeAddr);

    setWallets(newWallets);
    localStorage.setItem('wallets', newWallets.join(','));

    return showFeedback({
      open: true,
      message: 'Wallet has been removed',
      kind: 'success',
    });
  };

  const handleAddressChange = (addr) => {
    // refreshWalletAssets(addr);
    setLocalWallet(addr);
  };

  const handleWalletLogout = () => {
    localStorage.removeItem('wallet');
    setWallet(null);
    router.push('/');
  };

  const groupedByCollection = useMemo(() => {
    const groupByCollection = filteredAssets.reduce((group, asset) => {
      if (!asset) return null;

      const { collection_name } = asset;
      group[collection_name] = group[collection_name] ?? [];
      group[collection_name].push(asset);
      return group;
    }, {});

    return groupByCollection;
  }, [sortBy, filteredAssets]);

  return (
    <>
      <ScrollToTopOnMount />
      <Box className={styles.body}>
        <aside className={styles.sidebar}>
          <Box className={styles.sidebarWrapper}>
            <Box className={styles.currentProject}>
              <span style={{ fontSize: 18, textAlign: 'left' }}>Wallets</span>
              {wallets.length > 0 && (
                <Box className={styles.walletNumber}>
                  <span className={styles.projectName}>
                    {wallets.length > 1 ? 'My wallets' : localWallet}
                  </span>
                </Box>
              )}

              <span className={styles.assetCount} style={{ marginTop: 20 }}>
                Floor value
                {filterLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress
                      size={15}
                      sx={{ color: 'var(--logoColor)', mx: 1 }}
                    />
                  </Box>
                ) : (
                  <span
                    style={{
                      marginLeft: 6,
                      marginRight: 6,
                      fontSize: 18,
                      color: 'var(--logoColor)',
                    }}
                  >
                    {portfolioFloorValue}
                  </span>
                )}
                ADA
              </span>

              <span className={styles.assetCount} style={{ marginTop: 20 }}>
                Estimated value
                {filterLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress
                      size={15}
                      sx={{ color: 'var(--logoColor)', mx: 1 }}
                    />
                  </Box>
                ) : (
                  <span
                    style={{
                      marginLeft: 6,
                      marginRight: 6,
                      fontSize: 16,
                      color: 'var(--logoColor)',
                    }}
                  >
                    Soon
                  </span>
                )}
                ADA
              </span>

              <Box sx={{ width: '100%', bgcolor: 'transparent', mt: 2 }}>
                {wallets.length > 0 && (
                  <List
                    component="nav"
                    aria-label="main mailbox folders"
                    sx={{
                      display: 'flex',
                      justifyConent: 'space-between',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    {wallets.map((addr, i) => {
                      const shortened =
                        addr.substring(0, 10) +
                        '...' +
                        addr.substring(90, addr.length);
                      return (
                        <ListItem
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          key={i}
                        >
                          {shortened}
                          <CustomTooltip
                            title="Remove wallet"
                            onClick={() => handleRemoveWallet(addr)}
                          >
                            <ClearIcon fontSize="small" />
                          </CustomTooltip>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
                {wallets.length > 0 && <Divider sx={{ my: 2 }} />}
                <TextField
                  id="standard-basic"
                  value={inputWallet}
                  onChange={(e) => setInputWallet(e.target.value)}
                  sx={{ width: '100%' }}
                  variant="standard"
                  placeholder="Paste addr.. here"
                />
                <List component="nav" aria-label="secondary mailbox folder">
                  <Button
                    onClick={handleAddWallet}
                    variant="contained"
                    fullWidth
                  >
                    <AddIcon />
                    <span>Add new wallet</span>
                  </Button>
                </List>
              </Box>
            </Box>
            <span className={styles.report} onClick={handleWalletLogout}>
              Wallet logout
            </span>

            <Box className={styles.footer}>
              <Box
                sx={{
                  display: 'flex',
                  my: 1,
                }}
              >
                <Link
                  sx={{ mr: 1 }}
                  className={styles.link}
                  href="https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  T&C
                </Link>
                <Link
                  className={styles.link}
                  href="https://storage.googleapis.com/predator-maya-images/CNFT_Jungle_Privacy_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <JungleLogo width={150} height={125} />
              </Box>
            </Box>
          </Box>
        </aside>
        <Box className={styles.main}>
          <WhiteCard
            sx={{
              m: 0,
              px: 2,
              py: 1,
              width: 'auto',
              mt: 3,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              height: 'fit-content',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center', ml: 2 }}
            >
              Wallet query can take a long time. If it fails to load, please try
              again or contact us in Discord.
              <CustomTooltip title="Since the wallet query is very heavy it can take a long time for wallets with a lot of assets. The defalt timeout for this request is 2 minutes." />
            </Typography>
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
                            mr: '8px',
                            borderRadius: 2,
                          }}
                          onClick={changePortfolioSortBy}
                          variant="contained"
                        >
                          {sortBy === 'expensive' ? 'Name' : 'Floor'}
                          <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                        </Button>
                      </CustomTooltip>
                      <ToggleView
                        handleDisplay={handleDisplay}
                        display={display}
                      />
                    </Box>
                  </Box>
                </Box>

                {!isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <span className={styles.assetCount}>
                      {filterLoading ? (
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
          </WhiteCard>
          <Box
            className={
              display === 'list'
                ? styles.list
                : display === 'small'
                ? styles.gallery
                : styles.galleryLarge
            }
          >
            {Object.keys(groupedByCollection).map((key) => {
              const assets = groupedByCollection[key];

              return (
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    alignItems: display === 'list' ? 'center' : 'flex-start',
                  }}
                  key={key}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: display !== 'list' ? '100%' : '60%',
                    }}
                    className={display === 'list' && styles.collectionHeader}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,
                        pl: 2,
                        py: 5,
                        color: 'var(--fontColor)',
                        fontWeight: 'bold',
                      }}
                    >
                      {shorten(key || 'Unknown', 30)}
                      <span
                        style={{
                          marginLeft: 6,
                          marginRight: 6,
                          fontSize: 14,
                          color: 'var(--logoColor)',
                        }}
                      >
                        ({assets[0].collection_floor * assets.length} ADA,{' '}
                        {assets.length} assets)
                      </span>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        pr: 2,
                        py: 1,
                        color: 'var(--fontColor)',
                        fontWeight: 'bold',
                      }}
                    >
                      {assets[0].collection_floor} ADA Floor
                    </Typography>
                  </Box>
                  {display !== 'list' ? (
                    <Box className={styles.galleryGrid}>
                      {assets.map((asset, i) => {
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
                            key={i}
                            {...asset}
                            loading={!asset}
                            style={{ margin: '10px' }}
                            onClick={() => handleOpenModal(asset)}
                            display={display}
                            sort={sort}
                            showRanks
                            collectionTraits={asset.collection_traits || {}}
                            showPurchasePopover={false}
                            nextImg={false}
                            isOwned
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    <List className={styles.galleryList}>
                      {assets.map((asset, i) => {
                        return (
                          <AssetListItem
                            key={i}
                            onClick={() => handleOpenModal(asset)}
                            asset={asset}
                            collectionTraits={asset.collection_traits || {}}
                            collectionSupply={asset.collection_supply || 0}
                            loading={!asset}
                            isLast={i === assets.length - 1}
                          />
                        );
                      })}
                    </List>
                  )}
                </Box>
              );
            })}
            <AssetModal
              open={openModal}
              assetId={currentAsset?.asset_id}
              setOpenModal={setOpenModal}
              onClose={() =>
                router.replace(`/addresses/${localWallet}`, undefined, {
                  shallow: true,
                })
              }
              wallet
              sort={sort}
              showRanks
              additionalAssetData={currentAsset}
              collection={{
                traitlist: currentAsset?.collection_traits || {},
                supply: currentAsset?.collection_supply || 0,
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Wallet;
