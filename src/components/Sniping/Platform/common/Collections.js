import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { getCollections, getExtensionCollections } from 'apiProvider';

const Collections = ({ setCollection, setError }) => {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const loading = open && collections.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const fetchedCollections = await fetchCollections(); // For demo purposes.

      if (active) {
        setCollections([...fetchedCollections]);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setCollections([]);
    }
  }, [open]);

  const fetchCollections = async () => {
    try {
      const response = await getExtensionCollections();

      if (!response.success || !response.collections.length) {
        setError('Error loading from opencnft.');
        return [];
      }

      // remove duplicates
      const unique = response.collections.filter(
        (v, i, a) => a.findIndex((t) => t.name === v.name) === i
      );

      return unique;
    } catch (err) {
      setError(
        'Something went wrong. Please contact support if the problem persists.'
      );
      console.log('FETCH COLLECTIONS ERORR', err);
      return [];
    }
  };

  return (
    <Autocomplete
      id="collections"
      sx={{ width: '100%', mt: 1 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) =>
        option.name || option.policies[0] || 'unknown'
      }
      options={collections}
      loading={loading}
      onInputChange={(e) =>
        setCollection({
          name: e.target.value,
          policies: e.target.value,
        })
      }
      freeSolo
      renderInput={(params) => (
        <TextField
          autoFocus
          key={params.inputProps.value}
          onFocus={() => setError('')}
          {...params}
          label="Select collection"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onChange={(_, value) => setCollection(value)}
    />
  );
};

export default Collections;
