import { Checkbox, ListItem, ListItemText } from '@mui/material';
import React from 'react';

const Check = ({ title, checked, onChange, disabled, sx }) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        width: '250px',
        p: 0,
        ...sx,
      }}
    >
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          fontSize: 16,
          fontWeight: 'medium',
          letterSpacing: 0,
          color: 'var(--fontColor)',
          fontFamily: 'newgilroymedium',
          px: 0,
        }}
      />
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        sx={{ padding: '8px' }}
      />
    </ListItem>
  );
};

export default Check;
