// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const SkeletonCollectionInfo = () => (
  <Card>
    <CardContent>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item md={12} xs={12} width="100%">
          <Skeleton variant="rectangular" height={150} width="100%" />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default SkeletonCollectionInfo;
