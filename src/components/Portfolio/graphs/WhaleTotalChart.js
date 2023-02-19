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

const getIndexData = (data, dateRanges) => ({
  series: [{ data }],
  height: 225,
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
      height: 225,
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
    title: {
      text: 'Value Over Time',
      align: 'left',
      style: {
        color: 'var(--fontColor)',
      },
    },
    markers: {
      size: 5,
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
        text: 'Holdings Value',
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
          formatter: () => 'Holdings Value',
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

const WhaleTotalChart = ({
  policies,
  names,
  category,
  height = 225,
  defaultRange = { name: '1d', label: 'dayHistory' },
  linkToAll,
  image,
}) => {
  const [range, setRange] = useState(
    isMobile ? { name: '1w', label: 'weekHistory' } : defaultRange
  );
  const theme = useTheme();
  const [floors, setFloors] = useState([
    5, 6, 7, 1, -1, -3, -5, 4, 6, 7, 8, 3, 4, 5, 6, 1, 9,
  ]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setLoading(false);
    //  Portfolio request
  }, [range.name]);

  const handleChange = (newRange) => {
    setRange(newRange);
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
          Whales Total Holdings
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
          <span>{totalValue.toLocaleString()} ADA</span>
          <span
            style={{
              fontSize: 14,
              color: changeColor,
              fontWeight: 'normal',
              marginLeft: 5,
            }}
          >
            {loading ? (
              <CircularProgress
                size={14}
                sx={{ marginTop: 0.5, marginLeft: 0.5, color: changeColor }}
              />
            ) : (
              changeText
            )}
          </span>
        </span>
        <FormControl
          variant="standard"
          sx={{
            minWidth: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            '&:focus': { background: 'transparent' },
          }}
        >
          {[
            { name: '1d', label: 'dayHistory' },
            { name: '1w', label: 'weekHistory' },
            { name: '30d', label: 'monthHistory' },
            { name: '3m', label: 'threeMonthHistory' },
            { name: 'all', label: 'allTimeHistory' },
          ].map((item, index) => (
            <Button
              key={index}
              dense
              disableElevation
              variant={range.label === item.label ? 'contained' : 'text'}
              size="small"
              sx={{
                color:
                  range.label === item.label
                    ? 'var(--whiteColor)'
                    : 'var(--fontColor)',
                backgroundColor:
                  range.label === item.label && 'var(--primaryColor)',
                '&:hover': {
                  backgroundColor:
                    !range.label === item.label && 'var(--primaryColor)',
                },
                width: 25,
              }}
              onClick={() => handleChange(item)}
              disabled={loading}
            >
              {item.name}
            </Button>
          ))}
        </FormControl>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50.25 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50.25 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50.25 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50.25 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: height / 50.25 }} />
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

export default WhaleTotalChart;
