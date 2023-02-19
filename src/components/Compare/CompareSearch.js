import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { default as MuiPaper } from '@mui/material/Paper';
import useDebounce from '../../hooks/useDebounce';
import { getCompareSearchOptions } from '../../apiProvider';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import CustomTooltip from 'components/common/CustomTooltip';
import VerifiedBadge from 'components/badges/VerifiedBadge';

const Input = styled(InputBase)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  border: 'solid 2px #d1d5de',
  borderColor: theme.palette.mode === 'light' ? '#d1d5de' : '#404040',
  color: theme.palette.mode === 'light' ? '#000' : '#ddd',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
  height: '50px',
  padding: '8px 15px 8px 30px',

  '& .MuiInputBase-input': {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '12px',
    width: 'auto',
    padding: 0,
    // paddingLeft: '18px',
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
      borderColor: theme.palette.mode === 'light' ? '#d1d5de' : '#3f3f3f',
    },
  },
}));

const Paper = (props) => {
  return <StyledPaper {...props} />;
};

const Search = ({ collectionId, onSelect, setLoading }) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 400);

  const [options, setOptions] = useState([]);

  const handleChange = (event, newValue) => {
    if (newValue.group === 'Assets') {
      setValue(newValue);
      onSelect(newValue);
    }

    // if (newValue && newValue.group === 'Assets') {
    //   return (window.location.href = `/collections/${newValue.collectionId}/asset/${newValue.assetId}`);
    // }
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
    getCompareSearchOptions(collectionId, debouncedValue)
      .then((data) => {
        if (data && active) {
          const { assets } = data;

          if (assets.length === 0) {
            setLoading(false);
            return setOptions([
              {
                label: 'Search returned no results',
                group: 'Not found',
                key: 1,
              },
            ]);
          }

          const assetOptions = assets.map((el, i) => ({
            key: el.asset_id + i,
            label: el.name,
            assetId: el.asset_id,
            collectionId: el.collection_id,
            group: 'Assets',
            ...el,
          }));

          setOptions(assetOptions);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        return setOptions([
          { label: 'Search has errored', group: 'Query error', key: 1 },
        ]);
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
      getOptionLabel={(option) => option.label || value}
      groupBy={(option) => option.group}
      onChange={handleChange}
      filterOptions={(x) => x}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderOption={(props, option) => {
        return (
          <Box {...props} key={option.key}>
            <Typography>{option.label}</Typography>
            {option.verified && <VerifiedBadge verified width={20} />}
          </Box>
        );
      }}
      PaperComponent={Paper}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <Input
          placeholder="Search an asset to compare"
          // startAdornment={<SearchIcon />}
          ref={params.InputProps.ref}
          inputProps={{ ...params.inputProps }}
        />
      )}
    />
  );
};

export default Search;
