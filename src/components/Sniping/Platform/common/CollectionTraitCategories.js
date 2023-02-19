import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useContext, useEffect, useState } from 'react';
import { capitalize, CircularProgress, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as AuthContext } from 'context/AuthContext';
import axios from 'axios';
import { getExtensionTraitKeys } from 'apiProvider';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CollectionTraitCategories = ({
  setSelectedTraits,
  collectionId,
  sx = {},
}) => {
  const [open, setOpen] = useState(false);
  const [traits, setTraits] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const loading = open && traits.length === 0;
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const fetchedTraits = await fetchTraits();

      if (active) {
        setTraits(fetchedTraits);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setTraits([]);
    }
  }, [open]);

  const fetchTraits = async () => {
    try {
      const response = await getExtensionTraitKeys({
        id: collectionId,
      });

      if (!response.success || !response.traitKeys.length) {
        return [];
      }

      return response.traitKeys;
    } catch (err) {
      return showFeedback({
        kind: 'error',
        message: 'Error getting collection traits!',
        duration: 2000,
      });
    }
  };

  const handleSelectedTraits = async (newTraits) => {
    if (newTraits.length > 1 && user.snipeTier !== 'orca') {
      return showFeedback({
        kind: 'error',
        message: 'Your permissions can only select one trait!',
        duration: 2000,
      });
    }

    return setSelectedTraits(newTraits);
  };

  return (
    <Autocomplete
      disabled={!collectionId}
      id="collections"
      sx={{
        width: '100%',
        py: 1,
        '::-webkit-scrollbar': {
          width: '5px',
        },
        '::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 5px grey',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'var(--logoColor)',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'var(--logoColor)',
        },
        ...sx,
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option || 'unknown'}
      options={traits}
      loading={loading}
      freeSolo
      multiple
      onChange={(e, value) => handleSelectedTraits(value)}
      disableCloseOnSelect
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      targetOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      ListboxProps={{
        // POSITION FIXED FUCKED THE DROPDOWN WONT SHOW UP
        style: { maxHeight: 250 },
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {capitalize(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          autoFocus
          {...params}
          label={
            collectionId ? 'Select specific traits' : 'Select collection first'
          }
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
    />
  );
};

export default CollectionTraitCategories;
