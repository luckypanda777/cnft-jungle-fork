import styles from './Stats.module.scss';
import Skeleton from './Skeleton';
const Stats = ({
  bgShadow,
  isAddress = false,
  isRank = false,
  title = null,
  totalValue = null,
  unit = null,
  valueFirst = null,
  valueSecond = null,
  rankValue = null,
  isLoading = true,
  isPercent = false,
}) => {
  if (isLoading) {
    return <Skeleton />;
  }

  if (isRank) {
    return (
      <StatsRank bgShadow={bgShadow} rankValue={rankValue} title={title} />
    );
  }
  return (
    <StatsNormal
      bgShadow={bgShadow}
      isAddress={isAddress}
      title={title}
      totalValue={totalValue}
      unit={unit}
      isPercent={isPercent}
      valueFirst={valueFirst}
      valueSecond={valueSecond}
    />
  );
};

export default Stats;

const StatsNormal = ({
  bgShadow,
  isAddress = false,
  title = null,
  totalValue = null,
  unit = null,
  valueFirst = null,
  valueSecond = null,
  isPercent = false,
}) => {
  let colorValueName = undefined;
  if (isAddress) {
    colorValueName = styles.green;
  } else if (!isPercent) {
    colorValueName = styles.shadow;
  }
  return (
    <div className={`${styles.box} ${bgShadow ? styles.boxShadow : undefined}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.valueWrap}>
        <span className={styles.totalValue}>{totalValue}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      <div className={styles.dayWarp}>
        <span className={colorValueName}>{isAddress ? 'Whales' : '7D'}: </span>
        <span
          className={
            valueSecond
              ? valueFirst.isPositive
                ? styles.green
                : styles.red
              : undefined
          }
        >
          {valueFirst.value}
        </span>
      </div>
      <div className={styles.dayWarp}>
        <span className={colorValueName}>
          {isAddress ? 'Contracts' : '30D'}:{' '}
        </span>
        <span
          className={
            isPercent
              ? valueSecond.isPositive
                ? styles.green
                : styles.red
              : undefined
          }
        >
          {valueSecond.value}
        </span>
      </div>
    </div>
  );
};

const StatsRank = ({ bgShadow, rankValue, title }) => {
  const colorNumber = (value) => {
    if (value < 20) {
      return `${styles.rankNumber} ${styles.yellow}`;
    }
    return styles.rankNumber;
  };
  return (
    <div className={`${styles.box} ${bgShadow ? styles.boxShadow : undefined}`}>
      <div className={`${styles.title} ${styles.titleRankWrap}`}>{title}</div>
      <div className={styles.rankWrap}>
        <span className={colorNumber(rankValue.est)}>#{rankValue.est} </span>
        <span>Holdings</span>
      </div>
      <div className={styles.rankWrap}>
        <span className={colorNumber(rankValue.floor)}>
          #{rankValue.floor}{' '}
        </span>
        <span>Floor Holdings</span>
      </div>
      <div className={styles.rankWrap}>
        <span className={colorNumber(rankValue.total)}>
          #{rankValue.total}{' '}
        </span>
        <span>Total NFTs</span>
      </div>
    </div>
  );
};
