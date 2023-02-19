import styles from './styles.module.scss';
import Datafeed from '../api';
import { useEffect, useRef, useState } from 'react';
import { widget } from '../../../../public/static/charting_library';
import { data, setData } from '../api/pairs';
import { getExtensionCollections } from 'apiProvider';
import { Box, CircularProgress } from '@mui/material';

const TraidingViewChart = ({ policyId, name }) => {
  const ref = useRef(null);
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    fetchCollectionSymbols();
  }, []);

  useEffect(() => {
    if (data.length > 0 && policyId) {
      initChart();
    }
  }, [data, policyId]);

  const fetchCollectionSymbols = async () => {
    setLoadingCollections(true);
    const { collections } = await getExtensionCollections();

    setData(collections);
    setLoadingCollections(false);
  };

  const initChart = async () => {
    console.log('CREATING CHART');
    const token = {
      policyId,
      symbol: name,
      name,
      type: 'NFT',
    };
    localStorage.setItem('TVToken', JSON.stringify(token));
    localStorage.setItem('initSuccess', 'none');

    const widgetOptions = {
      container: ref.current,
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      symbol: policyId || 'Test',
      container_id: 'trading_view_chart',
      datafeed: Datafeed,
      library_path: '/static/charting_library/',
      theme: 'dark',
      style: '1',
      load_last_chart: false,
      mainSeriesProperties: { priceAxisProperties: { log: false } },
      loading_screen: { backgroundColor: '#171718' },
      intervals: ['1Y', '3M', '1M', '1W', '1D'],
      interval: '1H',
      timeframe: '3M',
      custom_css_url: '/static/tvchart.css',
      overrides: {
        'mainSeriesProperties.style': 1,
        'mainSeriesProperties.priceAxisProperties.log': true,
        'paneProperties.axisProperties.indexedTo100': true,
        'paneProperties.background': '#171718',
        'paneProperties.backgroundType': 'solid',
      },
      time_frames: [
        {
          text: '1Y',
          resolution: '12H',
          description: '1Y',
        },
        {
          text: '3M',
          resolution: '4H',
          description: '3M',
        },
        {
          text: '1M',
          resolution: '1H',
          description: '1M',
        },
        {
          text: '7D',
          resolution: '30',
          description: '7D',
        },
        {
          text: '1D',
          resolution: '15',
          description: '1D',
        },
      ],
    };

    const tvWidget = new widget({
      ...widgetOptions,
      width: '100%',
      height: '660px',
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {(!data.length || loadingCollections) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            minWidth: 360,
            px: 2,
            position: 'absolute',
            zIndex: 10,
          }}
        >
          <CircularProgress sx={{ fontSize: 26, mt: 0 }} />
        </Box>
      )}
      <div
        className={styles.TradingViewChart}
        id="trading_view_chart"
        style={{ height: '100%', width: '100%' }}
      />
    </Box>
  );
};

export default TraidingViewChart;
