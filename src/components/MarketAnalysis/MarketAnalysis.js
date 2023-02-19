import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useClassicGraph } from './graphs/useClassicGraph';
import dynamic from 'next/dynamic';
import TextHeader from 'components/common/TextHeader';
import useDetectDevice from 'hooks/useDetectDevice';
import TopSalesScroll from './graphs/TopSalesScroll';
import styles from '../Collections/Collections.module.scss';
import classNames from 'classnames';

const LineBoxes = dynamic(() => import('./graphs/LineBoxes'), { ssr: false });
const CollectionsTreemap = dynamic(
  () => import('./graphs/CollectionsTreemap'),
  { ssr: false }
);
const ClassicAreaChart = dynamic(() => import('./graphs/ClassicAreaChart'), {
  ssr: false,
});
const ClassicPolarArea = dynamic(() => import('./graphs/ClassicPolarArea'), {
  ssr: false,
});
const ClassicColumnChart = dynamic(
  () => import('./graphs/ClassicColumnChart'),
  { ssr: false }
);
const VolumeHistory = dynamic(() => import('./graphs/VolumeHistory'), {
  ssr: false,
});

const MarketAnalysis = ({}) => {
  const theme = useTheme();
  const { isMobile } = useDetectDevice();
  const { interval, setInterval } = useClassicGraph();

  const handleChangeTime = (event, newValue) => {
    setInterval(newValue);
  };

  return (
    <Grid
      container
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        position: 'relative',
        p: isMobile ? 1 : 0,
      }}
    >
      <div
        className={styles.sectionTitleContainer}
        style={{
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
      >
        <h1
          className={classNames(styles.sectionTitle, styles.titleStatistics)}
          style={{ marginBottom: -40 }}
        >
          Statistics
        </h1>
      </div>
      <Grid
        item
        xs={12}
        sx={{
          paddingLeft: '0 !important',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: 1,
            py: 2,
          }}
        >
          {['24h', '7d', '30d', '1y'].map((item, index) => (
            <Box key={index}>
              <span
                style={{
                  color:
                    interval === item ? 'var(--logoColor)' : 'var(--fontColor)',
                  textDecoration: interval === item && 'underline',
                  textDecorationColor:
                    interval === item ? 'var(--logoColor)' : 'var(--fontColor)',
                  cursor: 'pointer',
                  fontSize: isMobile ? 18 : 20,
                }}
                onClick={(e) => handleChangeTime(e, item)}
              >
                {item}
              </span>
            </Box>
          ))}
        </Box>
        <LineBoxes interval={interval} />
      </Grid>
      <Grid
        item
        lg={12}
        md={12}
        xs={12}
        sx={{ width: '100%', paddingLeft: '0 !important', mt: 3 }}
      >
        <VolumeHistory />
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
      >
        <Grid item xl={5.9} lg={12} md={12} sm={12} xs={12}>
          <ClassicPolarArea type="marketplace" interval={interval} />
        </Grid>
        <Grid item xl={5.9} lg={12} md={12} sm={12} xs={12}>
          <ClassicColumnChart type="collection" interval={interval} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
      >
        <Grid item xl={5.9} lg={12} md={12} sm={12} xs={12}>
          <ClassicAreaChart type="marketplace" interval={interval} />
        </Grid>
        <Grid item xl={5.9} lg={12} md={12} sm={12} xs={12}>
          <ClassicPolarArea type="collections" interval={interval} />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          width: '100%',
          mx: 'auto',
          paddingLeft: '0 !important',
          marginTop: 3,
        }}
      >
        <TopSalesScroll interval={interval} />
      </Grid>
      <Grid item sx={{ width: '100%', paddingLeft: '0 !important' }}>
        <CollectionsTreemap />
      </Grid>
    </Grid>
  );
};

export default MarketAnalysis;
