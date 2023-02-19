import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { default as MuiButton } from '@mui/material/Button';

const Button = styled(MuiButton)(() => ({
    color: 'var(--acceptBtnColor)',
    backgroundColor: '#000',
    borderRadius: 10,
    textTransform: 'capitalize',
    fontSize: '12px',
    minWidth: '110px',
    padding: '7px 34px',
    '&:hover': {
      backgroundColor: grey[700],
    },
}));

export default Button;