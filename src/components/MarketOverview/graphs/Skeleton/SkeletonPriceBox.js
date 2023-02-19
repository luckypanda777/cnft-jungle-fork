// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// ==============================|| SKELETON - EARNING CARD ||============================== //

const SkeletonPriceBox = () => (
  <Card sx={{ boxShadow: 'none' }}>
    <CardContent>
      <Grid container direction="column">
        <Grid item>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Skeleton variant="text" width={125} height={25} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={25} height={25} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" sx={{ mt: 2 }} height={20} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonPriceBox;
