import { Box } from '@mui/material';
import React from 'react';

const Examples = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <iframe
        src="https://developers.cnftjungle.app/redoc"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </Box>
  );
};

export default Examples;
