// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const SkeletonCollectionHunts = () => (
  <Card sx={{ minHeight: '65vh' }}>
    <CardContent>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12} width="100%">
          <Skeleton variant="rectangular" height={25} width="100%" />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={75} width={'100%'} />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={25} width={'100%'} />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={75} width={'100%'} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonCollectionHunts;
