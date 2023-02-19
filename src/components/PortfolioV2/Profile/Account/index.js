import { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import Image from 'next/image';
import styles from './Profile.module.scss';
import IconStar from 'assets/ic-actions-star.svg';
import IconCell from 'assets/ic-medicine-cells.svg';
import IconGPS from 'assets/ic-mobile-gps-on.svg';
import IconCopy from 'assets/copy-alt.svg';
import IconWinner from 'assets/ic-sport-winner-2.svg';
import IconUserConfirm from 'assets/ic-users-confirm.svg';
import IconYard from 'assets/ic-sport-yard.svg';
import Skeleton from './Skeleton';

const Account = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const fakeData = {
    address: 'add0k9t7x25mreert5y89cf123',
    avatar:
      'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
    holding: 537,
    involved: 38,
    topHolding: 348,
  };

  if (isLoading)
    return (
      <Box className={styles.profile}>
        <Skeleton />
      </Box>
    );

  return (
    <Box className={styles.profile}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={styles.avatarWrap}>
            <img
              className={styles.avatar}
              src={fakeData.avatar}
              alt="avatar"
              width={100}
              height={100}
            />
            <div className={styles.avatarRight}>
              <div className={styles.address}>
                <span className={styles.addressDetail}>{fakeData.address}</span>
                <div className={styles.copyAddress}>
                  <IconCopy
                    className={styles.iconSize}
                    width={12}
                    height={12}
                  />
                </div>
              </div>
              <div className={styles.iconWrap}>
                <div className={styles.icon}>
                  <IconGPS width={16} height={16} />
                </div>
                <div className={styles.icon}>
                  <IconUserConfirm width={16} height={16} />
                </div>
                <div className={styles.icon}>
                  <IconWinner width={16} height={16} />
                </div>
                <div className={styles.icon}>
                  <IconYard width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={styles.profilePoint}>
          <div className={styles.holdingWrap}>
            <div className={styles.collection}>
              <div className={styles.title}>Holding</div>
              <div>
                <span className={styles.number}>{fakeData.holding}</span>
                <span className={styles.unit}>NFTs</span>
              </div>
            </div>
            <div className={styles.gap} />
            <div className={styles.collection}>
              <div className={styles.title}>Involved</div>
              <div>
                <span className={styles.number}>{fakeData.involved}</span>
                <span className={styles.unit}>Collections</span>
              </div>
            </div>
          </div>
          <div className={styles.holding}>
            <div className={styles.title}>Top Holding:</div>
            <div>
              <span className={styles.number}>Clay Nation</span>
              <span className={styles.unit}>{fakeData.topHolding} NFTs</span>
            </div>
          </div>
        </Grid>
      </Grid>
      <Box className={styles.corner}>
        <div className={styles.cornerIcon}>
          <IconCell width={18} height={16} />
        </div>
        <div className={styles.cornerIcon}>
          <IconStar width={18} height={18} />
        </div>
      </Box>
    </Box>
  );
};

export default Account;
