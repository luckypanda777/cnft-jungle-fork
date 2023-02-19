import { useState } from 'react';
import Price from '../elements/Price';
import Search from '../elements/Search';
import { Box, Typography } from '@mui/material';
import { Collections, Serial, Check } from '../../common';
import { v4 } from 'uuid';
import { useSearch } from 'hooks//useSearch';
import CustomTooltip from 'components/common/CustomTooltip';

const PriceHunt = () => {
  const [price, setPrice] = useState('');
  const [collection, setCollection] = useState('');
  const [serial, setSerial] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { startBackgroundSearch } = useSearch();

  const handleDelay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const startSearch = () => {
    const search = {
      id: v4(),
      collectionId: collection.id,
      name: collection.name,
      search: collection.policies[0],
      policies: collection.policies,
      floor: price,
      type: 'price',
      timestamp: Date.now(),
      stop: false,
      specificName: serial,
      useRegex,
      quickSnipe: true,
    };
    console.log('Starting background price search..');
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
      <Collections
        setCollection={setCollection}
        setError={setError}
        sx={{ mt: 1 }}
      />
      <Serial
        serial={serial}
        setSerial={setSerial}
        setError={setError}
        label="Asset #, name, or regex (optional)"
      />
      {serial && (
        <CustomTooltip title="Use regular expression intead of a plain text">
          <Box>
            <Check
              title="Use regex"
              checked={useRegex}
              onChange={(checked) => setUseRegex(checked)}
            />
          </Box>
        </CustomTooltip>
      )}
      {error && (
        <Typography
          sx={{ my: 1, width: '100%' }}
          variant="h7"
          // color={theme.palette.primary.main}
        >
          {error}
        </Typography>
      )}
      <Price
        price={price}
        setPrice={setPrice}
        title={`Max Price in ADA${serial ? '(optional)' : ''}`}
        helperText="Enter price or asset details to start the hunt"
      />
      <Search
        disabled={!collection || (!price && !serial) || loading}
        startSearch={startSearch}
      />
    </Box>
  );
};

export default PriceHunt;
