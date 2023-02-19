import { Box, Grid } from '@mui/material';
import styles from './Bottom.module.scss';
import ProfileDetailHolding from './ProfileDetailHolding';
import ProfileDetailAccount from './ProfileDetailAccount';
import ProfileDetailTradeMint from './ProfileDetailTradeMint';
import { PROFILE_BOTTOM_TYPE } from '../constants';

const Top = () => {
  return (
    <Grid container spacing={5} columns={{ xs: 6, sm: 6, md: 12 }}>
      <Grid item xs={6}>
        <Box className={styles.title}>
          <div>Holding Distribution</div>
        </Box>
        <Box>
          <ProfileDetailHolding />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box className={styles.title}>
          <div>Related Accounts</div>
        </Box>
        <Box>
          <ProfileDetailAccount />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box className={styles.title}>
          <div>Recent Trades</div>
        </Box>
        <Box className={styles.tradeMintHeight}>
          <ProfileDetailTradeMint type={PROFILE_BOTTOM_TYPE.TRADE} />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box className={styles.title}>
          <div>Recent Mints</div>
        </Box>
        <Box className={styles.tradeMintHeight}>
          <ProfileDetailTradeMint type={PROFILE_BOTTOM_TYPE.MINT} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Top;
