// material-ui
import { Grid } from '@mui/material';
import { isMobile } from 'react-device-detect';

import Features from './Features';
import SpecialPricing from './SpecialPricing';

const Pricing = () => (
  <Grid item xs={12}>
    {process.env.NEXT_PUBLIC_SHOW_SPECIAL_PRICING && !isMobile && (
      <SpecialPricing />
    )}
    <Features />
  </Grid>
);

export default Pricing;
