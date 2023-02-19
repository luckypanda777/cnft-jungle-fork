import { Box } from '@mui/material';
import styles from '../../styles/Snipe.module.scss';

const Trait = ({
  index,
  traitKey,
  traitValue,
  traitfloors,
  traitFrequency,
  traitPriceDifference,
}) => (
  <Box
    key={index}
    className={styles.paper}
    style={{
      display: 'flex',
      fontSize: 16,
      columnGap: 10,
      justifyContent: 'center',
    }}
  >
    <Box className={styles.heading}>{traitKey}</Box>
    <Box className={styles.heading}> / </Box>
    <Box className={styles.value}>{traitValue}</Box>
    <Box className={styles.value}>({(traitFrequency * 100).toFixed(2)}%)</Box>
    <Box
      style={{
        color:
          traitPriceDifference > 500
            ? 'var(--severeUndervaluedColor)'
            : traitPriceDifference > 200
            ? 'var(--undervaluedColor)'
            : traitPriceDifference > 0
            ? 'var(--slightlyUndervaluedColor)'
            : traitPriceDifference === 0
            ? 'var(--fontColor)'
            : traitPriceDifference < -500
            ? 'var(--severeOvervaluedColor)'
            : traitPriceDifference < -200
            ? 'var(--overvaluedColor)'
            : 'var(--slightlyOvervaluedColor)',
      }}
    >
      {!isNaN(traitPriceDifference) ? (
        <>
          {traitfloors[traitKey][traitValue]} ADA (
          {traitPriceDifference > 0
            ? '+'
            : traitPriceDifference == 0
            ? '='
            : ''}
          {parseInt(traitPriceDifference)} ADA)
        </>
      ) : (
        'No data'
      )}
    </Box>
  </Box>
);

export default Trait;
