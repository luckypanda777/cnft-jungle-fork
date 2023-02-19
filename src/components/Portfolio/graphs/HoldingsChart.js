import { Skeleton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { getDateCategoriesLineGraph } from './data/mock-collection';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import optionsPolarArea from '../data/options-polar-area-data';
import { HoldingDistributionSkeleton } from '../components/LoadingSkeletons';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const HoldingsChart = ({
  height = 275,
  defaultRange = { name: '1d', label: 'dayHistory' },
  changeTab,
  address,
}) => {
  const router = useRouter();
  const [range, setRange] = useState(
    isMobile ? { name: '1w', label: 'weekHistory' } : defaultRange
  );
  const theme = useTheme();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);
    // setLoading(false);
    //  Portfolio request
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, [range.name, address]);

  const handleChange = (newRange) => {
    setRange(newRange);
  };

  return (
    <Box sx={{ flex: 4, height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span
          style={{
            color: 'var(--fontColor)',
            fontSize: 16,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Holding Distribution
        </span>
        <CustomTooltip title="View all holdings" placement="top">
          <span
            style={{
              color: 'var(--primaryColor)',
              fontSize: 14,
              cursor: 'pointer',
            }}
            onClick={() => changeTab('portfolio')}
          >
            See All
          </span>
        </CustomTooltip>
      </Box>
      {loading ? (
        <HoldingDistributionSkeleton />
      ) : (
        <Chart
          {...optionsPolarArea({
            id: 'collections',
            series: {
              'Collection 1': 50,
              'Collection 2': 30,
              'Collection 3': 20,
              'Collection 4': 10,
              'Collection 5': 5,
              'Collection 6': 4,
              'Collection 7': 3,
              'Collection 8': 2,
              'Collection 9': 1,
            },
          })}
          height={height}
        />
      )}
    </Box>
  );
};

export default HoldingsChart;
