import { Box, Button, capitalize, CircularProgress } from '@mui/material';
import classNames from 'classnames';
import { formatTraits, mergeDeep } from 'utils/flattenObject';
import { shorten } from 'utils/shorten';
import styles from './Traits.module.scss';
import CustomTooltip from 'components/common/CustomTooltip';

const Trait = ({
  price,
  trait,
  isSale,
  isCompare,
  compareClassName,
  collectionTraitFloors,
  handleTraitFilterFromModal,
  loadingAssetTraitfloors,
}) => {
  if (!trait) return null;

  const traitFloor = collectionTraitFloors?.[trait.name]?.[trait.value] || 0;
  const priceDiff = traitFloor - price;

  const handleTraitFloorFilter = () => {
    if (
      handleTraitFilterFromModal &&
      typeof handleTraitFilterFromModal === 'function'
    ) {
      handleTraitFilterFromModal(trait.name, trait.value);
    }
  };

  const renderTrait = (trait) => (
    <Box className={[styles.trait, isCompare && styles.compareTrait]}>
      <Box className={styles.info}>
        <CustomTooltip title={`Trait name: ${trait.name}`} placement="top">
          <span className={styles.slot}>
            {capitalize(
              shorten(
                trait.name === 'traitcount' ? 'Trait Count' : trait.name
              ).replace('attributes / ', ''),
              30
            )}
          </span>
        </CustomTooltip>
        <CustomTooltip
          title={`Trait value: ${capitalize(trait.value.toString())}`}
          placement="bottom"
        >
          <span className={styles.name}>
            {shorten(
              trait.value,
              trait.percent !== 0 && trait.percent ? 20 : 24
            )}
          </span>
        </CustomTooltip>
      </Box>
      <Box
        className={classNames(styles.floor)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CustomTooltip
          title={`Floor for ${capitalize(trait.name)} / ${capitalize(
            trait.value.toString()
          )} is ${traitFloor} ADA, click to filter by this trait`}
          placement="bottom"
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleTraitFloorFilter}
            sx={{
              backgroundColor:
                loadingAssetTraitfloors || price === traitFloor || !price
                  ? 'var(--primaryColor)'
                  : priceDiff > 0
                  ? 'var(--undervaluedColor)'
                  : 'var(--overvaluedColor)',
            }}
          >
            {loadingAssetTraitfloors ? (
              <Box
                sx={{
                  minWidth: 30,
                  minHeight: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={16} sx={{ color: 'white' }} />
              </Box>
            ) : traitFloor ? (
              <span style={{ fontSize: 12, fontWeight: 'bold' }}>
                {traitFloor} ADA
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 'bold' }}>No floor</span>
            )}
          </Button>
        </CustomTooltip>
      </Box>
      {trait.percent !== 0 && trait.percent && (
        <Box
          className={classNames(styles.percent, compareClassName)}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <CustomTooltip
            title={`Trait chance: ${trait.percent}%`}
            placement="top"
          >
            <span>{trait.percent}%</span>
          </CustomTooltip>
          <CustomTooltip title={`Trait rank: ${trait.rank}`} placement="bottom">
            <span style={{ fontSize: 10 }}>{trait.rank}</span>
          </CustomTooltip>
        </Box>
      )}
      {trait.percent === 0 && (
        <Box
          className={classNames(styles.percent, compareClassName)}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <CustomTooltip title={`Trait chance: Unique`} placement="top">
            <span>Unique</span>
          </CustomTooltip>
        </Box>
      )}
    </Box>
  );

  return renderTrait(trait);
};

const Traits = ({
  asset,
  collection,
  isCompare,
  compareWithAssetInfo,
  compareClassName,
  showTraitCount,
  collectionTraitFloors,
  compareWithTraitFloors,
  handleTraitFilterFromModal,
  loadingAssetTraitfloors,
}) => {
  if (!collection || !asset || Object.values(asset?.traits || {}).length === 0)
    return null;

  if (typeof collection.traitlist === 'string') {
    collection.traitlist = JSON.parse(collection.traitlist);
  }
  console.log(asset, collection);
  const traits = formatTraits(asset, collection);

  if (isCompare && compareWithAssetInfo) {
    const compareAssetTraits = formatTraits(compareWithAssetInfo, collection);

    return traits.map((trait, i) => {
      if (!showTraitCount && trait.name === 'traitCount') {
        return null;
      }

      return (
        <Trait
          key={i}
          trait={trait}
          price={asset.price || asset.sold_for}
          isSale={!!asset.sold_for}
          isCompare={isCompare}
          compareClassName={compareClassName({
            value: trait.percent,
            otherValue: compareAssetTraits[i] && compareAssetTraits[i].percent,
            lowerTheBetter: true,
          })}
          collectionTraitFloors={mergeDeep(
            compareWithTraitFloors,
            collectionTraitFloors
          )}
          loadingAssetTraitfloors={loadingAssetTraitfloors}
        />
      );
    });
  }

  return traits.map((trait, i) => {
    if (!showTraitCount && trait.name === 'traitCount') {
      return null;
    }

    return (
      <Trait
        key={i}
        trait={trait}
        price={asset.listing_price || asset.sold_for}
        isSale={!!asset.sold_for}
        collectionTraitFloors={collectionTraitFloors}
        handleTraitFilterFromModal={handleTraitFilterFromModal}
        loadingAssetTraitfloors={loadingAssetTraitfloors}
      />
    );
  });
};

export default Traits;
