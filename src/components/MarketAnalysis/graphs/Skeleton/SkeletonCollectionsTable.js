// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const SkeletonCollectionsTable = () => (
  <Card
    sx={{ minHeight: '65vh', maxWidth: '1200px', mx: 'auto', mt: 2, pl: 2 }}
  >
    <CardContent>
      <Grid container spacing={3}>
        <Grid container spacing={3}>
          {new Array(15).fill(0).map((el, index) => (
            <Grid item xs={12} key={index}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={3}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {index !== 0 && (
                  <Grid item width={'10%'}>
                    <Skeleton
                      variant="rectangular"
                      height={65}
                      width={65}
                      sx={{ borderRadius: 50 }}
                    />
                  </Grid>
                )}
                <Grid item width={index !== 0 ? '22.5%' : '32.5%'}>
                  <Skeleton variant="rectangular" height={65} />
                </Grid>
                <Grid item width={'12.5%'}>
                  <Skeleton variant="rectangular" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={30} />
                </Grid>
                <Grid item width={'12.5%'}>
                  <Skeleton variant="rectangular" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={30} />
                </Grid>
                <Grid item width={'12.5%'}>
                  <Skeleton variant="rectangular" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={30} />
                </Grid>
                <Grid item width={'15%'}>
                  <Skeleton variant="rectangular" height={65} />
                </Grid>
                <Grid item width={'15%'}>
                  <Skeleton variant="rectangular" height={65} />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonCollectionsTable;
