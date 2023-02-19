import { Grid } from '@mui/material';
import Bottom from './layout/Bottom';
import Tabs from './layout/Tabs';
import Top from './layout/Top';
import styles from './Portfolio.module.scss';

const Portfolio = () => {
  return (
    <Grid container className={styles.portfolioLayout}>
      <Grid item xs={12}>
        <Top />
      </Grid>
      <Grid item xs={12}>
        <Tabs />
      </Grid>
      <Grid item xs={12}>
        <Bottom />
      </Grid>
    </Grid>
  );
};

export default Portfolio;
