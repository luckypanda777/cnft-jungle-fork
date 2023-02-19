import { Box } from '@mui/system';
import { useContext, useEffect } from 'react';
import { Context as SearchContext } from 'context/SearchContext';
import { useAuth } from 'hooks/useAuth';
import { CircularProgress } from '@mui/material';
import LiveHunts from './LiveHunts';
import { useSearch } from 'hooks/useSearch';

const LiveHunting = () => {
  const { loading } = useAuth();
  const { loadingHunts, getHunts } = useSearch();
  const {
    state: { huntList },
  } = useContext(SearchContext);

  useEffect(() => {
    getHunts();
  }, []);

  if (loading || loadingHunts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ fontSize: 26 }} />
        </Box>
      </Box>
    );
  }

  if (huntList?.filter((s) => !s.iStopped).length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', fontSize: 18 }}>
        No live hunts
      </Box>
    );
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 5,
      }}
    >
      <LiveHunts />
    </Box>
  );
};

export default LiveHunting;
