import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const ActivityChart = dynamic(() => import('../graphs/ActivityChart'), {
  ssr: false,
});

const ActivityStats = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, []);

  return (
    <Box sx={{ flex: 4 }}>
      <ActivityChart />
    </Box>
  );
};

export default ActivityStats;
