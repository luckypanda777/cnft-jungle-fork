import { Box } from '@mui/system';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';
import { middlen } from 'utils/shorten';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';

const Wallets = ({ setValueModalType }) => {
  return (
    <Box style={{ flex: 1 }}>
      <FilterButton
        pressable
        onClick={() => setValueModalType('portfolio')}
        style={{ width: '100%', marginBottom: 10 }}
      >
        Add Wallet
      </FilterButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
        {[1, 2, 3].map((i) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {middlen(
                'addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z',
                10
              )}
            </span>
            <CloseIcon sx={{ fontSize: 16, cursor: 'pointer' }} />
          </Box>
        ))}
        <Divider />3 Wallets
      </Box>
    </Box>
  );
};

export default Wallets;
