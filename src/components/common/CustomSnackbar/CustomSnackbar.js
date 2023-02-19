import { styled, Snackbar } from '@mui/material';

const ToBeStylesSnackbar = ({ className, ...props }) => (
  <Snackbar {...props} classes={{ tooltip: className }} />
);
const StylesSnackbar = styled(ToBeStylesSnackbar)(({ theme }) => ({
  backgroundColor: 'var(--bgColor)',
  color: 'rgba(0, 0, 0, 0.87)',
  border: '1px solid #dadde9',
  fontFamily: 'newgilroymedium',
  fontSize: 16,
  borderRadius: 6,
}));

export default StylesSnackbar;
