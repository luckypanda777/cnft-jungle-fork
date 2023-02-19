import { Box } from '@mui/system';
import React from 'react';

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
          background: 'var(--severeOvervaluedColor)',
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: '12px',
        }}
      >
        <span>Coming soon</span>
      </div>
      {children}
    </Box>
  );
};

export default ComingSoon;
