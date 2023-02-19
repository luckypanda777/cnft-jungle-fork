import { Button, CircularProgress, FormControl, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { getAnalyticsIndex, getFullFloorHistory } from 'apiProvider';
import { colors } from 'components/MarketAnalysis/graphs/chart-data/graph-constants';
import MainCard from 'components/MarketOverview/graphs/MainCard';
import { useAppContext } from 'context/AppContext';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { getDateCategoriesLineGraph } from './data/mock-collection';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import FilterButton from 'components/buttons/FilterButton';
import { isMobile } from 'react-device-detect';
import CustomTooltip from 'components/common/CustomTooltip';

const getIndexData = (
  data = [
    {
      name: 'Net Profit',
      data: data,
    },
    {
      name: 'Revenue',
      data: data,
    },
    {
      name: 'Free Cash Flow',
      data: data,
    },
  ],
  dateRanges
) => ({
  series: [
    {
      name: 'List',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 85, 101, 98, 87],
    },
    {
      name: 'Delist',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 58, 63, 60, 66],
    },
  ],
  type: 'bar',
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      stacked: false,
      toolbar: {
        show: false,
      },
      height: 240,
      type: 'bar',
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    // stroke: {
    //   show: true,
    //   width: 2,
    //   colors: ['transparent'],
    // },
    xaxis: {
      // categories: dateRanges,
    },
    yaxis: {
      title: {
        text: 'Amount',
      },
    },
    // fill: {
    //   opacity: 1,
    // },
    colors,
  },
});

const ListingsChart = ({
  policies,
  names,
  category,
  height = 240,
  defaultRange = { name: '1d', label: 'dayHistory' },
  linkToAll,
  image,
}) => {
  const [range, setRange] = useState(
    isMobile ? { name: '1w', label: 'weekHistory' } : defaultRange
  );
  const theme = useTheme();
  const [floors, setFloors] = useState([
    5, 4, 3, 2, 7, 8, 2, 3, 1, 3, 6, 7, 3, 4, 5, 6, 1, 2, 3, 4, 2, 1,
  ]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   setLoading(true);
  //   setLoading(false);
  //   //  Portfolio request
  // }, [range.name]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, []);

  const handleChange = (newRange) => {
    setRange(newRange);
    setLoading(true);
    setTimeout(() => {
      setFloors(
        newRange.name === '1w'
          ? [5, 4, 3, 2, 7, 8, 2]
          : newRange.name === '1d'
          ? [5, 4, 3, 2, 7, 8, 2, 3, 1, 3, 6, 7, 3, 4, 5, 6, 1, 2, 3, 4, 2, 1]
          : newRange.name === '3m'
          ? [5, 4, 3, 2, 7, 8, 2, 3, 1, 3, 6, 7, 3, 4]
          : newRange.name === 'all'
          ? [5, 4, 3, 2, 7, 8, 2, 3, 1, 3, 6, 7]
          : [5, 6, 7, 1, -1, -3, -5, 4, 6, 7, 8, 3]
      );
      setLoading(false);
    }, 750);
  };

  const graphData = useMemo(() => floors, [loading, range.name]);
  const change = (floors[floors.length - 1] - floors[0]) / floors[0];
  const changeColor =
    change > 0
      ? 'var(--undervaluedColor)'
      : change < 0
      ? 'var(--tradeLoss)'
      : 'goldenrod';
  const plus = change > 0 ? '+' : '';
  const changeText = change
    ? `(${plus}${(change * 100).toFixed(2)}%)`
    : '(=0%)';

  const totalValue = 1723;

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
        <span
          style={{
            color: 'var(--fontColor)',
            fontSize: 18,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Activity
          <CustomTooltip
            title={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3 style={{ marginTop: 10, marginBottom: 0 }}>
                  Contact us to add a collection to this index
                </h3>
              </div>
            }
          >
            <InfoOutlinedIcon fontSize="small" sx={{ mx: 0.5 }} />
          </CustomTooltip>
          {loading ? (
            <CircularProgress
              size={16}
              sx={{ marginLeft: 0.5, color: 'var(--primaryColor)' }}
            />
          ) : (
            <>
              <span>{totalValue.toLocaleString()} Actions</span>
              <span
                style={{
                  fontSize: 14,
                  color: changeColor,
                  fontWeight: 'normal',
                  marginLeft: 5,
                }}
              >
                {changeText}
              </span>
            </>
          )}
        </span>
        <Box sx={{ display: 'flex', columnGap: 1 }}>
          {[
            { name: '1d', label: 'dayHistory' },
            { name: '1w', label: 'weekHistory' },
            { name: '30d', label: 'monthHistory' },
            { name: '3m', label: 'threeMonthHistory' },
            { name: 'all', label: 'allTimeHistory' },
          ].map((item, index) => (
            <Box>
              <span
                style={{
                  color:
                    range.label === item.label
                      ? 'var(--logoColor)'
                      : 'var(--fontColor)',
                  textDecoration: range.label === item.label && 'underline',
                  textDecorationColor:
                    range.label === item.label
                      ? 'var(--logoColor)'
                      : 'var(--fontColor)',
                  cursor: 'pointer',
                }}
                onClick={() => handleChange(item)}
              >
                {item.name}
              </span>
            </Box>
          ))}
        </Box>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50 }} />
        </>
      ) : (
        <Chart
          {...getIndexData(
            graphData,
            getDateCategoriesLineGraph(range.name, floors.length)
          )}
          height={height}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {linkToAll && (
          <FilterButton
            pressable
            style={{ fontSize: 12 }}
            onClick={() => router.push('/Indexes')}
          >
            See All Indexes &#8594;
          </FilterButton>
        )}
      </Box>
    </Box>
  );
};

export default ListingsChart;
