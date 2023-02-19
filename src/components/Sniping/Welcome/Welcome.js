import { Box } from '@mui/material';
import Plans from './Plans';
import Launch from './Launch';
import Events from './Events';
import Examples from './Examples';
import Hero from './Hero';
import styles from './Sniping.module.scss';

const Welcome = () => {
  return (
    <Box className={styles.welcomeContainer}>
      <Hero />
      <Examples />
      <Launch />
      <Events />
      <Plans />
    </Box>
  );
};

export default Welcome;
