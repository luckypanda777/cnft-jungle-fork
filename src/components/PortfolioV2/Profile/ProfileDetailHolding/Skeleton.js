import { Skeleton, Box } from '@mui/material';
import styles from './Skeleton.module.scss';

const ProfileDetailCardSkeleton = () => {
  const renderChart = () => {
    return Array.from(Array(9)).map((_, index) => {
      return (
        <div className={styles.col} key={index}>
          <Skeleton className={styles.skeletonCol} />
        </div>
      );
    });
  };
  const renderDesc = () => {
    return Array.from(Array(9)).map((_, index) => {
      return <Skeleton key={index} />;
    });
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.chart}>{renderChart()}</div>
      <div className={styles.descWrap}>{renderDesc()}</div>
    </div>
  );
};

export default ProfileDetailCardSkeleton;
