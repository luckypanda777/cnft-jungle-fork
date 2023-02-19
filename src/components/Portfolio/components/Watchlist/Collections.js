import { Box } from '@mui/system';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';
import { middlen } from 'utils/shorten';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import { SearchBox } from 'components/boxes/BookmarkBoxes';

const Collections = ({ isMyPortfolio, setValueModalType, isPrivate }) => {
  return (
    <Box style={{ flex: 1 }}>
      {isMyPortfolio && (
        <FilterButton
          pressable
          onClick={() => setValueModalType('collection')}
          style={{ width: '100%', marginBottom: 10 }}
        >
          Add Collection
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
            isPrivate={isPrivate}
          />
        ))}
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{isPrivate ? '********' : `Collection Name ${i}`}</span>
            {isMyPortfolio && (
              <CloseIcon sx={{ fontSize: 16, cursor: 'pointer' }} />
            )}
          </Box> */}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ textAlign: 'right' }}>3 Collections</Box>
      </Box>
    </Box>
  );
};

export default Collections;
