import { useContext, useState } from 'react';
import { Context as AuthContext } from 'context/AuthContext';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as SearchContext } from 'context/SearchContext';
import { getCollectionFloors, getHuntList } from 'apiProvider';
import { useEffect } from 'react';
import { useAppContext } from 'context/AppContext';

const useSearch = (isHistory) => {
  const {
    state: { walletInfo },
  } = useAppContext();

  const {
    state: { user },
  } = useContext(AuthContext);

  const {
    setSearches,
    state: { huntList },
    addSearch,
    updateSearch,
  } = useContext(SearchContext);

  const [loadingHunts, setLoadingHunts] = useState(false);

  const getHunts = async (isHistory = false) => {
    setLoadingHunts(true);
    const hunts = await getHuntList({ isHistory });
    setSearches(hunts.huntList);
    setLoadingHunts(false);
  };

  const { showFeedback } = useContext(FeedbackContext);

  const startBackgroundSearch = async (search) => {
    let allowedSearches =
      25 + (permissions === 'yummi' ? 25 : 0) + (additionalSearches || 0);

    if (search.floor < 1 && search.type === 'price') {
      showFeedback({
        kind: 'error',
        message: 'Floor must be at least 1!',
        duration: 2000,
      });
    }

    if (search.type === 'harpoon') {
      const floors = await getCollectionFloors({
        policies: [search.policies],
      })
        .then((res) => res.floors || {})
        .catch((err) => {
          console.log(err);
          return {};
        });

      search.floor = floors[search.policies];
    }

    if (search.floor < 0 && search.type === 'rarity') {
      showFeedback({
        kind: 'error',
        message: 'Floor must be positive!',
        duration: 2000,
      });
    }

    if (searches.length + 1 > allowedSearches && permissions !== 'orca') {
      showFeedback({
        kind: 'warning',
        message: `Your tier allows only concurrent ${allowedSearches} searches+harpoons!`,
        duration: 3000,
      });
    } else {
      showFeedback({
        kind: 'success',
        message: 'Search has been queued!',
        duration: 1000,
      });
      return addSearch(search);
    }
  };

  const checkCurrentListings = async (search, options) => {
    const { initialSync, resumeAll } = options || {};

    if (search.stopped && !resumeAll) {
      return;
    }

    try {
      if (resumeAll) {
        search.error = '';
        return updateSearch(search, 'resume');
      }

      return updateSearch(search, 'edit');
    } catch (err) {
      console.log('SEARCH ERROR', search.name, err.message);
      search.error = err.message;

      return updateSearch(search, 'edit');
    }
  };

  const updateBackgroundSearch = async (search) => {
    showFeedback({
      kind: 'success',
      message: 'Hunt Updated!',
      duration: 1000,
    });
    return await checkCurrentListings({ ...search, stopped: false });
  };

  const restartAllHunts = async () => {
    let allowedSearches =
      10 + (permissions === 'yummi' ? 10 : 0) + (additionalSearches || 0);

    if (searches.length > allowedSearches && permissions !== 'orca') {
      return showFeedback({
        kind: 'warning',
        message: `Your tier allows only concurrent ${allowedSearches} searches+harpoons!`,
        duration: 3000,
      });
    }

    return await Promise.all(
      searches
        .filter((search) => search.stopped)
        .map((search) => checkCurrentListings(search, { resumeAll: true }))
    );
  };

  const stopAllHunts = async () => {
    return await Promise.all(
      searches
        .filter((search) => !search.stopped)
        .map((search) => updateSearch(search, 'stop'))
    );
  };

  useEffect(() => {
    if (user && walletInfo.address) {
      getHunts(isHistory);
    }
  }, [user, walletInfo.address, isHistory]);

  return {
    startBackgroundSearch,
    updateBackgroundSearch,
    checkCurrentListings,
    restartAllHunts,
    stopAllHunts,
    huntList,
    loadingHunts,
    getHunts,
  };
};

export { useSearch };
