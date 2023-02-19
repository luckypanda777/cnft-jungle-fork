import { useState, useEffect } from 'react';
import Skeleton from './Skeleton';
import styles from './ProfileDetailHolding.module.scss';

const ProfileDetailHolding = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  const colors = [
    '#3231D5',
    '#69EFF2',
    '#76F269',
    '#F2B069',
    '#F26969',
    '#699CF2',
    '#D5317C',
    '#E669F2',
    '#F2E269',
  ];

  const fakeData = [
    {
      name: 'Wenno Cats',
      percent: '21%',
      value: '₳2506.05',
    },
    {
      name: 'Clay Nation',
      percent: '15%',
      value: '₳1506.05',
    },
    {
      name: 'SpaceRocket',
      percent: '13%',
      value: '₳506.05',
    },
    {
      name: 'Travia',
      percent: '12%',
      value: '₳306.05',
    },
    {
      name: 'Boom',
      percent: '9%',
      value: '₳206.05',
    },
    {
      name: 'Pirates',
      percent: '4%',
      value: '₳106.05',
    },
    {
      name: 'Budz',
      percent: '3.4%',
      value: '₳56.05',
    },
    {
      name: 'LivingArmor',
      percent: '1.9%',
      value: '₳36.05',
    },
    {
      name: 'ElionyMasky',
      percent: '0.7%',
      value: '₳16.05',
    },
  ];

  const formattedData = fakeData.map((item, index) => {
    return { ...item, color: colors[index] };
  });

  const renderChart = () => {
    return formattedData.map((item, key) => {
      return (
        <div className={styles.col} key={key}>
          <div
            className={styles.colValue}
            style={{ height: item.percent, backgroundColor: item.color }}
          />
        </div>
      );
    });
  };

  const renderDesc = () => {
    return formattedData.map((item, index) => {
      return (
        <div className={styles.desc} key={index}>
          <span
            className={styles.dot}
            style={{ backgroundColor: item.color }}
          />
          <div>
            <span className={styles.descName}>
              {`${item.name}: ${item.value} `}
              <span className={styles.descValue}>{`(${item.value})`}</span>
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.chart}>{renderChart()}</div>
      <div className={styles.descWrap}>{renderDesc()}</div>
    </div>
  );
};

export default ProfileDetailHolding;
