import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

const Serial = ({
  serial,
  setSerial,
  setError,
  label = 'Asset number',
  helperText,
}) => {
  return (
    <FormControl
      sx={{
        width: '100%',
        flex: 1,
        mt: 2,
        fontFamily: 'newgilroymedium',
      }}
    >
      <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
      <OutlinedInput
        onFocus={() => setError('')}
        id="outlined-adornment-amount"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        label={label}
      />
      <FormHelperText id="standard-weight-helper-text">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};
export default Serial;
