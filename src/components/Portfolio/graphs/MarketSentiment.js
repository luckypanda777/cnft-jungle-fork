import { Skeleton, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import FilterButton from 'components/buttons/FilterButton';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { middlen } from 'utils/shorten';

const getIndexData = (data = 67) => ({
  series: [data],
  height: 350,
  stacked: false,
  type: 'radialBar',
  options: {
    chart: {
      offsetY: -20,
      animations: {
        enabled: false,
      },
      id: 'category-index',
      stacked: false,
      toolbar: {
        show: false,
      },
      height: 350,
      type: 'radialBar',
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
      data > 0
        ? 'var(--undervaluedColor)'
        : data === 0
        ? 'goldenrod'
        : 'var(--tradeLoss)',
    title: {
      offsetY: 30,
      text: 'Whale Sentiment',
      align: 'center',
      style: {
        fontSize: '20px',
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
      labels: {
        rotateAlways: data.length > 20,
        style: {
          colors: 'var(--fontColor)',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Index Value',
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
          formatter: () => 'Index Value',
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
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color:
              data > 0
                ? 'var(--undervaluedColor)'
                : data === 0
                ? 'goldenrod'
                : 'var(--tradeLoss)',
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color:
              data > 0
                ? 'var(--undervaluedColor)'
                : data === 0
                ? 'goldenrod'
                : 'var(--tradeLoss)',
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
      colors:
        data > 0
          ? 'var(--undervaluedColor)'
          : data === 0
          ? 'goldenrod'
          : 'var(--tradeLoss)',
    },
    stroke: {
      dashArray: 4,
    },
    labels: data > 0 ? ['Buying NFTs'] : ['Selling NFTs'],
    grid: {
      padding: {
        bottom: 10,
      },
    },
  },
});

const MarketSentiment = ({
  height = 350,
  defaultRange = { name: '1d', label: 'dayHistory' },
  linkToAll,
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

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flex: 1 }}>
        {loading ? (
          <>
            <Skeleton
              height={5}
              sx={{ transform: 'none', my: height / 50.25 }}
            />
            <Skeleton
              height={5}
              sx={{ transform: 'none', my: height / 50.25 }}
            />
            <Skeleton
              height={5}
              sx={{ transform: 'none', my: height / 50.25 }}
            />
            <Skeleton
              height={5}
              sx={{ transform: 'none', my: height / 50.25 }}
            />
            <Skeleton
              height={5}
              sx={{ transform: 'none', my: height / 50.25 }}
            />
          </>
        ) : (
          <Chart {...getIndexData(65)} height={height} />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          height: 'fit-content',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
            flex: 1,
            justifyContent: 'space-between',
            height: 'fit-content',
          }}
        >
          <span style={{ marginTop: 15, fontSize: 20, textAlign: 'center' }}>
            Top Gainers
          </span>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            const change = i * 2;
            const changeColor =
              change > 0
                ? 'var(--undervaluedColor)'
                : change < 0
                ? 'var(--tradeLoss)'
                : 'goldenrod';
            const plus = change > 0 ? '+' : '';
            const changeText = change
              ? `(${plus}${(change * 100).toFixed(1)}%)`
              : '(=0%)';

            return (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  px: 1,
                  alignItems: 'center',
                  verticalAlign: 'middle',
                }}
              >
                <span
                  style={{
                    color: 'var(--primaryColor)',
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    router.push(
                      `/portfolio/addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z`
                    )
                  }
                >
                  {middlen(
                    'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
                    7
                  )}
                </span>
                <span style={{ fontSize: 14 }}>
                  {change} ADA
                  <span style={{ color: changeColor, fontSize: 12 }}>
                    {' '}
                    {changeText}
                  </span>
                </span>
              </Box>
            );
          })}
          <Divider sx={{ my: 1.75 }} />
        </Box>
        <FilterButton
          pressable
          style={{ fontSize: 12, width: '100%' }}
          onClick={() => router.push('/leaderboards')}
        >
          See leaderboards &#8594;
        </FilterButton>
      </Box>
    </Box>
  );
};

export default MarketSentiment;
