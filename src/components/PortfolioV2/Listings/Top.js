import { Grid } from '@mui/material';

const Top = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        Listings Left
      </Grid>
      <Grid item xs={9}>
        Listings Right
      </Grid>
    </Grid>
  );
};

export default Top;
