// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// ==============================|| SKELETON - EARNING CARD ||============================== //

const SkeletonClassicLineGraph = () => (
  <Card sx={{ borderRadius: '10px' }}>
    <CardContent>
      <Grid container direction="column">
        <Grid item>
          <Skeleton variant="rectangular" sx={{ my: 1 }} height={12} />
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" sx={{ my: 1 }} height={12} />
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" sx={{ my: 1 }} height={12} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonClassicLineGraph;
