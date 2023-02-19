import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import styles from './Sniping.module.scss';
import { infoBoxes } from './data/snipe-examples';
import useWindowSize from 'hooks/useWindowSize';

const Launch = () => {
  const { width } = useWindowSize();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 2,
      }}
    >
      <span
        style={{
          fontSize: width < 900 ? 24 : 32,
          padding: 12,
          textAlign: width < 900 ? 'center' : 'left',
          width: width < 900 ? 275 : 'auto',
        }}
      >
        <span style={{ color: 'var(--logoColor)' }}>Never open </span>a
        marketplace again
      </span>
      <Box className={styles.plansContainer}>
        {infoBoxes.map((launch) => {
          return (
            <WhiteCard
              className={styles.launchBox}
              sx={{ mx: width < 900 ? '50px !important' : 'auto' }}
            >
              <Box sx={{ width: 50, height: 50 }}>
                <img src={launch.icon.src} alt="icon" width={75} />
              </Box>
              <span className={styles.launchName}> {launch.name}</span>
              <span className={styles.launchDescription}>
                {launch.description}
              </span>
            </WhiteCard>
          );
        })}
      </Box>
    </Box>
  );
};

export default Launch;
