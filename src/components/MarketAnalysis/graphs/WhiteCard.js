import { Box } from '@mui/material';

const WhiteCard = ({ children, sx = {}, className = '' }) => {
  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: '6px',
        paddingTop: '0 !mportant',
        mx: 3,
        height: 300,
        p: 2,
        width: '100%',
        backgroundColor: 'var(--bgColor)',
        borderRadius: '10px',
        ...sx,
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

export default WhiteCard;
