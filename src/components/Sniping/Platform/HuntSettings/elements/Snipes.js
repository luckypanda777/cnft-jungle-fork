import React from 'react';
import ListItem from '@mui/material/ListItem';
import { Divider } from '@mui/material';
import SnipeInfo from './SnipeInfo';
import { useTheme } from '@mui/system';
import { isMobile } from 'react-device-detect';

const Snipe = ({ snipe, isLast }) => {
  const theme = useTheme();

  if (!snipe) return null;

  return (
    <>
      <ListItem
        key={snipe.name}
        sx={{
          color: 'whitesmoke',
          display: 'flex',
          alignItems: 'center',
          my: 0.5,
          px: isMobile ? 0.5 : 2,
        }}
      >
        <SnipeInfo snipe={snipe} />
      </ListItem>
      {!isLast && (
        <Divider
          sx={{
            width: '95%',
            mx: 'auto',
            mt: 0,
          }}
          color={theme.palette.primary.main}
        />
      )}
    </>
  );
};

export default Snipe;
