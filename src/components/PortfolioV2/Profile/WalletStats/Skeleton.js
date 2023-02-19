import { Skeleton, Stack } from '@mui/material';
import styles from './Skeleton.module.scss';

const WalletStatsSkeleton = () => {
  return (
    <div className={styles.box}>
      <Skeleton />
      <Skeleton className={styles.value} />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

export default WalletStatsSkeleton;
