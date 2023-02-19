import { Box } from '@mui/material';
import NotFoundCat from 'components/layout/NotFound';

function NotFound() {
  return (
    <Box className="notFoundMain">
      <NotFoundCat title="Page not found" />
    </Box>
  );
}

export default NotFound;
