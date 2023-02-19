import { ReconnectingEventSource } from 'components/LiveListings/ReconnectingEventSource';
import { useAppContext } from 'context/AppContext';
import { useAuth } from 'hooks/useAuth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FEED_URL = 'https://feed.cnftjungle.app/stream';

// 'https://feed.cnftjungle.app'
// 'http://108.61.89.133/stream'

const useWatchlistListings = (connect, onEvent) => {
  const { user, loading } = useAuth();
  const [feedConnected, setFeedConnected] = useState(false);
  const sourceRef = useRef();

  const startFeedListener = useCallback(
    (permissions) => {
      const eventCallback = async (e) => {
        if (!feedConnected) setFeedConnected(true);

        if (!e.data) return;

        const listing = JSON.parse(e.data);
        const { asset, marketplace, link } = listing;

        if (!asset) return;

        if (process.env.NODE_ENV !== 'production') {
          // console.log(permissions, asset.assetID, listing);
        }

        if (
          user.watchlist?.find(({ kind, identifier }) => {
            return (
              (kind === 'collection' && identifier === asset.policyID) ||
              (kind === 'asset' && identifier === asset.assetID)
            );
          })
        ) {
          setTimeout(() => {
            onEvent({ ...asset, link, listing_price: asset.price / 1000000 });
          }, (permissions === 'orca' ? 0 : permissions === 'apex' ? 3 : permissions === 'yummi' ? 3 : permissions === 'hunter' ? 5 : 7) * 1000);
        }
        // onEvent(asset);
      };
      if (connect) {
        // open new source
        if (sourceRef.current) {
          sourceRef.current?.readyState === 0;
          sourceRef.current.removeEventListener('trait', eventCallback);
          sourceRef.current.close();
          sourceRef.current = null;
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('trait', eventCallback);
        } else {
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('trait', eventCallback);
        }
      }
    },
    [user?.watchlist, user?.snipeTier]
  );

  useEffect(() => {
    startFeedListener(user.snipeTier);
  }, [user?.watchlist, user?.snipeTier]);

  const connected = useMemo(() => {
    return sourceRef.current?.readyState === 1 || feedConnected;
  }, [
    user?.snipeTier,
    user?.watchlist,
    sourceRef.current?.readyState,
    feedConnected,
  ]);

  return connected;
};

export { useWatchlistListings };
