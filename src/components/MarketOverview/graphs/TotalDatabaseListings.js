// material-ui
import styles from '../../../../styles/TotalDatabaseListings.module.scss';
import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  borderRadius: 10,
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
  height: '100%',
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalDatabaseListings = ({ isLoading, icon, title, description }) => {
  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketVolumeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              color: 'white',
              height: '100%',
              width: '100%',
              rowGap: 2,
              // px: 3,
              position: 'relative',
              height: 105,
            }}
          >
            <span className={styles.title}>{title}</span>
            <span className={styles.description}>{description}</span>
            <Box className={styles.imageContainer}>
              <img src={icon.src} alt="logo" className={styles.image} />
            </Box>
            <span
              className={styles.seeAllContainer}
              onClick={() => router.push('/statistics')}
            >
              See More
              <ArrowForwardIcon fontSize="small" sx={{ ml: 0.25 }} />
            </span>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalDatabaseListings;
