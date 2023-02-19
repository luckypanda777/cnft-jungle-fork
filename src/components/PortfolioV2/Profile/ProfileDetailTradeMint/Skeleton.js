import { Skeleton } from '@mui/material';
import styles from './Skeleton.module.scss';

const ProfileDetailTradeSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.avatar}>
          <Skeleton variant="rounded" width={80} height={80} />
        </div>
        <div className={styles.detailLeft}>
          <Skeleton />
          <Skeleton />
          <Skeleton width={'30%'} />
        </div>
        <div className={styles.detailRight}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
      <div className={styles.button}>
        <Skeleton variant="circular" width={35} height={35} />
      </div>
    </div>
  );
};

export default ProfileDetailTradeSkeleton;
