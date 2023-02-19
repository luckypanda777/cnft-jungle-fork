import { useState } from 'react';
import Range from '../elements/Range';
import Search from '../elements/Search';
import { Typography } from '@mui/material';
import Price from '../elements/Price';
import { Box } from '@mui/system';
import { useSearch } from 'hooks//useSearch';
import { v4 } from 'uuid';
import { Collections, FloorThreshold, Check } from '../../common';
import { useAuth } from 'hooks/useAuth';
import CustomTooltip from 'components/common/CustomTooltip';

const RarityHunt = () => {
  const { user } = useAuth();
  const [useRatio, setUseRatio] = useState(false);
  const [useRewards, setUseRewards] = useState(false);
  const [useHarpoon, setUseHarpoon] = useState(false);
  const [floorThreshold, setFloorThreshold] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRank, setMinRank] = useState(1);
  const [maxRank, setMaxRank] = useState(100);
  const [collection, setCollection] = useState('');
  const [error, setError] = useState('');
  const [harpoonOverFloor, setHarpoonOverFloor] = useState(false);
  const [loading, setLoading] = useState(false);
  const { startBackgroundSearch } = useSearch();

  const handleDelay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const startSearch = () => {
    console.log(collection);
    const search = {
      id: v4(),
      collectionId: collection.id,
      name: collection.name,
      search: collection.label,
      policies: collection.policies,
      floor: minPrice,
      ceiling: maxPrice,
      rarityMin: minRank,
      rarityMax: maxRank,
      type: 'rarity',
      timestamp: Date.now(),
      stop: false,
      floorThreshold,
      harpoonOverFloor,
      useHarpoon,
      useRewards,
      quickSnipe: true,
    };
    console.log('Starting background rarity search..');
    console.log(search);

    handleDelay();
    startBackgroundSearch(search);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        mt: 3,
        width: '100%',
      }}
    >
      <Collections setCollection={setCollection} setError={setError} />
      {error && (
        <Typography
          sx={{ my: 1, width: '300px' }}
          variant="h7"
          // color={theme.palette.primary.main}
        >
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex' }}>
        <Check
          title="Switch to Reward Hunt"
          checked={useRewards}
          onChange={(checked) => setUseRewards(checked)}
          disabled={user.snipeTier !== 'orca' && user.snipeTier !== 'yummi'}
        />
        <Check
          title="Switch to Price Harpoon"
          checked={useHarpoon}
          onChange={(checked) => setUseHarpoon(checked)}
          disabled={user.snipeTier !== 'orca'}
        />
        {useHarpoon && (
          <CustomTooltip title="Harpoon will watch not only under floor, but also over floor by the set percentage.">
            <Box>
              <Check
                title="Harpoon over floor"
                checked={harpoonOverFloor}
                onChange={(checked) => setHarpoonOverFloor(checked)}
                disabled={user.snipeTier !== 'orca'}
              />
            </Box>
          </CustomTooltip>
        )}
      </Box>
      {useHarpoon ? (
        <FloorThreshold
          floorThreshold={floorThreshold}
          setFloorThreshold={setFloorThreshold}
          setError={setError}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            columnGap: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Price
            price={minPrice}
            setPrice={setMinPrice}
            title="Min price in ADA"
            width="145px"
          />
          <Price
            price={maxPrice}
            setPrice={setMaxPrice}
            title="Max price in ADA"
            width="145px"
          />
        </Box>
      )}
      {useRewards && (
        <Box>
          <Check
            title="Switch to Ratio"
            checked={useRatio}
            onChange={(checked) => setUseRatio(checked)}
            disabled={user.snipeTier !== 'orca' && user.snipeTier !== 'yummi'}
          />
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          columnGap: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Price
          price={minRank}
          setPrice={setMinRank}
          title={
            useRatio
              ? 'Minimum ratio'
              : useRewards
              ? 'Minimum reward'
              : 'Minimum rank'
          }
          width="145px"
        />
        <Price
          price={maxRank}
          setPrice={setMaxRank}
          title={
            useRatio
              ? 'Maximum ratio'
              : useRewards
              ? 'Maximum reward'
              : 'Maximum rank'
          }
          width="145px"
        />
      </Box>
      <Search disabled={!collection || loading} startSearch={startSearch} />
    </Box>
  );
};

export default RarityHunt;
