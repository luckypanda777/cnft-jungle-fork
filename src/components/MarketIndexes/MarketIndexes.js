import { Box, Button, Grid, Tooltip } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import TextHeader from 'components/common/TextHeader';
import useDetectDevice from 'hooks/useDetectDevice';
import {
  artPolicies,
  pinkChipPolicies,
  gamingPolicies,
  metaversePolicies,
  naruPolicies,
  bossPolicies,
  clayPolicies,
  mocossiPolicies,
  cornucopiasPolicies,
  greenChipPolicies,
  kongsPolicies,
  onChainPolicies,
  daoPolicies,
  utilityPolicies,
  photographyPolicies,
} from 'components/MarketOverview/graphs/chart-data/categories-policies';
import { useClassicGraph } from 'components/MarketAnalysis/graphs/useClassicGraph';
import styles from '../Collections/Collections.module.scss';
import classNames from 'classnames';

const IndexChart = dynamic(
  () => import('components/Assets/graphs/IndexChart'),
  { ssr: false }
);

const MarketIndexes = ({}) => {
  const theme = useTheme();
  const { isMobile } = useDetectDevice();
  const { interval, setInterval } = useClassicGraph();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1600,
      }}
    >
      <div className={styles.sectionTitleContainer}>
        <h1
          className={classNames(styles.sectionTitle, styles.titleStatistics)}
          style={{ marginBottom: 0, marginTop: 0 }}
        >
          Indexes
        </h1>
      </div>
      <h2
        style={{
          marginTop: 30,
          marginBottom: isMobile ? 0 : 10,
          fontSize: isMobile ? 20 : 24,
        }}
      >
        Global Market Indexes
      </h2>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...pinkChipPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...greenChipPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...metaversePolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...gamingPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...onChainPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...daoPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...utilityPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...photographyPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...artPolicies} />
        </Grid>
      </Grid>
      <h2
        style={{
          marginTop: 30,
          marginBottom: isMobile ? 0 : 10,
          fontSize: isMobile ? 20 : 24,
        }}
      >
        Collection Specific Indexes
      </h2>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...clayPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...kongsPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...cornucopiasPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...naruPolicies} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ width: '100%', mx: 'auto', paddingLeft: '0 !important' }}
        justifyContent="space-between"
        rowGap={2}
      >
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...bossPolicies} />
        </Grid>
        <Grid item xl={5.925} lg={12} md={12} sm={12} xs={12}>
          <IndexChart {...mocossiPolicies} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MarketIndexes;
