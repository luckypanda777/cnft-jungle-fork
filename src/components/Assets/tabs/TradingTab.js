import { Box } from '@mui/material';
import TrendingCollections from 'components/TrendingCollections/TrendingCollections';
import useWindowSize from 'hooks/useWindowSize';
import { useAppContext } from 'context/AppContext';
import { useEffect } from 'react';
import LiveViews from './LiveViews';
import dynamic from 'next/dynamic';
import Footer from 'components/layout/Footer';
import WatchlistCollections from 'components/WatchlistCollections/WatchlistCollections';
import CollectionMarketDepth from './CollectionMarketDepth';
import CollectionWhales from './CollectionWhales';
import Faqs from 'components/layout/Faqs';

const TraidingViewChart = dynamic(
  () => import('components/TradingView/TradingViewChart'),
  { ssr: false }
);

const TradingTab = ({ collection, collectionData }) => {
  const { state, setCollection } = useAppContext();
  const { width } = useWindowSize();

  useEffect(() => {
    if (collectionData && collectionData.collection) {
      setCollection(collectionData.collection);
    }
  }, [collectionData]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        pt: 0,
        height: 'fit-content',
      }}
    >
      <TrendingCollections
        policyId={collectionData.collection.policies}
        collectionId={collectionData.collection.id}
        name={collectionData.collection.collection_name}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 10,
          gap: 3,
          flexDirection: width < 1250 ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            flex: 3,
            height: '70vh',
            backgroundColor: 'var(--bgColor)',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: 660,
            minHeight: 660,
          }}
        >
          <TraidingViewChart
            policyId={collectionData.collection.policies}
            name={collectionData.collection.collection_name}
          />
        </Box>
        <LiveViews
          policyId={collectionData.collection.policies}
          selectedTraits={{}}
          filters={{}}
          collection={collectionData.collection}
        />
      </Box>
      {/* [NOTE] comment out when guchi.io live */}
      {/* <CollectionMarketDepth collection={collection} /> */}
      <WatchlistCollections />
      <CollectionWhales />
      <Faqs collection={collectionData.collection} />
      <Footer elements={['footer']} />
    </Box>
  );
};

export default TradingTab;
