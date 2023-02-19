import { Box } from '@mui/system';
import FilterButton from 'components/buttons/FilterButton';
import { middlen } from 'utils/shorten';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, Divider } from '@mui/material';
import { SearchBox } from 'components/boxes/BookmarkBoxes';
import { useEffect, useState } from 'react';
import { useAppContext } from 'context/AppContext';
import { VerticalDivider } from 'components/Portfolio/layout/Performance';
import AddSingleValueModal from 'components/modals/AddSingleValueModal';
import TextHeader from 'components/common/TextHeader';
import FilterInput from 'components/common/Input';
import { WatchlistStatsSmallSkeleton } from 'components/Portfolio/components/LoadingSkeletons';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import dynamic from 'next/dynamic';
import AssetModal from 'components/modals/AssetModal';
import { manageWatchlist } from 'apiProvider';
import { useContext } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as AuthContext } from 'context/AuthContext';

const WatchlistFloors = dynamic(() => import('./graphs/WatchlistFloors'), {
  ssr: false,
});
const WatchlistLiveListings = dynamic(() => import('./WatchlistListings'), {
  ssr: false,
});
const WatchlistOldListings = dynamic(() => import('./WatchlistOldListings'), {
  ssr: false,
});

const Watchlist = () => {
  const { showFeedback } = useContext(FeedbackContext);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [valueModalType, setValueModalType] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');
  const [selected, setSelected] = useState('');
  const [watchlist, setWatchlist] = useState({
    collections: [],
    assets: [],
  });
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();
  const {
    state: { user },
    setAuth,
  } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    console.log('1 LOOP HERE');
    setWatchlist({
      collections: user.watchlist?.filter(
        ({ kind, name, identifier, watchlistName }) =>
          kind === 'collection' &&
          (selected ? selected === watchlistName : true) &&
          (collectionFilter
            ? name?.toLowerCase().includes(collectionFilter.toLowerCase()) ||
              identifier?.toLowerCase().includes(collectionFilter.toLowerCase())
            : true)
      ),
      assets: user.watchlist?.filter(
        ({ kind, name, identifier, watchlistName }) =>
          kind === 'asset' &&
          (selected ? selected === watchlistName : true) &&
          (assetFilter
            ? name?.toLowerCase().includes(assetFilter.toLowerCase()) ||
              identifier?.toLowerCase().includes(assetFilter.toLowerCase())
            : true)
      ),
    });
  }, [
    user.watchlist,
    walletInfo.address,
    collectionFilter,
    assetFilter,
    selected,
  ]);

  useEffect(() => {
    console.log('2 LOOP HERE');
    if (user.watchlistNames?.length > 0 && !selected) {
      setSelected(user.watchlistNames?.[0]);
    }
  }, [user.watchlistNames]);

  console.log(walletInfo.loading);

  const onClick = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const handleWatchlistSelect = (name) => {
    setSelected(name);
  };

  const handleWatchlistOpen = () => {
    setModalOpen(true);
    setValueModalType('watchlist');
  };

  const handleWatchlistCreate = async (name) => {
    if (user.watchlistNames.length > 9) {
      return showFeedback({
        message: 'Can only have up to 10 watchlists!',
        kind: 'error',
      });
    }

    setWatchlistLoading(true);
    setSelected(name);
    if (user.watchlistNames.includes(name)) {
      showFeedback({
        message: 'Watchlist name already exists!',
        kind: 'error',
      });
      setWatchlistLoading(false);
      return;
    }
    try {
      await manageWatchlist({ watchlistName: name.toString() }).then(
        ({ user }) => {
          setAuth({ user });
        }
      );
      showFeedback({
        message: 'Watchlist created successfully',
        kind: 'success',
      });
    } catch (err) {
      showFeedback({ message: 'Watchlist creation error', kind: 'error' });
    } finally {
      setWatchlistLoading(false);
      setModalOpen(false);
      setValueModalType('');
    }
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '80vh',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <TextHeader
          title="Your personal watchlist"
          subtitle={
            <div
              style={{
                marginTop: 10,
                fontSize: 24,
              }}
            >
              <div>
                <span style={{ color: 'var(--logoColor)' }}>- </span> Add
                collections and assets to your personal watchlist
              </div>
              <div>
                <span style={{ color: 'var(--logoColor)' }}>- </span> See most
                recent listings
              </div>
              <div>
                <span style={{ color: 'var(--logoColor)' }}>- </span> Get
                realtime new listing feed
              </div>
              <div>
                <span style={{ color: 'var(--logoColor)' }}>- </span> Get mobile
                notifications
              </div>
            </div>
          }
          socialText="Issues with watchlist? Contact us"
        />
        <span style={{ fontSize: 20, marginTop: 20 }}>
          Watchlist is Only Available for Desktop at the moment!
        </span>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        position: 'relative',
        mt: 1,
        maxWidth: 1600,
        mx: 'auto',
      }}
    >
      <TextHeader
        title="Your personal watchlist"
        subtitle={
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
            }}
          >
            <div>
              <span style={{ color: 'var(--logoColor)' }}>- </span> Add
              collections and assets to your personal watchlist
            </div>
            <div>
              <span style={{ color: 'var(--logoColor)' }}>- </span> See most
              recent listings
            </div>
            <div>
              <span style={{ color: 'var(--logoColor)' }}>- </span> Get realtime
              new listing feed
            </div>
            <div>
              <span style={{ color: 'var(--logoColor)' }}>- </span> Get mobile
              notifications
            </div>
          </div>
        }
        socialText={
          <Box
            sx={{
              fontSize: 18,
              mr: 2,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Issues with watchlist? Contact us
          </Box>
        }
        subtitleStyle={{ fontSize: 18, marginTop: 0 }}
        titleStyleMobile={{ fontSize: 24 }}
        subtitleStyleMobile={{ fontSize: 16 }}
        socialsStyle={{ marginBottom: 20 }}
        socialsStyleMobile={{ marginBottom: 20 }}
      />
      {!user || watchlistLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress sx={{ fontSize: 26 }} />
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              my: 3,
              justifyContent: 'flex-start',
              p: 1,
              maxWidth: '100%',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {user.watchlistNames?.map((name) => {
              return (
                <FilterButton
                  // add small shadow
                  sx={{
                    fontSize: 12,
                    border: 'none',

                    backgroundColor:
                      selected === name
                        ? 'var(--logoColor)'
                        : 'var(--lightGrey)',
                    color: selected === name ? 'white' : 'var(--fontColor)',
                    '&:hover': {
                      backgroundColor: 'var(--logoColor)',
                      color: 'white',
                      opacity: 0.9,
                    },
                  }}
                  value={selected === name}
                  onClick={() => handleWatchlistSelect(name)}
                  pressable
                  name={name}
                >
                  {name || 'Watchlist 1'}
                </FilterButton>
              );
            })}

            <FilterButton
              // add small shadow
              sx={{
                fontSize: 12,
                border: 'none',

                color: 'var(--fontColor)',
                backgroundColor: 'var(--lightGrey)',
                '&:hover': {
                  backgroundColor: 'var(--logoColor)',
                  color: 'white',
                },
              }}
              onClick={handleWatchlistOpen}
              pressable
            >
              + Add Watchlist
            </FilterButton>
          </Box>

          <Box sx={{ flex: 4, display: 'flex' }}>
            <Box style={{ flex: 1 }}>
              {true && (
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: 2,
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <FilterInput
                    placeholder="Filter Collection"
                    onChange={(e) => setCollectionFilter(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <FilterButton
                    pressable
                    onClick={() => setValueModalType('collection')}
                    style={{
                      width: 250,
                      backgroundColor: 'var(--primaryColor)',
                      color: 'white',
                    }}
                  >
                    Add Collection
                  </FilterButton>
                </Box>
              )}
              {walletInfo.loading ? (
                <WatchlistStatsSmallSkeleton />
              ) : (
                <WhiteCard
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 0.5,
                    maxHeight: 250,
                    overflowY: 'auto',
                    m: 0,
                    my: 2,
                    p: 2,
                    width: 'auto',
                    justifyContent:
                      watchlist.collections?.length === 0
                        ? 'center'
                        : 'flex-start',
                  }}
                >
                  {!walletInfo.loading && !walletInfo.address ? (
                    <Box sx={{ textAlign: 'center', fontSize: 20 }}>
                      Connect wallet to see your watchlist
                    </Box>
                  ) : watchlist.collections?.length === 0 ? (
                    <Box sx={{ textAlign: 'center', fontSize: 20 }}>
                      Looks empty.. Add your first collection!
                    </Box>
                  ) : (
                    watchlist.collections.map(
                      ({ image, name, identifier }, index) => (
                        <>
                          <SearchBox
                            key={identifier + index}
                            option={{ image, label: name }}
                            identifier={identifier}
                            type="collection"
                            showIcons={['bookmark']}
                            style={{ height: 40 }}
                            labelLength={20}
                          />
                          <Divider sx={{ my: 1 }} />
                        </>
                      )
                    )
                  )}
                </WhiteCard>
              )}
              {!walletInfo.loading && (
                <Box sx={{ textAlign: 'right' }}>
                  {watchlist.collections?.length} Collections
                </Box>
              )}
            </Box>
            <VerticalDivider />
            <Box style={{ flex: 1 }}>
              {true && (
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: 2,
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <FilterInput
                    placeholder="Filter Asset"
                    onChange={(e) => setAssetFilter(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <FilterButton
                    pressable
                    onClick={() => setValueModalType('asset')}
                    style={{
                      width: 250,
                      backgroundColor: 'var(--primaryColor)',
                      color: 'white',
                    }}
                  >
                    Add Asset
                  </FilterButton>
                </Box>
              )}
              {walletInfo.loading ? (
                <WatchlistStatsSmallSkeleton />
              ) : (
                <WhiteCard
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 0.5,
                    maxHeight: 250,
                    overflowY: 'auto',
                    m: 0,
                    my: 2,
                    p: 2,
                    width: 'auto',
                    justifyContent:
                      watchlist.assets?.length === 0 ? 'center' : 'flex-start',
                  }}
                >
                  {!walletInfo.loading && !walletInfo.address ? (
                    <Box sx={{ textAlign: 'center', fontSize: 20 }}>
                      Connect wallet to see your watchlist
                    </Box>
                  ) : watchlist.assets?.length === 0 ? (
                    <Box style={{ textAlign: 'center', fontSize: 20 }}>
                      Looks empty.. Add your first asset!
                    </Box>
                  ) : (
                    watchlist.assets.map(
                      ({ image, name, identifier }, index) => (
                        <>
                          <SearchBox
                            key={identifier + index}
                            option={{ image, label: name }}
                            identifier={identifier}
                            type="asset"
                            showIcons={['bookmark']}
                            style={{ height: 40 }}
                            labelLength={20}
                          />
                          <Divider sx={{ my: 1 }} />
                        </>
                      )
                    )
                  )}
                </WhiteCard>
              )}
              {!walletInfo.loading && (
                <Box sx={{ textAlign: 'right' }}>
                  {watchlist.assets?.length} Assets
                </Box>
              )}
            </Box>
            <AddSingleValueModal
              type={valueModalType}
              setValueModalType={setValueModalType}
              onSubmit={handleWatchlistCreate}
              outsideLoading={watchlistLoading}
            />
          </Box>

          <WatchlistFloors
            policies={watchlist.collections.map((c) => ({
              policy: c.identifier,
              name: c.name,
            }))}
            minimizedFormat
          />
          <WatchlistLiveListings onClick={onClick} selected={selected} />
          <WatchlistOldListings onClick={onClick} selected={selected} />
        </>
      )}
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={selectedAsset?.collection || { traitlist: {} }}
        setOpenModal={setModalOpen}
        sort={{
          sort: 'score',
          sortDirection: 'asc',
        }}
      />
    </Box>
  );
};

export default Watchlist;
