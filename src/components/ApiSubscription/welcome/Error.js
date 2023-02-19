import { Box } from '@mui/material';
import { useRouter } from 'next/router';

const PaymentError = ({ message }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
        alignItems: 'center',
      }}
    >
      <p>{message}</p>
      <Box sx={{ display: 'flex', columnGap: 1, justifyContent: 'center' }}>
        <Box
          sx={{
            p: '5px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: 'white',
            border: '1px solid var(--primaryColor)',
            color: 'var(--primaryColor)',
            '&:hover': {
              backgroundColor: 'var(--primaryColor)',
              border: '1px solid var(--primaryColor)',
              color: 'var(--whiteColor)',
            },
          }}
          onClick={() => router.push('/')}
        >
          Try again
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentError;
