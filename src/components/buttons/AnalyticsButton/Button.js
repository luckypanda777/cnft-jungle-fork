import { styled } from '@mui/material/styles';
import { default as MuiButton } from '@mui/material/Button';

const Button = styled(MuiButton)(({ theme }) => ({
  fontFamily: 'newgilroybold',
  textTransform: 'uppercase',
  padding: '18px 26px',
  borderRadius: '10px',
  boxShadow: '0 9px 15px -5px rgb(94 111 239 / 50%)',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1e1e1e',
  color: theme.palette.mode === 'light' ? '#000' : '#fff',
  fontSize: '12px',
  letterSpacing: '1.44px',

  '&:hover': {
    color: '#fff',
  },

  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    borderRadius: 'inherit',
    margin: '-2px',
    background: 'linear-gradient(258deg, #3b81fe, #875add)',
  },
  '@media (min-width: 320px) and (max-width: 600px)': {
    border: '2px solid #3b81fe !important',
  },
}));

export default Button;
