import { useEffect, useState } from 'react';
import styles from './Assets.module.scss';
import ScrollToTopOnMount from '../common/ScrollToTop/ScrollToTop';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import AssetHeader from '../layout/AssetHeader';
import AssetsTab from './tabs/AssetsTab';
import TradingTab from './tabs/TradingTab';
import SalesTab from './tabs/Sales';
import NotFound from 'components/layout/NotFound';
import { useRouter } from 'next/router';
import { collectionNameToIdMapping } from './collectionMappings';
import { getLocationSearch } from 'utils/getSearch';
import { useAppContext } from 'context/AppContext';
import FilterButton from 'components/buttons/FilterButton';
import moment from 'moment';
import Footer from 'components/layout/Footer';
import CollectionTabs from './CollectionTabs';

const CollectionAnalyticsTab = dynamic(
  () => import('./tabs/CollectionAnalytics'),
  {
    ssr: false,
  }
);

const HoldersTab = dynamic(() => import('./tabs/Holders'), {
  ssr: false,
});

const CollectionHoldingsTab = dynamic(() => import('./tabs/Holdings'), {
  ssr: false,
});

const TraitExplorerTab = dynamic(() => import('./tabs/TraitExplorer'), {
  ssr: false,
});

const TABS = [
  {
    name: 'Trading',
    label: 'trading',
    number: 0,
    component: TradingTab,
    desktopOnly: true,
  },
  {
    name: 'Assets',
    label: 'assets',
    number: 1,
    component: AssetsTab,
  },
  {
    name: 'Sales',
    label: 'sales',
    number: 2,
    component: SalesTab,
    new: true,
  },
  {
    name: 'Traits',
    label: 'traits',
    desktopOnly: true,
    number: 3,
    component: TraitExplorerTab,
  },
  // {/* [TODO] bookmark uncomment */}
  // {
  //   name: 'Holders',
  //   label: 'holders',
  //   desktopOnly: true,
  //   number: 3,
  //   component: HoldersTab,
  // },
  {
    name: 'Analytics',
    label: 'analytics',
    number: 4,
    component: CollectionAnalyticsTab,
  },
  {
    name: 'My NFTs',
    label: 'holdings',
    desktopOnly: true,
    number: 5,
    component: CollectionHoldingsTab,
  },
];

const Assets = ({ collection, collectionData }) => {
  const router = useRouter();
  const search = getLocationSearch();
  const { state } = useAppContext();
  const { isMobile } = state;
  const [tab, setTab] = useState(TABS[0]);

  const notFound =
    !collectionData && !collectionNameToIdMapping[collection.toLowerCase()];
  const collectionName = collection || search.collection;

  const collectionRoute = notFound
    ? ''
    : collectionNameToIdMapping[collectionName?.toLowerCase()]
    ? `/${collection}`
    : `/collections/${collection}`;

  const handleTab = (newValue) => {
    setTab(newValue);

    router.push(
      {
        pathname: collectionRoute,
        query: { tab: newValue.label },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const params = getLocationSearch();
    if ('tab' in params) {
      const urlTab = TABS.find((t) => t.label === params.tab);
      setTab(urlTab || TABS[0]);
    } else {
      setTab(TABS[0]);
    }
  }, [collection, router.query]);

  const TabComponent = tab.component;

  const isUpcoming =
    collectionData?.collection?.upcoming &&
    collectionData?.collection?.addedAt >
      parseInt(moment().utc().unix() * 1000) &&
    !collectionData?.collection?.supply > 0;

  if (isUpcoming) {
    return <AssetHeader />;
  }

  return (
    <Box>
      <ScrollToTopOnMount />
      {!notFound && <AssetHeader />}
      <Box className={styles.body}>
        <Box className={styles.main}>
          {notFound ? (
            <Box className={styles.notfound}>
              <NotFound title="Page not found" />
            </Box>
          ) : (
            <>
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  columnGap: 2,
                  p: 2,
                  background: 'transparent',
                  alignItems: 'center',
                  fontFamily: 'newgilroybold',
                }}
              >
                {TABS.map((info) => {
                  if (info.desktopOnly && isMobile) return null;

                  if (!isMobile) {
                    return (
                      <Box>
                        <span
                          style={{
                            cursor: 'pointer',
                            color:
                              tab.number === info.number
                                ? 'var(--fontColor)'
                                : '#BDBEC6',
                            borderBottom:
                              tab.number === info.number &&
                              '2px solid var(--logoColor)',
                            fontFamily: 'newgilroysemibold',
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'var(--logoColor)',
                            },
                          }}
                          onClick={() => handleTab(info)}
                        >
                          {info.name}
                        </span>
                      </Box>
                    );
                  }

                  return (
                    <FilterButton
                      key={info.number}
                      onChange={() => handleTab(info)}
                      value={tab.number === info.number}
                      className={styles.iconTab}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: isMobile ? '7.5px 20px' : '10px 25px',
                        fontSize: isMobile ? 12 : 12,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                      }}
                    >
                      {info.name}
                    </FilterButton>
                  );
                })}
              </Box> */}
              <CollectionTabs />
              <TabComponent
                collection={collection}
                collectionData={collectionData}
                handleTab={handleTab}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Assets;
