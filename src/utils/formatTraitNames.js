import { capitalize } from '@mui/material';
import { shorten } from './shorten';

const showShortenTraitLabel = ({ traitKey, traitValue, length = 25 }) => {
  return shorten(
    `${capitalize(
      (traitKey === 'traitcount' ? 'Trait Count' : traitKey || '').replace(
        'Attributes / ',
        ''
      )
    )} / ${capitalize(traitValue || '')}`,
    length
  );
};
