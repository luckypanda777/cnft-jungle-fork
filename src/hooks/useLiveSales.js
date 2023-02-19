import { ReconnectingEventSource } from 'components/LiveListings/ReconnectingEventSource';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './useAuth';

const FEED_URL = 'https://feed.cnftjungle.app/sales';

// 'https://feed.cnftjungle.app'
// 'http://108.61.89.133/stream'

const useLiveSales = (policyId, connect, onEvent) => {
  const { user, loading } = useAuth();
  const [feedConnected, setFeedConnected] = useState(false);
  const sourceRef = useRef();

  const startFeedListener = useCallback(
    (permissions) => {
      const eventCallback = async (e) => {
        if (!feedConnected) setFeedConnected(true);

        if (!e.data) return;

        const sale = JSON.parse(e.data);
        const { asset, marketplace, link } = sale;

        // console.log('NEW SALE', sale);

        if (!asset) return;

        if (process.env.NODE_ENV !== 'production') {
          // console.log(
          //   permissions,
          //   asset.policyID === policyId ? 'THIS COLLECTION' : '',
          //   asset.assetID,
          //   listing
          // );
        }

        // [NOTE] UNCOMMENT
        if (asset.policyID === policyId) {
          setTimeout(() => {
            onEvent({ ...asset, link });
          }, (user.snipeTier === 'orca' ? 0 : user.snipeTier === 'apex' ? 3 : user.snipeTier === 'yummi' ? 3 : user.snipeTier === 'hunter' ? 5 : 7) * 1000);
        }
        // onEvent(asset);
      };
      if (connect) {
        // open new source
        if (sourceRef.current) {
          sourceRef.current?.readyState === 0;
          sourceRef.current.removeEventListener('sale', eventCallback);
          sourceRef.current.close();
          sourceRef.current = null;
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('sale', eventCallback);
        } else {
          sourceRef.current = new ReconnectingEventSource(FEED_URL);
          sourceRef.current.addEventListener('sale', eventCallback);
        }
      }
    },
    [policyId, user?.snipeTier]
  );

  useEffect(() => {
    startFeedListener(user.snipeTier);
  }, [policyId, user?.snipeTier]);

  const connected = useMemo(() => {
    return sourceRef.current?.readyState === 1 || feedConnected;
  }, [user?.snipeTier, policyId, sourceRef.current?.readyState, feedConnected]);

  return connected;
};

export { useLiveSales };
