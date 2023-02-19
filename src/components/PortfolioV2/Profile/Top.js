import Account from './Account';
import WalletStats from './WalletStats';
import styles from './Top.module.scss';

const Top = () => {
  return (
    <div className={styles.wrap}>
      <Account />
      <WalletStats />
    </div>
  );
};

export default Top;
