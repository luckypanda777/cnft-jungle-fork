import React, { useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Context as FeedbackContext } from '../../../context/FeedbackContext';

const GlobalFeedback = () => {
  const {
    state: { open, duration, kind, message },
    hideFeedback,
  } = useContext(FeedbackContext);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      severity={kind || 'success'}
      style={{
        position: 'fixed',
        bottom: 100,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      onClose={hideFeedback}
    >
      <Alert
        severity={kind || 'success'}
        sx={{
          width: '350px',
          fontFamily: 'newgilroysemibold',
          fontSize: 16,
        }}
        onClose={hideFeedback}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalFeedback;
