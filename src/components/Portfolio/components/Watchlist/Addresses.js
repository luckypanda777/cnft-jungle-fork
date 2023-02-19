import { Box } from '@mui/system';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';
import { middlen } from 'utils/shorten';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import { SearchBox } from 'components/boxes/BookmarkBoxes';

const Addresses = ({ isMyPortfolio, setValueModalType, isPrivate }) => {
  return (
    <Box style={{ flex: 1 }}>
      {isMyPortfolio && (
        <FilterButton
          pressable
          onClick={() => setValueModalType('wallet')}
          style={{ width: '100%', marginBottom: 10 }}
        >
          Add Address
        </FilterButton>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5 }}>
        {[1, 2, 3].map((i) => (
          <SearchBox
            option={{
              image:
                'https://storage.googleapis.com/jpg-store-images/hero-images/spacebudz.webp',
              label: 'Spacebudz',
              verified: true,
              bookmarked: false,
            }}
            border
            type="wallet"
            isPrivate={isPrivate}
          />
        ))}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ textAlign: 'right' }}>3 Addresses</Box>
      </Box>
    </Box>
  );
};

export default Addresses;
