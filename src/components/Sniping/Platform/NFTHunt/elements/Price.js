import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

const Price = ({ price, setPrice, title, width, helperText }) => {
  return (
    <FormControl
      sx={{
        width: '100%',
        flex: 1,
        mt: 2,
        fontFamily: 'newgilroymedium',
      }}
    >
      <InputLabel htmlFor="outlined-adornment-amount">{title}</InputLabel>
      <OutlinedInput
        type="tel"
        id="outlined-adornment-amount"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        label={title}
      />
      <FormHelperText id="standard-weight-helper-text">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};
export default Price;
