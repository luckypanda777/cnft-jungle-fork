import { ListItem, ListItemText } from '@mui/material';
import React from 'react';

const SearchTitle = ({ title }) => {
  return (
    <ListItem sx={{ textAlign: 'center' }}>
      <ListItemText
        sx={{ mb: 1 }}
        primary={title}
        primaryTypographyProps={{
          fontSize: 20,
          fontWeight: 'medium',
          letterSpacing: 0,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'newgilroymedium',
        }}
      />
    </ListItem>
  );
};

export default SearchTitle;
