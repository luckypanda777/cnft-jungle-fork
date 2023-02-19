import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import styles from '../ApiInfo.module.scss';
import { launchBoxes } from '../data/code-examples';

const Launch = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 2,
      }}
    >
      <span style={{ fontSize: 32 }}>
        Launch your next project{' '}
        <span style={{ color: 'var(--logoColor)' }}>10x faster</span>
      </span>
      <Box className={styles.plansContainer}>
        {launchBoxes.map((launch) => {
          return (
            <WhiteCard className={styles.launchBox}>
              <Box sx={{ width: 50, height: 50 }}>
                <img
                  src={launch.icon.src}
                  alt="icon"
                  width={launch.wide ? 60 : 50}
                />
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
