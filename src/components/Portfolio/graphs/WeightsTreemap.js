import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material';
// project imports

import { getCollectionsWorth } from 'apiProvider';
import { nFormatter } from 'utils/formatCurrency';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import MainCard from 'components/MarketAnalysis/graphs/MainCard';
import chartData from './data/weight-treemap-data';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const WeightsTreemap = ({}) => {
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
    <Box sx={{ flex: 4 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          '@media screen and (max-width: 1000px)': {
            flexDirection: 'column',
            rowGap: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
          <span
            style={{
              color: 'var(--fontColor)',
              fontSize: 18,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Collections total worth
          </span>

          {loading ? (
            <CircularProgress
              size={16}
              sx={{ marginLeft: 0.5, color: 'var(--primaryColor)' }}
            />
          ) : (
            <>
              <span>
                {`₳${nFormatter(
                  data.reduce((acc, curr) => acc + curr.inflated_value, 0),
                  2
                )}
            `}
              </span>
            </>
          )}
        </Box>
        <span>Total held 150 collections</span>
      </Box>
      <Box sx={{ width: '100%' }}>
        {loading ? (
          <Skeleton
            height={225}
            sx={{ transform: 'none', mb: '12px' }}
            width="100%"
          />
        ) : (
          <Chart {...chartData({ router, data })} />
        )}
      </Box>
    </Box>
  );
};

export default WeightsTreemap;
