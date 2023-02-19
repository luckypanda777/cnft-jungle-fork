// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const SkeletonCollectionLiveAnalytics = () => (
  <Card sx={{ minHeight: '65vh' }}>
    <CardContent sx={{ m: 0, p: 0, pt: 1 }}>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12} width="100%">
          <Skeleton variant="rectangular" height={120} width="100%" />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={75} width={'100%'} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid md={6} xs={12} direction="row" container item spacing={1}>
          <Grid item md={6} xs={12}>
            <Skeleton variant="rectangular" height={72.5} sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
          </Grid>
          <Grid item md={6} xs={12}>
            <Skeleton variant="rectangular" height={72.5} sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
            <Skeleton variant="rectangular" height={72.5} sx={{ my: 0.5 }} />
          </Grid>
        </Grid>
        <Grid
          md={6}
          xs={12}
          direction="column"
          container
          item
          sx={{ maxHeight: '100%' }}
          spacing={1}
        >
          <Grid item md={6} xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item md={6} xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonCollectionLiveAnalytics;
