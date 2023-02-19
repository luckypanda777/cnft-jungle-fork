import { useContext, useEffect, useState } from 'react';
import Search from '../elements/Search';
import { Typography, Box, Tooltip } from '@mui/material';
import Price from '../elements/Price';
import { v4 } from 'uuid';
import {
  Collections,
  Check,
  FloorThreshold,
  CollectionTraits,
} from '../../common';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useSearch } from 'hooks//useSearch';
import { Context as AuthContext } from 'context/AuthContext';
import CustomTooltip from 'components/common/CustomTooltip';

const TraitHunt = () => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const { showFeedback } = useContext(FeedbackContext);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [minTraitValue, setMinTraitValue] = useState(0);
  const [maxTraitValue, setMaxTraitValue] = useState(100);
  const [useInterception, setUserInterception] = useState(false);
  const [useHarpoon, setUseHarpoon] = useState(false);
  const [floorThreshold, setFloorThreshold] = useState(0);
  const [harpoonOverFloor, setHarpoonOverFloor] = useState(false);
  const [useTraitFloorHarpoon, setUseTraitFloorHarpoon] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [useValue, setUseValue] = useState(false);
  const [collection, setCollection] = useState('');
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [error, setError] = useState('');
  const [specificName, setSpecificName] = useState('');
  const [loading, setLoading] = useState(false);
  const { startBackgroundSearch } = useSearch();

  const handleDelay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const startSearch = () => {
    if (selectedTraits.length > 1 && user.snipeTier !== 'orca') {
      return showFeedback({
        kind: 'error',
        message: 'Your permissions can only select one trait!',
        duration: 2000,
      });
    }

    console.log(collection);
    const search = {
      id: v4(),
      collectionId: collection.id,
      name: collection.name,
      search: collection.label,
      policies: collection.policies,
      floor: min,
      ceiling: max,
      type: 'traits',
      timestamp: Date.now(),
      stop: false,
      traits: selectedTraits,
      useInterception,
      floorThreshold,
      harpoonOverFloor,
      useTraitFloorHarpoon,
      useHarpoon,
      traitFloors: {},
      useRegex,
      specificName,
      useValue,
      minTraitValue,
      maxTraitValue,
      quickSnipe: true,
    };
    console.log('Starting background rarity search..');
    console.log(search);

    handleDelay();
    startBackgroundSearch(search);
  };

  console.log(
    'TRAITS',
    selectedTraits.length > 1,
    'PERMISSIONS',
    user.snipeTier
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        mt: 3,
        width: '100%',
      }}
    >
      <Collections setCollection={setCollection} setError={setError} />
      <CollectionTraits
        sx={{
          mt: 1,
          overflowY: selectedTraits.length > 4 ? 'scroll !important' : 'auto',
        }}
        setError={setError}
        collectionId={collection.id}
        selectedTraits={selectedTraits}
        setSelectedTraits={setSelectedTraits}
        permissions={user.snipeTier}
      />
      {error && (
        <Typography
          sx={{ my: 1, width: '100%' }}
          variant="h7"
          // color={theme.palette.primary.main}
        >
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', columnGap: 2, justifyContent: 'center' }}>
        <CustomTooltip title="The trait hunt will use AND logic meaning it will only succeed if the NFT has ALL selected traits. If unchecked it will use OR logic meaning it will succeed if the NFT has at least one of the selected traits">
          <Box>
            <Check
              title="Use AND logic"
              checked={useInterception}
              onChange={(checked) => setUserInterception(checked)}
              disabled={user.snipeTier !== 'orca'}
              sx={{ width: 'auto' }}
            />
          </Box>
        </CustomTooltip>
        <Check
          title="Use Harpoon"
          checked={useHarpoon}
          onChange={(checked) => setUseHarpoon(checked)}
          disabled={user.snipeTier !== 'orca'}
          sx={{ width: 'auto' }}
        />
        <Check
          title="Use regex"
          checked={useRegex}
          onChange={(checked) => setUseRegex(checked)}
          sx={{ width: 'auto' }}
        />
        <Check
          title="Use Trait Value"
          checked={useValue}
          onChange={(checked) => setUseValue(checked)}
          sx={{ width: 'auto' }}
        />
      </Box>
      {useRegex && (
        <Price
          price={specificName}
          setPrice={setSpecificName}
          title="Asset name or regex"
        />
      )}
      {useHarpoon ? (
        <>
          <Box sx={{ display: 'flex', columnGap: 2, justifyContent: 'center' }}>
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
            <CustomTooltip title="Harpoon trait floors instead of whole collection floor.">
              <Box>
                <Check
                  title="Harpoon trait floors"
                  checked={useTraitFloorHarpoon}
                  onChange={(checked) => setUseTraitFloorHarpoon(checked)}
                  disabled={user.snipeTier !== 'orca'}
                />
              </Box>
            </CustomTooltip>
          </Box>
          <FloorThreshold
            floorThreshold={floorThreshold}
            setFloorThreshold={setFloorThreshold}
            setError={setError}
          />
        </>
      ) : (
        <>
          {useValue && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Price
                price={minTraitValue}
                setPrice={setMinTraitValue}
                title="Min trait value"
              />
              <Price
                price={maxTraitValue}
                setPrice={setMaxTraitValue}
                title="Max trait value"
              />
            </Box>
          )}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              columnGap: 3,
              justifyContent: 'space-between',
            }}
          >
            <Price price={min} setPrice={setMin} title="Min price in ADA" />
            <Price price={max} setPrice={setMax} title="Max price in ADA" />
          </Box>
        </>
      )}
      <CustomTooltip
        title={
          selectedTraits.length > 1 && user.snipeTier !== 'orca'
            ? 'Your permissions can only select one trait!'
            : ''
        }
      >
        <Box>
          <Search
            disabled={
              !collection ||
              loading ||
              (selectedTraits.length > 1 && user.snipeTier !== 'orca')
            }
            startSearch={startSearch}
          />
        </Box>
      </CustomTooltip>
    </Box>
  );
};

export default TraitHunt;
