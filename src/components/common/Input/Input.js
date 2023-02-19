import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Input = styled(InputBase)(({ theme }) => ({
  width: '100%',

  '&.MuiInputBase-multiline': {
    padding: 0,
  },

  '&.Mui-error': {
    '& .MuiInputBase-input': {
      borderColor: 'var(--errorColor)',
    },
  },

  '& .MuiInputBase-input': {
    borderRadius: '10px',
    border: 'solid 2px #d1d5de',
    borderColor: 'var(--inputBorder)',
    position: 'relative',
    color: 'var(--inputColor)',
    backgroundColor: 'var(--inputBg)',
    fontSize: 12,
    fontWeight: 700,
    height: 'unset',
    lineHeight: '12px',
    padding: '8px 15px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),

    '&:focus': {
      borderRadius: 10,
      borderColor: 'var(--primaryColor)',
    },
  },
}));

export default Input;
