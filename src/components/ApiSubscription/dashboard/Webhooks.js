import { Box } from '@mui/material';
import Input from 'components/common/Input';
import { useState } from 'react';

const types = [
  { name: 'New Listing', label: 'listing' },
  { name: 'New Sale', label: 'sale' },
  { name: 'New Bid', label: 'bid' },
  { name: 'New Offer', label: 'offer' },
  { name: 'New Transfer', label: 'transfer' },
  { name: 'New Loan', label: 'loan' },
  { name: 'New Mint', label: 'mint' },
];

const Webhooks = () => {
  const [webhooks, setWebhooks] = useState([]);

  const handleSaveWebhooks = () => {};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
        maxWidth: 600,
        justifyContent: 'flex-start',
      }}
    >
      {types.map((type) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Box>{type.name} Webhook</Box>
            <Box sx={{ display: 'flex', columnGap: 1 }}>
              <Input
                sx={{ width: 400 }}
                placeholder={`${type.name} webhook url`}
                name={type.label}
              />
            </Box>
          </Box>
        );
      })}

      <Box sx={{ display: 'flex', columnGap: 1, justifyContent: 'flex-start' }}>
        <Box
          sx={{
            p: '5px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: 'white',
            border: '1px solid var(--primaryColor)',
            color: 'var(--primaryColor)',
            '&:hover': {
              backgroundColor: 'var(--primaryColor)',
              border: '1px solid var(--primaryColor)',
              color: 'var(--whiteColor)',
            },
          }}
          onClick={handleSaveWebhooks}
        >
          Save
        </Box>
      </Box>
    </Box>
  );
};

export default Webhooks;
