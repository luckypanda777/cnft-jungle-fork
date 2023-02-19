import { Button, FormControl, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { getFullFloorHistory } from 'apiProvider';
import { colors } from 'components/MarketAnalysis/graphs/chart-data/graph-constants';
import { useAppContext } from 'context/AppContext';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { getDateCategoriesLineGraph } from './data/mock-collection';
import CustomTooltip from 'components/common/CustomTooltip';

const fullFloorHistoryData = (data, dateRanges, minimizedFormat) => ({
  series: data,
  height: minimizedFormat ? 200 : 350,
  options: {
    chart: {
      animations: {
        enabled: false,
      },
      id: 'full-floor',
      toolbar: {
        show: false,
      },
      height: minimizedFormat ? 200 : 350,
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
      width: 2,
      curve: 'smooth',
    },
    colors,
    title: {
      // text: minimizedFormat?'Sale floor history',
      align: 'left',
      style: {
        color: 'var(--fontColor)',
      },
    },
    markers: {
      size: 0,
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
    yaxis: [
      {
        title: {
          text: minimizedFormat ? '' : 'Price in ADA',
          style: {
            color: 'var(--fontColor)',
          },
        },
        labels: {
          style: {
            colors: 'var(--fontColor)',
          },
        },
        // opposite: true,
      },
      {
        opposite: true,
        title: {
          text: 'Price in ADA',
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
    ],
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val;
            },
          },
        },
        {
          title: {
            formatter: function (val) {
              return val;
            },
          },
        },
        {
          title: {
            formatter: function (val) {
              return val;
            },
          },
        },
      ],
      theme: 'dark',
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    legend: {
      // show: !minimizedFormat,
      show: true,
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

const FullFloorHistoryChart = ({ minimizedFormat }) => {
  const { state } = useAppContext();
  const [range, setRange] = useState({ name: '1w', label: 'weekHistory' });
  const theme = useTheme();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (state.collection.policies) {
      setLoading(true);
      getFullFloorHistory(state.collection.policies, { period: range.name })
        .then((res) => {
          if (isActive) {
            const tradeHistory = res.data || [];
            setTrades(tradeHistory);
            // setTrades(mockResponse);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [state.collection, range.name]);

  const handleChange = (newRange) => {
    setRange(newRange);
  };

  // make 3 objects from mockResponse with avg, max and min and data containing values
  const mockMin = {
    name: 'Min sale',
    data: trades
      .slice(
        0,
        getDateCategoriesLineGraph(range.name, trades.length).tickAmount
      )
      .map((f) => f.min),
  };
  const mockMax = {
    name: 'Max sale',
    data: trades
      .slice(
        0,
        getDateCategoriesLineGraph(range.name, trades.length).tickAmount
      )
      .map((f) => f.max),
  };
  const mockAvg = {
    name: 'Avg sale',
    data: trades
      .slice(
        0,
        getDateCategoriesLineGraph(range.name, trades.length).tickAmount
      )
      .map((f) => parseInt(f.avg)),
  };

  const graphData = useMemo(() => [mockMin, mockAvg], [trades, range.name]);

  return (
    <Box
      sx={{
        borderRadius: '10px',
        backgroundColor: 'var(--bgColor)',
        overflow: 'hidden',
      }}
    >
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
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Sales Floor History
          <CustomTooltip
            title="Sales price change over a certain period of time"
            placement="top"
          />
        </span>
        {!minimizedFormat && (
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
              { name: '1y', label: 'yearHistory' },
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
        )}
      </Box>
      {loading ? (
        <Box sx={{ px: 4 }}>
          <Skeleton
            height={5}
            sx={{ transform: 'none', my: minimizedFormat ? 3.25 : 6.5 }}
          />
          <Skeleton
            height={5}
            sx={{ transform: 'none', my: minimizedFormat ? 3.25 : 6.5 }}
          />
          <Skeleton
            height={5}
            sx={{ transform: 'none', my: minimizedFormat ? 3.25 : 6.5 }}
          />
          <Skeleton
            height={5}
            sx={{ transform: 'none', my: minimizedFormat ? 3.25 : 6.5 }}
          />
          <Skeleton
            height={5}
            sx={{ transform: 'none', my: minimizedFormat ? 3.25 : 6.5 }}
          />
        </Box>
      ) : (
        <Chart
          {...fullFloorHistoryData(
            graphData,
            getDateCategoriesLineGraph(range.name, trades.length),
            minimizedFormat
          )}
        />
      )}
    </Box>
  );
};

export default FullFloorHistoryChart;
