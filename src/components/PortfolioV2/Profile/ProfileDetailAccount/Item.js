import Image from 'next/image';
import styles from './Item.module.scss';
import orca from 'assets/jungleorca.png';

const Item = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.detailRight}>
          <div className={styles.address}>9t7x25m54…re50l9ert</div>
          <div className={styles.time}>Last action: 30/10/2022 19:28 UTC</div>
        </div>
        <div className={styles.detailLeft}>
          <div className={styles.action}>
            Action: <span className={styles.actionTimes}>11</span>
          </div>
          <div className={styles.subscription}>
            Subscription: <span className={styles.subscriptionName}>Whale</span>
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <div className={styles.imageWrap}>
          <Image src={orca} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Item;
