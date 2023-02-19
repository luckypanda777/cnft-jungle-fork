import { FormControl, InputLabel, OutlinedInput } from '@mui/material';

const FloorThreshold = ({
  floorThreshold,
  setFloorThreshold,
  setError,
  label = 'Floor threshold %',
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
        value={floorThreshold}
        onChange={(e) => setFloorThreshold(e.target.value)}
        label={label}
      />
    </FormControl>
  );
};
export default FloorThreshold;
