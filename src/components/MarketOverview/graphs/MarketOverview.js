import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import TotalMarketVolumeCard from './TotalMarketVolumeCard';
import PopularCollectionsCard from './PopularCollectionsCard';
import TotalCnftsSoldCard from './TotalCnftsSoldCard';
import TotalDatabaseListings from './TotalDatabaseListings';
import TotalDatabaseCollections from './TotalDatabaseCollections';
import TotalMarketplaceVolume from './TotalMarketplaceVolume';
import CollectionsTreemap from './CollectionsTreemap';
import ComingSoon from 'components/common/ComingSoon';
import { Helmet } from 'react-helmet';

// ==============================|| DEFAULT MARKETOVERVIEW ||============================== //

const MarketOverview = () => {
  const [isLoading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    collections: [],
    topWeightCollection: {},
  });
  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // }, 500);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // const response = await axios.get(
      //   'https://cnftpredator-rest-mqorspvwja-lz.a.run.app/collections'
      // );

      // setCollections(response.data.collections);
      setTimeout(() => {
        setLoading(false);
        setDashboard({
          collections: [
            {
              name: 'SpaceBudz',
              id: 1,
              image:
                'https://ipfs.io/ipfs/QmfZXABjPDZaE6Wa4pB4GULJptSJeTr6kEwWJWhqd2WkXX',
              policies: [
                'd5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc',
              ],
              supply: [10000],
              verified: true,
              trades: 100,
              tradesChange: 10,
              volume: 100,
              volumeChange: -10,
              floor: 10,
              floorChange: 5,
            },
            {
              name: 'Clay Nation by Clay Mates',
              id: 2,
              image:
                'https://ipfs.io/ipfs/Qmeurpqfp91Waqh6QFvW3HbWbjC7ad3RLR253WL5hz6MMT',
              policies: [
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728',
              ],
              supply: [10000],
              verified: true,
              trades: 100,
              tradesChange: 10,
              volume: 100,
              volumeChange: -10,
              floor: 10,
              floorChange: 5,
            },
            {
              name: 'Yummi Universe - Naru',
              id: 3,
              image:
                'https://ipfs.io/ipfs/QmfMXw4JMdeEQ7rdFhLBXsGzYbksgjCvaSKAb6nuZuoQ1B',
              policies: [
                'b1814c6d3b0f7a42c9ee990c06c9d504a42bb22bf0e34e7908ae21b2',
              ],
              supply: [10001],
              verified: true,
              trades: 100,
              tradesChange: 10,
              volume: 100,
              volumeChange: -10,
              floor: 10,
              floorChange: 5,
            },
            {
              name: 'Pavia',
              id: 4,
              image:
                'https://ipfs.io/ipfs/QmfTsmWsf99YRXRC4GSqa6H7FHXNVAkL13YTcRK1SQAtnt',
              policies: [
                '4bf184e01e0f163296ab253edd60774e2d34367d0e7b6cbc689b567d',
              ],
              supply: [60000],
              verified: true,
              trades: 100,
              tradesChange: 10,
              volume: 100,
              volumeChange: -10,
              floor: 10,
              floorChange: 5,
            },
            {
              name: 'DEADPXLZ',
              id: 5,
              image:
                'https://ipfs.io/ipfs/QmfFTwDSqJWX9twqMRmp18kNUoFHe1qCCEhPmyawYs2cvj',
              policies: [
                '197ea489a569b7a8f090d31b19d0db39fbd5421ea185508093710f0c',
                '1ec85dcee27f2d90ec1f9a1e4ce74a667dc9be8b184463223f9c9601',
                'f51bb48f7abda3faf0734d6e041b879343fe021a3b74f49a931d6adf',
                '6fff14bc70a47bf1da3ff214f0496af1bb3db51592f96d2e0d933847',
              ],
              supply: [200, 4, 72, 10000],
              verified: true,
              trades: 100,
              tradesChange: 10,
              volume: 100,
              volumeChange: -10,
              floor: 10,
              floorChange: 5,
            },
          ],
          topWeightCollection: {
            name: 'SpaceBudz',
            id: 1,
            image:
              'https://ipfs.io/ipfs/QmfZXABjPDZaE6Wa4pB4GULJptSJeTr6kEwWJWhqd2WkXX',
            policies: [
              'd5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc',
            ],
            supply: [10000],
            verified: true,
            trades: 100,
            tradesChange: 10,
            volume: 100,
            volumeChange: -10,
            floor: 10,
            floorChange: 5,
          },
        });
      }, 1000);
    } catch (err) {
      console.log(err);
      setDashboard({});
    }
  };

  return (
    <>
      <Helmet>
        <title>Below Floor - CNFT Market Analytics and Overview</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalMarketVolumeCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalCnftsSoldCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalDatabaseListings isLoading={isLoading} />
                </Grid>

                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalDatabaseCollections isLoading={isLoading} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TotalMarketplaceVolume isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCollectionsCard
                isLoading={isLoading}
                collections={dashboard.collections}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <CollectionsTreemap
                collection={dashboard.topWeightCollection}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MarketOverview;
