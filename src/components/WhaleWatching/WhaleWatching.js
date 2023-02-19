import styles from './WhaleWatching.module.scss';
import dynamic from 'next/dynamic';
import TextHeader from 'components/common/TextHeader';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import orca from 'assets/jungleorca.png';
import WhaleActivityBoxes from './WhaleActivityBoxes';
import CollectionTable from 'components/CollectionTable';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { getCollections, getCollectionTable } from '../../apiProvider';
import { useAppContext } from '../../context/AppContext';
import { Box, Grid } from '@mui/material';
import useDebounce from '../../hooks/useDebounce';
import { additionalFeatured } from 'components/boxes/FeaturedBox/additional-featured';

const WhaleTotalChart = dynamic(
  () => import('components/Portfolio/graphs/WhaleTotalChart'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const MarketSentiment = dynamic(
  () => import('components/Portfolio/graphs/MarketSentiment'),
  {
    ssr: false,
    loading: () => <Box sx={{ minHeight: '80px' }} />,
  }
);

const WhaleWatching = ({ data }) => {
  const location = useRouter();
  const [collections, setCollections] = useState([]);
  const [infiniteLoading, setInfiniteLoading] = useState(!data);
  const [filterLoading, setFilterLoading] = useState(false);
  const [page, setPage] = useState(data ? 2 : 1);
  const [totalCollections, setTotalCollections] = useState(data?.total || 0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sort, setSort] = useState({
    sort: 'volume',
    sortDirection: 'desc',
  });
  const [filters, setFilters] = useState({});
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [loadingTablePage, setLoadingTablePage] = useState(false);

  const { state } = useAppContext();
  const { isMobile } = state;

  const collectionsLength = useRef(null);
  const pageRef = useRef(null);

  collectionsLength.current = collections.length;
  pageRef.current = page;

  const searchQuery = query ? { query } : {};

  useEffect(() => {
    /*setLocalFilters({
      display: getFromLocalStorage('collectionDisplay', 'string', 'large'), r
    });*/

    setCollections(data ? data.collections : Array.from(new Array(30)));

    if (location.pathname === '/' && !data) {
      setPage(1);
      setSort({
        sort: 'volume',
        sortDirection: 'desc',
      });
      return;
    }
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setInfiniteLoading(false);
      setDataLoaded(true);
      collectionsLength.current = data.collections.length;
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
    if (
      infiniteLoading &&
      (totalCollections === 0 ? true : totalCollections > collections.length)
    ) {
      getCollectionTable({
        page,
        perPage: 25,
        ...sort,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      })
        .then((response) => {
          const hardcodeUpcoming = page === 1 ? additionalFeatured : [];
          setCollections((prevState) =>
            page === 1
              ? []
                  .concat([...hardcodeUpcoming, ...response.collections])
                  .filter(
                    (value, index, self) =>
                      index === self.findIndex((t) => t.id === value.id)
                  )
              : prevState.concat([...hardcodeUpcoming, ...response.collections])
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
      getCollectionTable({
        page,
        perPage: 25,
        ...sort,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      })
        .then((response) => {
          setCollections(response.collections);
          setPage(page + 1);
          setTotalCollections(response.total);
          collectionsLength.current = collections.length;
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

  const fetchCollectionTable = useCallback(async () => {
    setLoadingTablePage(true);
    try {
      const resp = await getCollectionTable({
        page,
        perPage: 25,
        ...sort,
        ...filters,
        ...searchQuery,
        whitelist: state?.wallet || localStorage.getItem('wallet'),
      });

      setCollections((prevState) =>
        page === 1
          ? []
              .concat(resp.collections)
              .filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.id === value.id)
              )
          : prevState.concat(resp.collections)
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

  const infiniteScroll = (e) => {
    const documentEl = e.target.documentElement;

    if (
      !collectionsLength.current &&
      (pageRef.current === 1 || pageRef.current === 2)
    )
      return;

    if (
      documentEl.scrollHeight - (documentEl.scrollTop + window.innerHeight) <
        1000 &&
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
  };

  const loading = infiniteLoading || filterLoading || loadingTablePage;
  const noRecords = !loading && collections.length === 0;
  const items = collections.length ? collections : Array.from(new Array(30));

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', columnGap: 10 }}>
            <span>Cardano Whale Watching</span>
            <img src={orca.src} style={{ width: 60, height: 40 }} />
          </div>
        }
        subtitle={
          <h2
            style={{
              marginTop: 0,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              fontSize: 16,
            }}
          >
            Track whale trades realtime, watch movements of market makers.
          </h2>
        }
        titleStyle={{ marginTop: 0 }}
        titleStyleMobile={{ marginTop: 0, fontSize: 24 }}
        subtitleStyleMobile={{ marginTop: 0, fontSize: 22 }}
        socialsStyle={{ marginBottom: 20 }}
        socialsStyleMobile={{ marginBottom: 20 }}
      />
      <Grid
        container
        sx={{ width: '100%', mx: 'auto', display: 'flex', columnGap: 2 }}
        justifyContent="space-between"
      >
        <WhiteCard sx={{ mx: 0, flex: 1, width: '45%' }}>
          <MarketSentiment />
        </WhiteCard>
        <WhiteCard sx={{ mx: 0, flex: 1, width: '45%' }}>
          <WhaleTotalChart />
        </WhiteCard>
      </Grid>
      <WhaleActivityBoxes />
      <Box
        className={styles.collections}
        sx={{ backgroundColor: 'var(--sidebarBg) !important' }}
      >
        {noRecords && !filterLoading ? (
          <Box className={styles.noRecords}>
            <NotFound title="No collections found." />
          </Box>
        ) : (
          <CollectionTable
            collections={collections}
            loading={!collections.length || filterLoading}
            setFilters={setFilters}
            setPage={setPage}
            filters={filters}
            handleFilterChange={handleFilterChange}
            fetchCollectionTable={fetchCollectionTable}
            totalCollections={totalCollections}
          />
        )}
      </Box>
    </Grid>
  );
};

export default WhaleWatching;
