import { Skeleton } from '@mui/material';
import styles from './Skeleton.module.scss';

const ProfileDetailAccountSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <Skeleton />
        <Skeleton />
      </div>
      <div className={styles.button}>
        <Skeleton variant="circular" width={35} height={35} />
      </div>
    </div>
  );
};

export default ProfileDetailAccountSkeleton;
