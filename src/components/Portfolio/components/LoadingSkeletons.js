import { Box, Divider, Skeleton } from '@mui/material';
import { VerticalDivider } from '../layout/Performance';

const ProfileSkeleton = () => {
  return (
    <Box sx={{ flex: 1, position: 'relative', py: 2, height: 250 }}>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex',
          columnGap: 0.5,
          alignItems: 'center',
        }}
      >
        <Skeleton width={20} height={20} variant="rectangular" />
        <Skeleton width={20} height={20} variant="rectangular" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Skeleton
          width={100}
          height={100}
          variant="rectangular"
          sx={{ borderRadius: 2 }}
        />
        <Skeleton width={140} height={15} variant="rectangular" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            rowGap: 1,
            mt: 1,
          }}
        >
          <Skeleton width={125} height={20} variant="rectangular" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            rowGap: 1,
            mt: 1,
          }}
        >
          <Skeleton width={200} height={15} variant="rectangular" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            rowGap: 1,
            mt: 1,
          }}
        >
          <Skeleton width={100} height={15} variant="rectangular" />
        </Box>
      </Box>
    </Box>
  );
};

const WalletStatBoxSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        height: 'fit-content',
        position: 'relative',
      }}
    >
      <Skeleton variant="rect" width={120} height={20} sx={{ my: 0.5 }} />
      <Skeleton variant="rect" width={140} height={20} sx={{ my: 0.5 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 0.5,
        }}
      >
        {new Array(2).fill(0).map(() => {
          return (
            <Box sx={{ display: 'flex', columnGap: 1 }}>
              <Skeleton variant="rect" width={15} height={15} />
              <Skeleton variant="rect" width={75} height={15} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const WatchRanksSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        height: 'fit-content',
      }}
    >
      <Skeleton variant="rect" width={100} height={15} sx={{ my: 0.5 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
        }}
      >
        {new Array(3).fill(0).map(() => {
          return (
            <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
              <Skeleton variant="rect" width={30} height={20} />
              <Skeleton variant="rect" width={125} height={20} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const WatchlistStatsSkeleton = () => {
  return (
    <Box sx={{ flex: 4, display: 'flex', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
          width: '100%',
        }}
      >
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Divider sx={{ my: 1, width: '100%' }} />
        <Skeleton variant="rect" width={100} height={15} />
      </Box>
      <VerticalDivider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
          width: '100%',
        }}
      >
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Divider sx={{ my: 1, width: '100%' }} />
        <Skeleton variant="rect" width={100} height={15} />
      </Box>
      <VerticalDivider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
          width: '100%',
        }}
      >
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Skeleton variant="rect" width={150} height={15} />
        <Divider sx={{ my: 1, width: '100%' }} />
        <Skeleton variant="rect" width={100} height={15} />
      </Box>
    </Box>
  );
};

const WatchlistStatsSmallSkeleton = () => {
  return (
    <Box sx={{ flex: 4, display: 'flex', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
          width: '100%',
        }}
      >
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Skeleton variant="rect" width={'100%'} height={40} />
        <Divider sx={{ my: 1, width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="text" width={100} height={15} />
        </Box>
      </Box>
    </Box>
  );
};

const ActivityStatsSkeleton = () => {
  return (
    <Box sx={{ flex: 4, rowGap: 5 }}>
      <Skeleton width="100%" height={10} sx={{ my: 5 }} />
      <Skeleton width="100%" height={10} sx={{ my: 5 }} />
      <Skeleton width="100%" height={10} sx={{ my: 5 }} />
      <Skeleton width="100%" height={10} sx={{ my: 5 }} />
      <Skeleton width="100%" height={10} sx={{ my: 5 }} />
    </Box>
  );
};

const HoldingDistributionSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        rowGap: 5,
        height: '100%',
        alignItems: 'flex-start',
        marginTop: 3,
      }}
    >
      <Box
        sx={{
          flex: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Skeleton height={200} width={200} variant="circular" />
      </Box>
      <Box
        sx={{
          flex: 2,
          flexDirection: 'column',
          rowGap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="100%" height={20} />
      </Box>
    </Box>
  );
};

const WalletSentimentSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        rowGap: 1,
      }}
    >
      <Skeleton width={175} height={35} variant="text" />
      <Skeleton width={140} height={140} variant="circular" />
      <Skeleton width={75} height={25} variant="text" />
      <Skeleton width={120} height={20} variant="text" />
    </Box>
  );
};

const AccordionSkeleton = ({ height = 40, noImage }) => {
  return (
    <Box
      sx={{
        height,
        width: '100%',
        display: 'flex',
        columnGap: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {!noImage && (
        <Skeleton
          width={height}
          height={height}
          variant="rect"
          sx={{ borderRadius: 2, backgroundColor: 'var(--lightGrey)' }}
        />
      )}
      <Skeleton width={100} height={25} variant="text" />
      <Divider
        orientation="vertical"
        sx={{
          width: '1px',
          height: 30,
          my: 'auto',
          mx: 1,
        }}
      />
      <Skeleton width={100} height={25} variant="text" />
      <Divider
        orientation="vertical"
        sx={{
          width: '1px',
          height: 30,
          my: 'auto',
          mx: 1,
        }}
      />
      <Skeleton width={125} height={25} variant="text" />
      <Divider
        orientation="vertical"
        sx={{
          width: '1px',
          height: 30,
          my: 'auto',
          mx: 1,
        }}
      />
      <Skeleton width={80} height={25} variant="text" />
    </Box>
  );
};

export {
  ProfileSkeleton,
  WalletStatBoxSkeleton,
  WatchRanksSkeleton,
  WatchlistStatsSkeleton,
  WatchlistStatsSmallSkeleton,
  ActivityStatsSkeleton,
  HoldingDistributionSkeleton,
  AccordionSkeleton,
  WalletSentimentSkeleton,
};
