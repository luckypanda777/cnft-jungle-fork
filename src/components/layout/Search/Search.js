import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { default as MuiPaper } from '@mui/material/Paper';
import SearchIcon from 'assets/search-icon-header.svg';
import useDebounce from 'hooks/useDebounce';
import { getSearchOptions } from 'apiProvider';
import { CircularProgress, ListItemAvatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle as globalAvatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { parseCID } from 'utils/cardanoUtils';
import { eventTrack } from 'config/analytics';
import { SearchBox } from 'components/boxes/BookmarkBoxes';
import VerifiedBadge from 'components/badges/VerifiedBadge';

const avatarStyle = {
  ...globalAvatarStyle,
  background: 'var(--assetsBg)',
};

const Input = styled(InputBase)(({ theme }) => ({
  width: '100%',
  color: 'var(--searchColor)',
  backgroundColor: 'var(--headerSearchBgColor)',
  height: '44px',
  padding: '0 20px',
  '&:focus, &:active, &:focus-within': {
    backgroundColor: 'var(--headerNewsBgColor)',
  },

  '& .MuiInputBase-input': {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '14px',
    width: 'auto',
    padding: 0,
    paddingRight: '8px',
    letterSpacing: '-0.3px',
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
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(6.7957px)',
  backgroundImage: 'unset',
  '& > .MuiAutocomplete-listbox': {
    height: '100%',
    maxHeight: 'none',
    paddingBottom: 0,
    paddingTop: 0,
  },
  '.MuiAutocomplete-groupLabel': {
    borderRadius: 0,
    color: 'var(--fontColor)',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '15px',
    padding: '14px 0 10px 20px',
    backgroundColor: 'transparent',
  },
  '& > ul': {
    display: 'flex',
    '& > li': {
      flex: 1,
      width: '250px',
    },
  },
}));

const Paper = (props) => {
  return <StyledPaper {...props} />;
};

const Search = ({
  placeholder = 'Search policies, collections, addresses or assets',
}) => {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 400);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
      setOpen(false);
      return undefined;
    }

    if (value?.label === inputValue) {
      return undefined;
    }

    setLoading(true);
    setOpen(true);

    getSearchOptions(debouncedValue)
      .then((data) => {
        if (data && active) {
          const { results } = data;

          if (results.wallet === null) {
            return setOptions([
              { label: 'This address does not exist', group: 'Not found' },
            ]);
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

          if ([...results.collections, ...results.assets].length === 0) {
            return setOptions([
              { label: 'No results found for your query', group: 'Not found' },
            ]);
          }

          const { assets, collections } = results;

          const assetOptions = assets.map((el, i) => ({
            key: el.asset_id + i,
            label: el.name,
            assetId: el.asset_id,
            collectionId: el.collection_id,
            image: el.optimized_image || el.image,
            collectionPolicyId: el.policy_id,
            group: 'Assets',
          }));

          const collectionOptions = collections.map((el, i) => ({
            key: el.collection_name + i,
            label: el.collection_name || el.policies,
            verified: el.verified,
            supply: el.supply,
            collectionId: el.id,
            collectionPolicyId: el.policies,
            group: 'Collections',
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
          // deduplicate colectionOptions
          const dedupedAssetOptions = assetOptions.reduce((acc, curr) => {
            const duplicate = acc.find(
              (el) => el.collectionPolicyId === curr.collectionPolicyId
            );
            if (!duplicate) {
              acc.push(curr);
            }
            return acc;
          }, []);

          setOptions([...dedupedCollectionOptions, ...dedupedAssetOptions]);
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
      disablePortal={true}
      freeSolo
      open={open}
      PaperComponent={Paper}
      sx={{ width: '100%', maxWidth: 500 }}
      options={options}
      value={value}
      loading={loading}
      getOptionLabel={(option) => option.label || value}
      groupBy={(option) => option.group}
      onChange={handleChange}
      onClose={() => {
        setOpen(false);
      }}
      filterOptions={(x) => x}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderOption={(props, option) => {
        const ipfsCID = parseCID(option.image);

        if (option.group === 'Collections') {
          return (
            <SearchBox
              key={option.key}
              option={option}
              onClick={() => handleChange({}, option)}
              style={{
                // backgroundColor: 'var(--lightGrey)',
                // my: 0.5,
                // mx: 0.5,
                // px: 1,
                height: 'auto',
                borderRadius: 0,
                paddingBottom: '7px',
                paddingLeft: '20px',
              }}
              labelLength={16}
              showIcons={['verified']}
              // showIcons={['verified']}
              showSupply
              type="collection"
              identifier={option.collectionPolicyId}
            />
          );
        }
        if (option.group === 'Assets') {
          return (
            <SearchBox
              key={option.key}
              option={option}
              onClick={() => handleChange({}, option)}
              style={{
                // backgroundColor: 'var(--lightGrey)',
                // my: 0.5,
                // mx: 0.5,
                // px: 1,
                height: 'auto',
                borderRadius: 0,
                paddingBottom: '7px',
                paddingLeft: '20px',
              }}
              // showIcons={['bookmark', 'verified']}
              showIcons={[]}
              type="asset"
              identifier={option.assetId}
            />
          );
        }

        return (
          <Box
            {...props}
            key={option.key}
            sx={{
              height: 60,
              py: 0,
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            <ListItemAvatar>
              {!option.image ? (
                <Avatar src={option.image} alt={option.label} sx={avatarStyle}>
                  <ImageWithErrorHandler
                    src="assets/catunsupported.webp"
                    alt="unsupported"
                    style={{
                      borderRadius: '8px',
                      width: 45,
                      height: 45,
                      objectFit: 'var(--objectFit)',
                    }}
                  />
                </Avatar>
              ) : (
                <Avatar alt={option.label} sx={avatarStyle}>
                  <ImageWithErrorHandler
                    src={ipfsCID ? imgLinkReplace(option.image) : option.image}
                    style={{
                      borderRadius: '8px',
                      width: 45,
                      height: 45,
                      objectFit: 'var(--objectFit)',
                    }}
                  />
                </Avatar>
              )}
            </ListItemAvatar>
            <Typography sx={{ fontWeight: 500 }}>{option.label}</Typography>
            {!!option.verified && (
              <VerifiedBadge width={20} height={20} verified />
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <Input
          placeholder={placeholder}
          endAdornment={
            loading ? (
              <CircularProgress
                size={10}
                thickness={5}
                sx={{ color: 'var(--primaryColor)' }}
              />
            ) : (
              <SearchIcon />
            )
          }
          ref={params.InputProps.ref}
          inputProps={{ ...params.inputProps }}
        />
      )}
    />
  );
};

export default Search;
