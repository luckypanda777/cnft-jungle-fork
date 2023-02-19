import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';

const StatsTabControls = ({ tabs = [], setTab }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        columnGap: 1,
        mt: 1,
        justifyContent: 'flex-end',
      }}
    >
      {tabs.map((tab) => {
        return (
          <FilterButton
            // add small shadow
            sx={{
              fontSize: 12,
              border: 'none',
            }}
            value={tab === tab.value}
            onClick={() => setTab(tab.value)}
            pressable
            name={tab.value}
          >
            {tab.label}
          </FilterButton>
        );
      })}
    </Box>
  );
};

export default StatsTabControls;
