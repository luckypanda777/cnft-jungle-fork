import { useEffect, useState } from 'react';
import styles from './WalletStats.module.scss';
import Starts from './Stats';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <div className={styles.walletStats}>
      <Starts
        bgShadow={true}
        title="Est Value"
        totalValue="1,300,456"
        unit="ADA"
        isPercent={true}
        valueFirst={{
          value: '+8.03%',
          isPositive: true,
        }}
        valueSecond={{
          value: '+10,502.07%',
          isPositive: true,
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={true}
        title="Current Value"
        totalValue="1,700,456"
        unit="ADA"
        isPercent={true}
        valueFirst={{
          value: '+8.03%',
          isPositive: true,
        }}
        valueSecond={{
          value: '-45.95%',
          isPositive: false,
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={true}
        title="Total P/L"
        totalValue="1,300,456"
        unit="ADA"
        isPercent={true}
        valueFirst={{
          value: '-5.49%',
          isPositive: false,
        }}
        valueSecond={{
          value: '-24.59%',
          isPositive: false,
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={true}
        isRank={true}
        title="Wallet Rank"
        rankValue={{
          est: 205,
          floor: 55,
          total: 15,
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={false}
        title="Buy Volume"
        totalValue="3,200,777"
        unit="ADA"
        isPercent={false}
        valueFirst={{
          value: '10,362 ADA',
        }}
        valueSecond={{
          value: '40,362 ADA',
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={false}
        title="Sell Volume"
        totalValue="1,300,456"
        unit="ADA"
        isPercent={false}
        valueFirst={{
          value: '10,362 ADA',
        }}
        valueSecond={{
          value: '40,362 ADA',
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={false}
        isAddress={true}
        title="Related Addresses"
        totalValue="288"
        unit="Wallets"
        isPercent={false}
        valueFirst={{
          value: '25 Wallets',
        }}
        valueSecond={{
          value: '5 Wallets',
        }}
        isLoading={isLoading}
      />
      <Starts
        bgShadow={false}
        title="Total Activity"
        totalValue="3,200,777"
        unit={null}
        isPercent={false}
        valueFirst={{
          value: '10,362',
        }}
        valueSecond={{
          value: '40,362',
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Profile;
