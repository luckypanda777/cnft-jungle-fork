import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Skeleton,
} from '@mui/material';
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
import CustomTooltip from 'components/common/CustomTooltip';
import { isMobile } from 'react-device-detect';

const getIndexData = (data, dateRanges) => ({
  series: [{ data }],
  height: 250,
  stacked: false,
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'category-index',
      stacked: false,
      toolbar: {
        show: false,
      },
      height: 250,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -10,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    stroke: {
      width: [4],
      curve: 'smooth',
    },
    colors:
      data[data.length - 1] - data[0] > 0
        ? 'var(--undervaluedColor)'
        : data[data.length - 1] - data[0] === 0
        ? 'goldenrod'
        : 'var(--tradeLoss)',
    markers: {
      size: 3,
      hover: {
        sizeOffset: 6,
      },
    },
    xaxis: {
      ...dateRanges,
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20,
        style: {
          colors: 'var(--fontColor)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Wallet Amount',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
      },
    },
    tooltip: {
      y: {
        title: {
          formatter: () => 'Wallet Amount',
        },
        formatter: (value) => {
          return value.toLocaleString();
        },
      },
      theme: 'dark',
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    legend: {
      labels: {
        colors: 'var(--fontColor)',
      },
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          ' - ' +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ''
        );
      },
    },
  },
});

const HoldersHistory = ({
  policies,
  names,
  category,
  height = 210,
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

  const totalValue = 17236323;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          Holders History
          <CustomTooltip
            title="How many wallets are holding at least one asset from this
                  collection"
          />
          {loading ? (
            <CircularProgress
              size={16}
              sx={{ marginLeft: 0.5, color: 'var(--primaryColor)' }}
            />
          ) : (
            <>
              <span>{totalValue.toLocaleString()} Wallets</span>
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
    </Box>
  );
};

export default HoldersHistory;
