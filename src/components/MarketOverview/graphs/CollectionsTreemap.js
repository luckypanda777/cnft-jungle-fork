import { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports

// chart data
import chartData from './chart-data/collections-treemap-chart';

import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import { getCollectionsWorth } from 'apiProvider';
import { useRouter } from 'next/router';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const CollectionsTreemap = ({}) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollectionData();
  }, []);

  const fetchCollectionData = async () => {
    try {
      const response = await getCollectionsWorth().then(
        (res) => res.InflatedFloorsRankings
      );
      setData(response);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonTotalMarketVolumeCard />
      ) : (
        <MainCard sx={{ mt: 3, borderRadius: '10px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ border: 'none', px: 2 }}
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">
                        Collections total worth
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">₳500.324m</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid item>
                    <span>44500 Collections</span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData({ router, data })} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default CollectionsTreemap;
