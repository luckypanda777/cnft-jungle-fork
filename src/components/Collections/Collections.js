import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './Collections.module.scss';
import {
  getCollections,
  getCollectionTable,
  getFeatured,
} from '../../apiProvider';
import { useAppContext } from '../../context/AppContext';
import { Box, CircularProgress, Grid, Link } from '@mui/material';
import CollectionCard from '../cards/CollectionCard';
import ScrollToTopOnMount from '../common/ScrollToTop';
import FilterAccordion from '../common/FilterAccordion/FilterAccordion';
import NotFound from 'components/layout/NotFound';
import AddCollectionModal from '../modals/AddCollectionModal';
import useDebounce from '../../hooks/useDebounce';
import dynamic from 'next/dynamic';
import TextHeader from 'components/common/TextHeader';
import ListPeriodFilters from '../filters/ListPeriodFilters';
import SlidingTextHeader from '../common/SlidingTextHeader';
import { additionalFeatured } from 'components/boxes/FeaturedBox/additional-featured';
import useWindowSize from 'hooks/useWindowSize';
import TryMobile from './TryMobile';
import classNames from 'classnames';
import MarketStatsBox from '../boxes/MarketStatBox';
import Footer from 'components/layout/Footer';

const CollectionFilters = dynamic(
  () => import('../filters/CollectionFilters'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '100px' }} />,
  }
);

const FeaturedBox = dynamic(() => import('../boxes/FeaturedBox'), {
  ssr: false,
});

// test
const ApiData = dynamic(() => import('../../../pages/data'), {
  ssr: false,
});

const MarketOverview = dynamic(() => import('../MarketOverview'), {
  ssr: false,
  loading: () => <Box sx={{ minHeight: '500px' }} />,
});

const CollectionTable = dynamic(() => import('../CollectionTable'), {
  ssr: false,
  loading: () => <Box sx={{ minHeight: '100px' }} />,
});

const Collections = ({ menuOpen, data, minting = false, calendar = false }) => {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [infiniteLoading, setInfiniteLoading] = useState(!data);
  const [filterLoading, setFilterLoading] = useState(false);
  const [page, setPage] = useState(data ? 2 : 1);
  const [totalCollections, setTotalCollections] = useState(data?.total || 0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sort, setSort] = useState({
    sort: calendar ? 'recent' : minting ? 'popularity' : 'timestamp_volume',
    sortDirection: calendar ? 'asc' : 'desc',
  });
  const [filters, setFilters] = useState({});
  const [query, setQuery] = useState('');
  //const [display, setDisplay] = useState('large');
  const [addCollectionOpen, setAddCollectionOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const [loadingTablePage, setLoadingTablePage] = useState(false);

  const { state } = useAppContext();
  const { isMobile } = state;
  const { width } = useWindowSize();

  const collectionsLength = useRef(null);
  const pageRef = useRef(null);

  collectionsLength.current = collections?.length;
  pageRef.current = page;

  const searchQuery = query ? { query } : {};

  const isGallery = useMemo(
    () =>
      (location.pathname !== '/' || location.pathname !== '/collections') &&
      (calendar || minting),
    [location.pathname, calendar, minting]
  );

  useEffect(() => {
    /*setLocalFilters({
      display: getFromLocalStorage('collectionDisplay', 'string', 'large'), r
    });*/

    setCollections(data ? data.collections : Array.from(new Array(30)));

    if (location.pathname === '/' && !data) {
      setPage(1);
      setSort({
        sort: 'timestamp_volume',
        sortDirection: 'desc',
      });
      return;
    }

    if (['/collections', '/minting'].includes(location.pathname) && !data) {
      setPage(1);
      return setSort({
        sort: 'popularity',
        sortDirection: 'desc',
      });
    }

    if (location.pathname === '/calendar') {
      setPage(1);
      return setSort({
        sort: 'recent',
        sortDirection: 'asc',
      });
    }
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setInfiniteLoading(false);
      setDataLoaded(true);
      collectionsLength.current = data.collections?.length;
    }
  }, [data]);

  useEffect(() => {
    if (location.pathname === '/') return;

    document.addEventListener('scroll', infiniteScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', infiniteScroll);
    };
  }, [totalCollections]);

  useEffect(() => {
    if (totalCollections === 0 ? true : totalCollections > collections.length) {
      (isGallery ? getCollections : getCollectionTable)({
        page,
        perPage: 25,
        ...sort,
        upcoming: calendar,
        mintingNow: minting,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      })
        .then(async (response) => {
          if (!response?.collections) return;

          const featuredData = await getFeatured();

          const hardcodeUpcoming =
            (calendar || minting) && page === 1 ? featuredData.collections : [];

          setCollections((prevState) =>
            page === 1
              ? []
                  .concat([
                    ...hardcodeUpcoming,
                    ...(response?.collections || []),
                  ])
                  .filter(
                    (value, index, self) =>
                      index === self.findIndex((t) => t.id === value.id)
                  )
              : prevState.concat([
                  ...hardcodeUpcoming,
                  ...(response?.collections || []),
                ])
          );
          setPage(page + 1);
          setInfiniteLoading(false);
          setTotalCollections(response.total);
          setDataLoaded(true);
        })
        .catch((err) => {
          setCollections([]);
          setTotalCollections(0);
          collectionsLength.current = 0;
          setFilterLoading(false);
        });
    } else {
      setInfiniteLoading(false);
    }
  }, [infiniteLoading]);

  useEffect(() => {
    if (dataLoaded && !infiniteLoading) {
      setFilterLoading(true);
      (isGallery ? getCollections : getCollectionTable)({
        page,
        perPage: 25,
        ...sort,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      })
        .then((response) => {
          if (!response?.collections) return;

          setCollections(response.collections);
          setPage(page + 1);
          setTotalCollections(response.total);
          collectionsLength.current = collections?.length;
          setFilterLoading(false);
        })
        .catch((err) => {
          setCollections([]);
          setTotalCollections(0);
          collectionsLength.current = 0;
          setFilterLoading(false);
        });
    }
  }, [sort, filters, debouncedQuery]);

  useEffect(() => {
    if (minting || calendar) {
      setPage(1);
      setCollections([]);
      setFilters({
        ...filters,
        upcoming: calendar,
        mintingNow: minting,
        liked: undefined,
      });
    }
  }, [minting, calendar]);

  const fetchCollectionTable = useCallback(async () => {
    setLoadingTablePage(true);
    try {
      const resp = await getCollectionTable({
        page,
        perPage: 25,
        ...sort,
        upcoming: calendar,
        mintingNow: minting,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      });

      const hardcodeUpcoming =
        (calendar || minting) && page === 1 ? additionalFeatured : [];

      setCollections((prevState) =>
        page === 1
          ? []
              .concat([...hardcodeUpcoming, ...resp.collections])
              .filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.collection_name === value.collection_name
                  )
              )
          : prevState.concat(
              [...hardcodeUpcoming, ...resp.collections].filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.collection_name === value.collection_name
                  )
              )
            )
      );
      setPage(page + 1);
      setTotalCollections(resp.total);
      setDataLoaded(true);
    } catch (e) {
      setCollections([]);
      setTotalCollections(0);
      collectionsLength.current = 0;
      setFilterLoading(false);
    }
    setLoadingTablePage(false);
  }, [page, sort, filters, searchQuery]);

  // redirect to assets page
  const onClick = (e, collection) => {
    if (!collection?.policies && !collection?.id) {
      let website = collection.socials?.website;

      try {
        const socials = JSON.parse(collection.socials);
        website = socials?.website;
      } catch (err) {}

      return window.open(website, '_blank');
    }

    const link = `/collections/${collection?.policies || collection?.id}`;
    if (e.metaKey) {
      return window.open(link, '_blank');
    }

    if (collection) {
      router.push(link);
    }
  };

  const infiniteScroll = (e) => {
    const documentEl = e.target.documentElement;

    if (
      !collectionsLength.current &&
      (pageRef.current === 1 || pageRef.current === 2)
    )
      return;

    if (
      documentEl.scrollHeight - (documentEl.scrollTop + window.innerHeight) <
        800 &&
      collectionsLength.current < totalCollections
    ) {
      setInfiniteLoading(true);
    }
  };

  const handleSort = (e) => {
    const {
      target: { value },
    } = e;
    const [sort, sortDirection] = value
      .split(/(?=[A-Z])/)
      .map((s) => s.toLowerCase());

    if (sort === 'volume' || sort === 'floor') {
      setFilters({ hideSmall: true });
    }
    setPage(1);
    setSort({ sort, sortDirection });
  };

  const handleFilterChange = (name, state) => {
    setPage(1);
    setFilters((prevState) => {
      const temp = { ...prevState, [name]: state };
      if (!state) {
        delete temp[name];
      }
      return temp;
    });

    if (name === 'mintingNow' && !state) return location.push('/');
  };

  const loading = infiniteLoading || filterLoading || loadingTablePage;
  const noRecords = !loading && collections?.length === 0;
  const items = collections?.length ? collections : Array.from(new Array(30));

  const subdomain = /:\/\/([^\/]+)/.exec(window?.location?.href)[1];
  if (subdomain.includes('developers')) {
    return <ApiData />;
  }

  if (isMobile) {
    return <TryMobile />;
  }

  return (
    <>
      <ScrollToTopOnMount />
      <Box className={styles.main}>
        <Box
          className={
            menuOpen
              ? styles.collectionsContainerMenuOpen
              : styles.collectionsContainer
          }
          sx={{
            marginTop: (calendar || minting) && '20px !important',
            marginBottom: 10,
          }}
        >
          {!calendar && !minting && (
            <>
              <Box
                className={styles.mainSection}
                sx={{
                  flexDirection: width < 1000 ? 'column' : 'row',
                  marginBottom: 2,
                }}
              >
                <div
                  className={styles.mainBgImage}
                  style={{ backgroundImage: `url(/homepage-bg.svg)` }}
                />
                <SlidingTextHeader noTopMargin />
              </Box>
              {/* <Grid
                item
                xs={12}
                sx={{ width: '100%', paddingLeft: '0 !important', mt: 4 }}
              >
                <MarketStatsBox />
              </Grid> */}
              <Grid
                container
                spacing={3}
                sx={{ width: '100%', mx: 'auto', paddingLeft: 0 }}
              >
                <Box
                  className={styles.featuredBox}
                  sx={{
                    marginBottom: isMobile ? 1 : 0,
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <FeaturedBox isMobile={isMobile} />
                  <Box
                    sx={{
                      fontSize: 14,
                      width: 'fit-content',
                      borderBottom: '2px solid var(--logoColor)',
                      fontFamily: 'newgilroysemibold',
                      cursor: 'pointer',
                      alignSelf: 'flex-end',
                      '&:hover': {
                        color: 'var(--logoColor)',
                      },
                      mx: 'auto',
                      marginTop: 1,
                    }}
                    onClick={() => router.push('/promotions')}
                  >
                    Advertise with Jungle
                  </Box>
                </Box>
              </Grid>
              <MarketOverview />
            </>
          )}
          <div
            className={styles.sectionTitleContainer}
            style={{
              marginTop: calendar || minting ? 100 : 60,
              marginBottom: 60,
            }}
          >
            <h1
              className={classNames(
                styles.sectionTitle,
                styles.titleStatistics
              )}
            >
              {calendar ? 'Upcoming' : minting ? 'Minting' : 'Movement'}
            </h1>
          </div>
          {/* {!isMobile && !calendar && !minting && <CollectionsTreemap />} */}
          {isGallery ? (
            <FilterAccordion style={isMobile && { width: '100%' }}>
              <CollectionFilters
                calendar={calendar}
                handleSort={handleSort}
                handleFilterChange={handleFilterChange}
                setAddCollectionOpen={setAddCollectionOpen}
                filters={filters}
                sort={sort}
                loading={loading}
                totalCollections={totalCollections}
              />
            </FilterAccordion>
          ) : (
            !isMobile && (
              <ListPeriodFilters
                loading={loading}
                handleFilterChange={handleFilterChange}
              />
            )
          )}
          {isMobile && loading && (
            <Box className={styles.loader}>
              <CircularProgress size={20} />
            </Box>
          )}
          <Box
            className={styles.collections}
            sx={{
              backgroundColor:
                !minting && !calendar && 'var(--sidebarBg) !important',
            }}
          >
            {noRecords && !filterLoading ? (
              <Box className={styles.noRecords}>
                <NotFound title="No collections found." />
              </Box>
            ) : isGallery ? (
              items.map((collection, i) => (
                <CollectionCard
                  key={collection?.policies + i || i}
                  loading={!collection || filterLoading}
                  index={i}
                  {...collection}
                  onClick={(e) => onClick(e, collection)}
                />
              ))
            ) : (
              <CollectionTable
                collections={collections}
                loading={!collections?.length || filterLoading}
                setFilters={setFilters}
                setPage={setPage}
                filters={filters}
                handleFilterChange={handleFilterChange}
                fetchCollectionTable={fetchCollectionTable}
                totalCollections={totalCollections}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Footer
        elements={
          calendar || minting ? ['footer'] : ['data', 'twitter', 'footer']
        }
      />
      <AddCollectionModal
        open={addCollectionOpen}
        setOpenModal={setAddCollectionOpen}
      />
    </>
  );
};

export default Collections;
