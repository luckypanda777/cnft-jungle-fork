// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const SkeletonCollectionSummary = () => (
  <Card sx={{ minHeight: '65vh' }}>
    <CardContent sx={{ m: 0, p: 0, pt: 2 }}>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12} width="100%">
          <Skeleton variant="rectangular" height={130} width="100%" />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12} width="100%">
          <Skeleton variant="rectangular" height={5} width="100%" />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={75} width={'100%'} />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12}>
          <Skeleton variant="rectangular" height={75} width={'100%'} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid
          md={12}
          xs={12}
          direction="column"
          container
          item
          sx={{
            maxHeight: '100%',
          }}
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

export default SkeletonCollectionSummary;
