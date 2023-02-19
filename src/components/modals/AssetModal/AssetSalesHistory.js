import { CircularProgress, Divider, List } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect, memo } from 'react';
import moment from 'moment';
import SaleListItem from './SaleListItem';
import Chart from 'react-apexcharts';
import { isBrowser } from 'react-device-detect';
import { getSingleAssetSales } from 'apiProvider';
import AssetTopSalesItem from 'components/CollectionListItem/AssetTopSalesItem';

const floorLineChartOptions = (data) => ({
  series: [{ data, name: 'Price' }],
  height: 200,
  width: '100%',
  type: 'line',
  options: {
    chart: {
      id: 'prices',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: 'Sales History',
      style: {
        color: 'var(--fontColor)',
      },
    },
    yaxis: {
      title: {
        text: 'Price in ADA',
        style: {
          color: 'var(--fontColor)',
        },
      },
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: 'var(--fontColor)' },
      },
    },
    markers: {
      size: 3,
    },
    colors: ['var(--primaryColor)', 'var(--logoColor)'],
    dataLabels: {
      enabled: false,
      theme: 'dark',
      style: {
        colors: ['var(--fontColor)'],
      },
    },
    fill: {
      type: ['solid', 'solid'],
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  },
});

const AssetSalesHistory = ({ asset }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      getAssetSales();
    }
  }, [asset]);

  const getAssetSales = async () => {
    setLoading(true);
    try {
      const salesData = await getSingleAssetSales(asset.asset_id).then(
        (res) => res.sales || []
      );

      setSales(salesData);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setSales([]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={20}
          thickness={5}
          sx={{ color: 'var(--primaryColor)', ml: 1 }}
        />
      </Box>
    );
  }

  if (sales.length === 0) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No sales history.</span>
      </Box>
    );
  }

  const FloorChart = memo(
    () => (
      <Chart
        {...floorLineChartOptions(
          sales
            .filter((s) => s.sold_at || s.time)
            .map((s) => ({
              x: s.sold_at || moment(),
              y: s.price || 0,
            }))
        )}
      />
    ),
    [sales]
  );

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <List sx={{ width: '100%' }}>
        {isBrowser ? (
          <>
            {sales
              .sort((a, b) => new Date(b.sold_at) - new Date(a.sold_at))
              .filter((sale) => sale.sold_at || sale.time)
              .map((sale, index) => {
                return (
                  <AssetTopSalesItem
                    index={index}
                    isLast={sales.length - 1 === index}
                    key={index}
                    asset={sale}
                    loading={!sale}
                    showTime
                  />
                );
              })}
          </>
        ) : (
          <span>Open in browser to see sales</span>
        )}
        <Divider sx={{ width: '100%', mx: 'auto', my: 2 }} />
        <Box sx={{ marginTop: 1 }}>
          <FloorChart />
        </Box>
      </List>
    </Box>
  );
};

export default AssetSalesHistory;
