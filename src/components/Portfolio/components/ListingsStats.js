import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';

const ListingsChart = dynamic(() => import('../graphs/ListingsChart'), {
  ssr: false,
});

const ListingsStats = () => {
  return (
    <Box sx={{ flex: 4 }}>
      <ListingsChart />
    </Box>
  );
};

export default ListingsStats;
