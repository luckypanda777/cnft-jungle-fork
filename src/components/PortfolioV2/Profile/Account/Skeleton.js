import { Skeleton, Grid, Stack } from '@mui/material';
const ProfileSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <Skeleton variant="circular" width={100} height={100} />
      </Grid>
      <Grid item xs={7}>
        <Stack spacing={2}>
          <Skeleton variant="rounded" />
          <Skeleton variant="rounded" />
          <Skeleton variant="rounded" />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Skeleton variant="rounded" height={70} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton variant="rounded" height={70} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rounded" height={70} />
      </Grid>
    </Grid>
  );
};

export default ProfileSkeleton;
