import Box from '@mui/material/Box';
import styles from './MarketStatsBox.module.scss';
import classNames from 'classnames';

const StatBox = ({ title, value, percentage }) => {
  const isPositive = percentage > 0;

  return (
    <Box className={styles.statBox}>
      <div className={styles.statCol}>
        <h3 className={styles.statPrimaryText}>{title}</h3>
        <span className={styles.statSecondaryText}>24 hours</span>
      </div>
      <div className={styles.statCol} style={{ textAlign: 'right' }}>
        <h3 className={styles.statPrimaryText}>{value}</h3>
        {/* <span
          className={classNames(styles.statSecondaryText, {
            [styles.posPercent]: isPositive,
            [styles.negPercent]: !isPositive,
          })}
        >
          {Math.abs(percentage)}%
        </span> */}
      </div>
    </Box>
  );
};

export default StatBox;
