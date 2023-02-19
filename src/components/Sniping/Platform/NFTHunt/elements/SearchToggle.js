import React from 'react';
import { Stack, Switch, Typography } from '@mui/material';
import { WithPermissions } from '../../../components/common';
import theme from '../../../components/layout/theme';
console.log(theme.palette.primary.main);

const SearchToggle = ({ searchType, setSearchType }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        pt: 1,
        pb: 1,
      }}
    >
      <Typography sx={{ fontFamily: 'newgilroymedium', fontWeight: 'bold' }}>
        Price
      </Typography>
      <WithPermissions requiredPermissions="apex">
        <Switch
          sx={{ color: theme.palette.primary.main }}
          inputProps={{ 'aria-label': 'ant design' }}
          onChange={() =>
            searchType === 'rarity'
              ? setSearchType('price')
              : setSearchType('rarity')
          }
          checked={searchType === 'rarity'}
        />
      </WithPermissions>
      <Typography sx={{ fontFamily: 'newgilroymedium', fontWeight: 'bold' }}>
        Rarity
      </Typography>
    </Stack>
  );
};

export default SearchToggle;
