import { Checkbox, ListItem, ListItemText } from '@mui/material';
import React from 'react';

const Verified = ({ verified, setVerified }) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        width: '300px',
        px: 0,
        pt: 1,
      }}
    >
      <ListItemText
        primary="Search only verified"
        primaryTypographyProps={{
          fontSize: 16,
          fontWeight: 'medium',
          letterSpacing: 0,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'newgilroymedium',
          px: 0,
        }}
      />
      <Checkbox
        checked={verified}
        onChange={(e) => setVerified(e.target.checked)}
      />
    </ListItem>
  );
};

export default Verified;
