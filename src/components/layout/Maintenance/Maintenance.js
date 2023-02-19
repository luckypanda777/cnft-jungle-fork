import { Box } from '@mui/material';
import NotFoundCat from 'components/layout/NotFound';

function Maintenance() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        flex: 'auto',
        backgroundColor: 'var(--assetsBg)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <NotFoundCat title="Jungle is on maintenance we will resume operations shortly. Blame the cat." />
    </Box>
  );
}

export default Maintenance;
