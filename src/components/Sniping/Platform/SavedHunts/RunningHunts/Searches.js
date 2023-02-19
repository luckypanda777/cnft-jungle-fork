import React, { useContext, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import Huntlist from './HuntList';

const Searches = ({ isHistory = false, collection = false }) => {
  const {
    state: { walletInfo },
  } = useAppContext();
  const {
    state: { user },
  } = useContext(AuthContext);
  const {
    state: { huntList },
  } = useContext(SearchContext);

  const filterSearches = useMemo(() => {
    const display = huntList.filter((hunt) => hunt?.isHistory === isHistory);
    if (!collection) return display;

    console.log(display);

    return display.filter((search) => search.name === collection.name);
  }, [huntList, isHistory, collection]);

  if (!user || walletInfo.loading) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress sx={{ fontSize: 26, mt: 2 }} />
      </Box>
    );
  }

  if (user.blocked) {
    return <span>User blocked</span>;
  }

  return <Huntlist searches={filterSearches} isHistory={isHistory} />;
};

export default Searches;
