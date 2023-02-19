import { Button } from '@mui/material';

const Search = ({ disabled, startSearch }) => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={startSearch}
      sx={{
        width: '100%',
        minWidth: 500,
        mt: 2,
        fontFamily: 'newgilroymedium',
      }}
      disabled={disabled}
    >
      Start Hunt
    </Button>
  );
};

export default Search;
