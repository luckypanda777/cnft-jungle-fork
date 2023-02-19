import { Grid } from '@mui/material';

const Top = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        Watchlist Left
      </Grid>
      <Grid item xs={9}>
        Watchlist Right
      </Grid>
    </Grid>
  );
};

export default Top;
