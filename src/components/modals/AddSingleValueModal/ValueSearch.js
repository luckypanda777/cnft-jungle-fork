import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { default as MuiPaper } from '@mui/material/Paper';
import SearchIcon from 'assets/search-icon.svg';
import useDebounce from 'hooks/useDebounce';
import { getSearchOptions } from 'apiProvider';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { eventTrack } from 'config/analytics';

const Input = styled(InputBase)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  border: 'solid 2px #d1d5de',
  borderColor: 'var(--searchBorder)',
  color: 'var(--searchColor)',
  backgroundColor: 'var(--searchBg)',
  height: '45px',
  padding: '8px 15px 8px 30px',

  '& .MuiInputBase-input': {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '12px',
    width: 'auto',
    padding: 0,
    paddingLeft: '18px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),

    '&:focus': {
      borderRadius: 10,
      borderColor: 'var(--primaryColor)',
    },
    '@media (max-width: 600px)': {
      fontSize: 11,
    },
  },
}));

const StyledPaper = styled(MuiPaper)(({ theme }) => ({
  '& > .MuiAutocomplete-listbox': {
    height: '100%',
    maxHeight: 'none',
    paddingBottom: 0,
    paddingTop: 0,
    '& > li:first-child': {
      borderBottom: '1px solid',
      borderColor: 'var(--searchPaper)',
    },
  },
}));

const Paper = (props) => {
  return <StyledPaper {...props} />;
};

const SearchValue = ({
  placeholder = 'Search policies, collections, addresses or assets',
  setOptions,
  options,
  loading,
  setLoading,
  setSearched,
  value,
  setValue,
  type,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 400);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    try {
      eventTrack(
        'Search',
        nawValue.group,
        newValue.assetId || newValue.collectionPolicyId
      );
    } catch (err) {}

    if (newValue && newValue.group === 'Collections') {
      router.replace(
        `/collections/${newValue.collectionPolicyId || newValue.collectionId}`
      );
    }

    if (newValue && newValue.group === 'Assets') {
      router.replace(
        `/collections/${
          newValue.collectionPolicyId || newValue.collectionId
        }?assetId=${newValue.assetId}`
      );
    }

    if (newValue && newValue.group === 'Wallets') {
      router.replace(`/addresses/${newValue.wallet}`);
    }
  };

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    if (value?.label === inputValue) {
      return undefined;
    }

    setLoading(true);
    setSearched(true);

    getSearchOptions(debouncedValue)
      .then((data) => {
        if (data && active) {
          const { results } = data;

          if (results.wallet === null) {
            return setOptions([{ label: 'This address does not exist' }]);
          }

          if (results.wallet) {
            const shortened =
              results.wallet.substring(0, 24) +
              '...' +
              results.wallet.substring(76, results.wallet.length);
            return setOptions([
              { label: shortened, wallet: results.wallet, group: 'Wallets' },
            ]);
          }

          if (results.collections.length === 0 && results.assets.length === 0) {
            return setOptions([{ label: 'Nothing found' }]);
          }

          const { assets, collections } = results;

          const assetOptions = assets.map((el, i) => ({
            key: el.asset_id + i,
            label: el.name,
            assetId: el.asset_id,
            collectionId: el.collection_id,
            image: el.optimized_image || el.image,
            collectionPolicyId: el.policy_id,
          }));

          const collectionOptions = collections.map((el, i) => ({
            key: el.collection_name + i,
            label: el.collection_name || el.policies,
            verified: el.verified,
            supply: el.supply,
            collectionId: el.id,
            collectionPolicyId: el.policies,
            image: el.optimized_image || el.image,
          }));

          // deduplicate colectionOptions
          const dedupedCollectionOptions = collectionOptions.reduce(
            (acc, curr) => {
              const duplicate = acc.find(
                (el) => el.collectionPolicyId === curr.collectionPolicyId
              );
              if (!duplicate) {
                acc.push(curr);
              }
              return acc;
            },
            []
          );

          const dedupedAssetOptions = assetOptions.reduce((acc, curr) => {
            const duplicate = acc.find((el) => el.assetId === curr.assetId);
            if (!duplicate) {
              acc.push(curr);
            }
            return acc;
          }, []);

          setOptions(
            type === 'collection'
              ? dedupedCollectionOptions
              : dedupedAssetOptions
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedValue]);

  return (
    <Autocomplete
      disablePortal={false}
      freeSolo
      options={options}
      value={value}
      loading={loading}
      getOptionLabel={(option) => option.label || value}
      onChange={handleChange}
      filterOptions={(x) => x}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderOption={(props, option) => {
        return null;
      }}
      PaperComponent={Paper}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <Input
          placeholder={placeholder}
          startAdornment={<SearchIcon />}
          endAdornment={
            loading ? (
              <CircularProgress
                size={20}
                thickness={5}
                sx={{ color: 'var(--primaryColor)', ml: 1 }}
              />
            ) : null
          }
          ref={params.InputProps.ref}
          inputProps={{ ...params.inputProps }}
        />
      )}
    />
  );
};

export default SearchValue;
