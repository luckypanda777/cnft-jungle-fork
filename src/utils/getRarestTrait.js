import { capitalize } from '@mui/material';
import { shorten } from './shorten';

const getRarestTrait = ({
  assetTraits,
  collectionTraits,
  collectionSupply,
}) => {
  if (
    !assetTraits ||
    !collectionTraits ||
    Object.keys(assetTraits).length === 0 ||
    Object.keys(collectionTraits).length === 0
  )
    return {
      displayText: '',
      displayTextNoPercentage: '',
      assetTraitKey: '',
      assetTraitValue: '',
      percentage: 0,
    };
  // console.log(assetTraits, collectionTraits);
  const allTraitPercentages = Object.entries(assetTraits).map(
    ([assetTraitKey, assetTraitValue]) => {
      const collectionTraitValue =
        collectionTraits?.[assetTraitKey]?.[assetTraitValue];

      if (!collectionTraitValue) {
        return {
          assetTraitKey: '',
          assetTraitValue: '',
          percentage: 0,
        };
      }

      const collectionTraitValueSum =
        Object.values(collectionTraits[assetTraitKey]).reduce(
          (acc, curr) => acc + curr,
          0
        ) || 0;
      const percentage = (
        (collectionTraitValue / (collectionSupply || collectionTraitValueSum)) *
        100
      ).toFixed(2);

      return {
        assetTraitKey: assetTraitKey || '',
        assetTraitValue: assetTraitValue || '',
        percentage: percentage || 0,
      };
    }
  );

  let rarestTrait = allTraitPercentages
    .filter((a) => a.percentage !== 0)
    .sort((a, b) => a.percentage - b.percentage)[0];

  rarestTrait = rarestTrait || {
    displayText: '',
    displayTextNoPercentage: '',
    assetTraitKey: '',
    assetTraitValue: '',
    percentage: 0,
  };

  rarestTrait.displayText = `${
    rarestTrait?.assetTraitKey === 'traitcount'
      ? `${rarestTrait?.assetTraitValue} Trait Count`
      : capitalize(shorten(rarestTrait?.assetTraitValue?.toString(), 18))
  } (${rarestTrait?.percentage}%)`.replace('Attributes / ', '');

  rarestTrait.displayTextNoPercentage =
    rarestTrait?.assetTraitKey === 'traitcount'
      ? `${rarestTrait?.assetTraitValue} Trait Count`
      : `${capitalize(rarestTrait?.assetTraitValue?.toString())}`.replace(
          'Attributes / ',
          ''
        );

  return rarestTrait;
};

export { getRarestTrait };
