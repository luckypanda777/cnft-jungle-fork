import { Box } from '@mui/material';
import { middlen } from 'utils/shorten';
import styles from '../../styles/Snipe.module.scss';

const MobileTrait = ({
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
      fontSize: 14,
      justifyContent: 'space-between',
    }}
  >
    <Box sx={{ display: 'flex', columnGap: 0.5 }}>
      <Box className={styles.heading}>
        {middlen(
          `${traitKey.replace('attributes / ', '')} / ${traitValue}`,
          12
        )}
      </Box>
      <Box className={styles.value}>({(traitFrequency * 100).toFixed(2)}%)</Box>
    </Box>
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

export default MobileTrait;
