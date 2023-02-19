import styles from './Tabs.module.scss';
import { Box, CircularProgressm, Divider } from '@mui/material';

const Stat = ({ loading = false, value = 'Info', highlightValue = '12' }) => {
  return (
    <Box className={styles.circulation} sx={{ mx: 0.5 }}>
      {loading ? (
        <CircularProgress size={16} sx={{ color: 'var(--primaryColor)' }} />
      ) : (
        <span style={{ fontSize: 16 }}>
          {value} {highlightValue}
        </span>
      )}
    </Box>
  );
};

const StatDivider = () => {
  return (
    <Divider
      orientation={{ md: 'vertical', xs: 'horizontal' }}
      sx={{
        height: { md: 25, xs: '1px' },
        width: { md: '1px', xs: '90%' },
        backgroundColor: 'var(--primaryColor)',
      }}
    />
  );
};

const InfoBoxes = () => {
  return (
    <Box
      className={styles.statsContainer}
      // onClick={() => router.push('statistics')}
      onClick={() => {}}
    >
      <Stat />
      <StatDivider />
      <Stat />
      <StatDivider />
      <Stat />
      <StatDivider />
      <Stat />
    </Box>
  );
};

export default InfoBoxes;
