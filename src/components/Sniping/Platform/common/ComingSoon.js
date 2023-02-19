import { Box } from '@mui/system';
import React from 'react';
import ComingSoonCard from './ComingSoonCard';

const ComingSoon = ({ available, children }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          fontSize: 20,
          color: 'white',
          transform: 'translate(-50%,-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'red',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: '12px',
        }}
      >
        <ComingSoonCard available={available} />
      </div>
      {children}
    </Box>
  );
};

export default ComingSoon;
