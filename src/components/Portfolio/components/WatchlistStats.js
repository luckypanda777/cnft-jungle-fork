import Addresses from './Watchlist/Addresses';
import Nfts from './Watchlist/Nfts';
import Collections from './Watchlist/Collections';
import { Box } from '@mui/material';
import { VerticalDivider } from '../layout/Performance';
import { useEffect, useState } from 'react';
import { WatchlistStatsSkeleton } from './LoadingSkeletons';
import { useAppContext } from 'context/AppContext';

const WatchlistStats = ({ setValueModalType, isMyPortfolio, address }) => {
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!address) return;

    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, [address]);

  if (loading) {
    return <WatchlistStatsSkeleton />;
  }

  return (
    <Box sx={{ flex: 4, display: 'flex' }}>
      <Collections
        isMyPortfolio={isMyPortfolio}
        setValueModalType={setValueModalType}
        isPrivate={isPrivate}
      />
      <VerticalDivider />
      <Addresses
        isMyPortfolio={isMyPortfolio}
        setValueModalType={setValueModalType}
        isPrivate={isPrivate}
      />
      <VerticalDivider />
      <Nfts
        isMyPortfolio={isMyPortfolio}
        setValueModalType={setValueModalType}
        isPrivate={isPrivate}
      />
    </Box>
  );
};

export default WatchlistStats;
