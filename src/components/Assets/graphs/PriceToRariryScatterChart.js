import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, useTheme } from '@mui/system';
import { Button, IconButton, Skeleton } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import ApexCharts from 'apexcharts';
import CachedIcon from '@mui/icons-material/Cached';
import moment from 'moment';
import { nFormatter } from 'utils/formatCurrency';
import { useAppContext } from 'context/AppContext';
import imgOptimizerReplace, { imgLinkReplace } from 'utils/imgOptimizerReplace';
import AssetModal from 'components/modals/AssetModal/Modal';
import { getPriceToRarity } from 'apiProvider';
import CustomTooltip from 'components/common/CustomTooltip';

const options = (listings, onClick) => ({
  type: 'scatter',
  height: 500,
  series: [
    {
      name: 'Active Listings',
      data: listings
        .filter((listing) => !listing.time && listing.rarity_rank)
        .map((listing) => ({
          y: Math.log(listing.rarity_rank),
          x: listing.price,
          asset: listing.asset,
          rank: listing.rarity_rank,
          price: listing.price,
          image: listing.image
            ? imgLinkReplace(listing.image)
            : imgLinkReplace(listing.asset.image),
          link: listing.link,
          active: true,
        }))
        .sort((a, b) => a.rank - b.rank),
    },
    {
      name: 'Recently Sold (1week)',
      data: listings
        .filter((listing) => listing.time && listing.rarity_rank)
        .filter((listing) => {
          return (
            moment
              .duration(moment(listing.time).diff(moment().subtract(1, 'week')))
              .asMilliseconds() > 0
          );
        })
        .map((listing) => ({
          y: Math.log(listing.rarity_rank),
          x: listing.price,
          asset: listing.asset,
          rank: listing.rarity_rank,
          price: listing.price,
          image: listing.image
            ? imgLinkReplace(listing.image)
            : imgLinkReplace(listing.asset.image),
          active: false,
        }))
        .sort((a, b) => a.rank - b.rank),
    },
  ],
  options: {
    chart: {
      id: 'price-to-rarity-scatter-chart',
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: 'xy',
        autoScaleYaxis: true,
        autoScaleXaxis: true,
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
          const data =
            config.w.config.series[config.seriesIndex].data[
              config.dataPointIndex
            ];

          if (data.link) {
            window.open(data.link);
          }
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
    // annotations: {
    //   yaxis: [
    //     {
    //       borderColor: '#fff',
    //       fillColor: '#fff',
    //       opacity: 1,
    //     },
    //   ],
    //   xaxis: [
    //     {
    //       borderColor: '#fff',
    //       fillColor: '#fff',
    //       opacity: 1,
    //     },
    //   ],
    // },
    noData: {
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: -25,
      style: {
        color: 'var(--fontColor)',
        fontSize: '22px',
        fontFamily: 'newgilroymedium',
      },
    },
    xaxis: {
      type: 'numeric',
      // tickAmount: 10,
      tickPlacement: 'between',
      labels: {
        formatter: function (value) {
          // if (value > 1000) {
          //   return Math.floor(value / 1000) + 'k';
          // }

          // return value > 10000 ? '10000+' : Math.floor(value);
          return nFormatter(value, 1);
        },
        style: { colors: 'var(--fontColor)' },
      },
      categories: [
        1, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
      ],
      min: 1,
      tooltip: {
        enabled: true,
      },
      crosshairs: {
        show: true,
      },
      forceNiceScale: true,
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
    },
    yaxis: {
      // reversed: true,
      min: 1,
      // max: 10,
      // labels: { style: { colors: 'var(--fontColor)' } },
      // forceNiceScale: true,
      labels: {
        formatter: function (value) {
          return Math.min(10000, Math.exp(value, 10)).toFixed(0);
        },
        style: { colors: 'var(--fontColor)' },
      },
      title: {
        text: 'Rarity Score Rank',
        style: {
          color: 'var(--fontColor)',
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
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        if (!data.active) {
          return (
            `<img crossorigin="anonymous" src='${data.image}' alt='asset' style="width: 120px;" />` +
            '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: var(--lightGrey); color: var(--fontColor);">' +
            `<span style="padding: 5px; color: var(--fontColor)">Price: ₳${data.price.toLocaleString()}</span>` +
            `<span style="padding: 5px; color: var(--fontColor);">Rank: ${data.rank}</span>` +
            `<span style="padding: 5px; color: var(--fontColor); font-size: 10px">Click to open modal</span>` +
            `<span style="padding: 5px; color: var(--fontColor)">SOLD</span>` +
            '</div>'
          );
        }

        return (
          `<img crossorigin="anonymous" src='${data.image}' alt='asset' style="width: 120px;" />` +
          '<div style="display:flex;justify-content:center;align-items:center;flex-direction:column; background: var(--lightGrey); color: var(--fontColor);">' +
          `<span style="padding: 5px; color: var(--fontColor);">Price: ₳${data.price.toLocaleString()}</span>` +
          `<span style="padding: 5px; color: var(--fontColor);">Rank: ${data.rank}</span>` +
          `<span style="padding: 5px; color: var(--fontColor); font-size: 10px">Click to open modal</span>` +
          '</div>'
        );
      },
    },
    colors: ['var(--logoColor)', '#757575'],
    markers: {
      colors: ['var(--logoColor)', '#757575'],
      size: 3,
      strokeWidth: 0,
      shape: 'circle',
      onClick: undefined,
    },
    grid: {
      padding: {
        left: 20,
        right: 20,
      },
    },
  },
});

const PriceToRarityScatterChart = ({}) => {
  const theme = useTheme();
  const { state } = useAppContext();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('Regular');

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
    getVolumeFloorHisotry();
  }, [state.collection]);

  const getVolumeFloorHisotry = async () => {
    if (!state.collection.id) return;

    try {
      const priceToRarity = await getPriceToRarity(state.collection.id).then(
        (res) => res.priceToRarity || []
      );

      setListings(priceToRarity);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (newMode) => {
    setMode(newMode);
    filterListingsByMode(newMode);
  };

  const filterListingsByMode = () => {};

  const memoizedListings = useMemo(() => {
    const average = listings.reduce((p, c) => p + c.price, 0) / listings.length;

    return listings.filter((listing) => listing.price < average * 10);
  }, [state.collection, listings]);

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
          Price to Rank
          <CustomTooltip title="Reset zoom">
            <IconButton
              onClick={() =>
                ApexCharts.exec('price-to-rarity-scatter-chart', 'resetSeries')
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
            columnGap: 2,
          }}
        >
          {['Regular', 'Predator'].map((item, i) => (
            <Button
              key={i}
              disabled={item === 'Predator'}
              dense
              disableElevation
              variant={mode === item ? 'contained' : 'text'}
              size="small"
              sx={{
                color: mode === item ? 'var(--whiteColor)' : 'var(--fontColor)',
                backgroundColor: mode === item && theme.palette.primary[600],
                '&:hover': {
                  backgroundColor: !mode === item && theme.palette.primary[700],
                },
              }}
              onClick={() => handleChange(item)}
            >
              {item}
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
        <Chart {...options(memoizedListings, onClick)} />
      )}
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={state.collection}
        setOpenModal={setModalOpen}
        sort={sort}
        additionalAssetData={selectedAsset}
        //currency={minMaxFilters.priceType}
        //showTraitCount={sort.sort === 'scoreWithTraitCount'}
        //handleNext={() => navigateToAsset('next')}
        //handlePrevious={() => navigateToAsset('previous')}
        //handleTraitFilterFromModal={handleTraitFilterFromModal}
      />
    </Box>
  );
};

export default PriceToRarityScatterChart;
