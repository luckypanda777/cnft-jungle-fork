import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/system';
import { Button, IconButton, Skeleton, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { generateListings, getDateCategories } from './data/mock-collection';
import ApexCharts from 'apexcharts';
import CachedIcon from '@mui/icons-material/Cached';
import { useAppContext } from 'context/AppContext';
import imgOptimizerReplace, { imgLinkReplace } from 'utils/imgOptimizerReplace';
import AssetModal from 'components/modals/AssetModal';
import { getTradeHistory } from 'apiProvider';
import CustomTooltip from 'components/common/CustomTooltip';

const options = (trades = [], dateRanges, onClick) => ({
  type: 'scatter',
  height: 500,
  series: [
    // {
    //   name: 'Old Trades',
    //   data: trades.slice(50, 100).map((trade) => ({
    //     x: trade.timestamp,
    //     y: trade.price,
    //     rank: trade.rarity_rank,
    //     price: trade.price,
    //     image: trade.image,
    //   })),
    // },
    {
      name: 'New Trades',
      data: trades.map((trade) => ({
        asset: trade.asset,
        x: trade.time,
        y: trade.price,
        rank: trade.rarity_rank,
        price: trade.price,
        image: trade.image
          ? imgLinkReplace(trade.image)
          : imgLinkReplace(trade.asset.image),
      })),
    },
  ],
  options: {
    chart: {
      id: 'trade-history-scatter-chart',
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'xy',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
      events: {
        click: function (event, chartContext, config) {
          const { seriesIndex, dataPointIndex, globals } = config;

          if (seriesIndex < 0 || dataPointIndex < 0) return;

          const data = globals.initialSeries[seriesIndex].data[dataPointIndex];
          onClick(data.asset);
        },
        dataPointMouseEnter: function (event) {
          event.path[0].style.cursor = 'pointer';
        },
        dataPointMouseLeave: function (event) {
          return;
        },
        dataPointSelection: (event, chartContext, config) => {
          // event.path[0].style.cursor = 'pointer';
          // window.open(
          //   config.w.config.series[config.seriesIndex].data[
          //     config.dataPointIndex
          //   ].link
          // );
        },
      },
    },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -40,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    xaxis: {
      ...dateRanges,
      type: 'datetime',
      labels: {
        style: {
          colors: 'var(--fontColor)',
        },
      },
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
      },
      title: {
        text: 'Date & Time',
        style: {
          color: 'var(--fontColor)',
        },
      },
    },
    legend: {
      labels: { colors: 'var(--fontColor)' },
      offsetY: 5,
      position: 'bottom',
      horizontalAlign: 'center',
      showForNullSeries: false,
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        style: {
          colors: Array(10).fill('var(--fontColor)'),
        },
      },
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: 'white',
          width: 0.5,
          dashArray: 3,
        },
      },
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        return (
          '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: var(--lightGrey); color: var(--fontColor);">' +
          `<span style="padding: 5px; color: var(--fontColor);">Price: ${data.price}</span>` +
          `<span style="padding: 5px; color: var(--fontColor);">Rank: ${data.rank}</span>` +
          `<img crossorigin="anonymous" src='${data.image}' alt='asset' style="width: 100px;" />` +
          `<span style="padding: 5px; color: var(--fontColor); font-size: 10px">Click to open modal</span>` +
          '</div>'
        );
      },
    },
    colors: ['#2196f3', '#7c4dff'],
    markers: {
      colors: ['#2196f3', '#7c4dff'],
      size: 3,
      strokeWidth: 0,
      shape: 'circle',
      onClick: undefined,
    },
  },
});

const TradeHistoryScatterChart = ({}) => {
  const { state } = useAppContext();
  const [range, setRange] = useState({ name: '1d', label: 'dayHistory' });
  const theme = useTheme();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sort, setSort] = useState({
    sort: 'score',
    sortDirection: 'asc',
  });

  const onClick = (asset) => {
    if (asset && (asset.image || asset.optimized_image)) {
      if (asset.optimized_image) {
        asset.optimized_image = imgOptimizerReplace(asset);
      } else {
        asset.image = imgOptimizerReplace(asset);
      }
    }

    setSelectedAsset(asset);
    setModalOpen(true);
  };

  useEffect(() => {
    let isActive = true;

    if (state.collection.id) {
      setLoading(true);
      getTradeHistory(state.collection.id, {
        period: range.name,
        type: 'tradeHistory',
      })
        .then((res) => {
          if (isActive) {
            const tradeHistory = res.tradeHistory || [];
            setTrades(tradeHistory);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }

    return () => {
      isActive = false;
    };
  }, [state.collection, range.name]);

  const handleChange = (newRange) => {
    setRange(newRange);
  };

  return (
    <Box sx={{ borderRadius: '10px', backgroundColor: 'var(--bgColor)', p: 2 }}>
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
          }}
        >
          Trade History
          <CustomTooltip title="Reset zoom">
            <IconButton
              onClick={() =>
                ApexCharts.exec('trade-history-scatter-chart', 'resetSeries')
              }
              sx={{ ml: 0.5 }}
            >
              <CachedIcon />
            </IconButton>
          </CustomTooltip>
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
            { name: '1y', label: 'yearHistory' },
          ].map((item, index) => (
            <Button
              key={index}
              dense
              disableElevation
              variant={range.label === item.label ? 'contained' : 'text'}
              size="small"
              disabled={loading}
              sx={{
                color:
                  range.label === item.label
                    ? 'var(--whiteColor)'
                    : 'var(--fontColor)',
                backgroundColor:
                  range.label === item.label && theme.palette.primary[600],
                '&:hover': {
                  backgroundColor:
                    !range.label === item.label && theme.palette.primary[700],
                },
                width: 25,
              }}
              onClick={() => handleChange(item)}
            >
              {item.name}
            </Button>
          ))}
        </FormControl>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 10 }} />
        </>
      ) : (
        <Chart {...options(trades, getDateCategories(range.label), onClick)} />
      )}
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={state.collection}
        setOpenModal={setModalOpen}
        sort={sort}
        //currency={minMaxFilters.priceType}
        //showTraitCount={sort.sort === 'scoreWithTraitCount'}
        //handleNext={() => navigateToAsset('next')}
        //handlePrevious={() => navigateToAsset('previous')}
        //handleTraitFilterFromModal={handleTraitFilterFromModal}
      />
    </Box>
  );
};

export default TradeHistoryScatterChart;
