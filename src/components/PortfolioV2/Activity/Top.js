import { Grid } from '@mui/material';

const Top = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        Activity Left
      </Grid>
      <Grid item xs={9}>
        Activity Right
      </Grid>
    </Grid>
  );
};

export default Top;
