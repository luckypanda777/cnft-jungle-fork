import { Box } from '@mui/system';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import { SearchBox } from 'components/boxes/BookmarkBoxes';

const Nfts = ({ isMyPortfolio, setValueModalType, isPrivate }) => {
  return (
    <Box style={{ flex: 1 }}>
      {isMyPortfolio && (
        <FilterButton
          pressable
          onClick={() => setValueModalType('asset')}
          style={{ width: '100%', marginBottom: 10 }}
        >
          Add Nft
        </FilterButton>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5 }}>
        {[1, 2, 3].map((i) => (
          <SearchBox
            option={{
              image:
                'https://image-optimizer.jpgstoreapis.com/Qmbc3UNzXdCTt5tS7ZE1BMUmaaaopD9egtntX6egXuSsAj?width=1200',
              label: 'Chill Kong',
              verified: true,
              bookmarked: false,
            }}
            border
            type="asset"
            isPrivate={isPrivate}
          />
        ))}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ textAlign: 'right' }}>3 Nfts</Box>
      </Box>
    </Box>
  );
};

export default Nfts;
