import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import React from 'react';
import { PORTFOLIO_TABS } from './tabs';
import { useAppContext } from 'context/AppContext';

const Controls = ({ tab, handleTab }) => {
  const {
    state: { isMobile },
  } = useAppContext();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'justify-content',
        alignItems: 'center',
        width: '100%',
        pt: 3,
        pb: !tab.hideFilters ? 3 : 0,
        px: 3,
        height: 20,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          columnGap: 2,
          flex: 1,
        }}
      >
        {PORTFOLIO_TABS.map((info) => {
          if (info.desktopOnly && isMobile) return null;

          return (
            <Box>
              <span
                style={{
                  color:
                    tab.number === info.number
                      ? 'var(--logoColor)'
                      : 'var(--fontColor)',
                  textDecoration: tab.number === info.number && 'underline',
                  textDecorationColor:
                    tab.number === info.number
                      ? 'var(--logoColor)'
                      : 'var(--fontColor)',
                  cursor: 'pointer',
                }}
                onClick={() => handleTab(info)}
              >
                {info.name}
              </span>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          color: 'var(--primaryColor)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationColor: 'var(--primaryColor)',
        }}
      >
        Go to Tax Center
      </Box>
    </Box>
  );
};

export default Controls;
