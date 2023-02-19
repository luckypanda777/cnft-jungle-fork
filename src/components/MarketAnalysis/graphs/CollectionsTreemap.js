import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
// project imports

// chart data
import chartData from './chart-data/collections-treemap-chart';

import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import { getCollectionsWorth } from 'apiProvider';
import { nFormatter } from 'utils/formatCurrency';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
        (res) => res.InflatedFloorsRankings || []
      );
      setData(response);
    } catch (err) {
      setData([]);
    }
    setLoading(false);
  };

  return (
    <MainCard
      sx={{ mt: 3, borderRadius: '10px', minHeight: '560px' }}
      elevation={0}
    >
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
                  <Typography variant="h3">
                    ₳
                    {loading ? (
                      <CircularProgress size={25} sx={{ ml: 2 }} />
                    ) : (
                      nFormatter(
                        data.reduce(
                          (acc, curr) => acc + curr.inflated_value,
                          0
                        ),
                        2
                      )
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item>
                <span>Top 100 Collections by market cap</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton height={440} sx={{ transform: 'none' }} />
          ) : (
            <Chart {...chartData({ router, data })} />
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CollectionsTreemap;
