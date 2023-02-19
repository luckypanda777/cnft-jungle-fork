/* global chrome */
import createDataContext from './createDataContext';
import {
  createHunt,
  updateHunt,
  deleteHunt,
  updateAllHunts,
} from 'apiProvider';

const searchReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'add_live_hunt':
      return {
        ...state,
        liveHunts: [action.payload, ...state.liveHunts].slice(0, 100),
      };

    case 'set_hunt_list':
      sendToExtension(action.payload);

      return {
        ...state,
        huntList: action.payload,
      };

    case 'set_editing_hunt':
      return {
        ...state,
        editingHunt: action.payload.hunt,
        editType: action.payload.editType,
      };

    case 'set_selected_huntlist':
      return {
        ...state,
        selectedHuntlist: action.payload,
      };

    case 'set_selected_multiedit':
      return {
        ...state,
        selectedMultiEdit: action.payload,
      };

    case 'select_all':
      return {
        ...state,
        selectedMultiEdit: state.huntList
          .filter((hunt, index) => {
            const collection = hunt.rules.find(
              (rule) => rule.label === 'collection'
            );

            const filter = action.payload.toLowerCase();

            return (
              hunt.label?.toLowerCase().includes(filter) ||
              collection.value.name.toLowerCase().includes(filter) ||
              index == filter
            );
          })
          .filter((hunt) =>
            state.selectedHuntlist
              ? hunt.huntlistName === state.selectedHuntlist
              : true
          )
          .map((hunt) => hunt._id),
      };

    case 'deselect_all':
      return {
        ...state,
        selectedMultiEdit: [],
      };

    case 'stop_all':
      const syncStopAllState = formatStopAllHunts(state, action);

      sendToExtension(syncStopAllState.huntList);
      return syncStopAllState;

    case 'start_all':
      const syncStartAllState = formatStartAllHunts(state, action);

      sendToExtension(syncStartAllState.huntList);
      return syncStartAllState;

    case 'add_search':
      const syncAddSearchState = formatAddSearchState(state, action);

      sendToExtension(syncAddSearchState.huntList);
      return syncAddSearchState;

    case 'update_search':
      const syncUpdateSearchState = formatUpdateSearch(state, action);

      sendToExtension(syncUpdateSearchState.huntList);
      return syncUpdateSearchState;

    case 'edit_search':
      const syncEditSearchState = formatEditSearch(state, action);

      sendToExtension(syncEditSearchState.huntList);
      return syncEditSearchState;

    case 'remove_search':
      const syncRemoveSearchState = formatRemoveSearchState(state, action);

      sendToExtension(syncRemoveSearchState.huntList);
      return syncRemoveSearchState;

    default:
      return state;
  }
};

const initialState = {
  huntList: [],
  liveHunts: [],
  editingHunt: null,
  editType: '',
  selectedHuntlist: '',
  selectedMultiEdit: [],
};

const formatAddSearchState = (state, action) => {
  return {
    ...state,
    huntList: [action.payload, ...state.huntList],
  };
};

const formatStopAllHunts = (state, action) => {
  return {
    ...state,
    huntList: state.huntList.map((hunt) => ({
      ...hunt,
      isStopped: true,
    })),
  };
};

const formatStartAllHunts = (state, action) => {
  return {
    ...state,
    huntList: state.huntList.map((hunt) => ({
      ...hunt,
      isStopped: false,
    })),
  };
};

const formatUpdateSearch = (state, action) => {
  return {
    ...state,
    huntList: state.huntList.map((search) => {
      if (search._id === action.payload._id) {
        return action.payload;
      }
      return search;
    }),
  };
};

const formatEditSearch = (state, action) => {
  return {
    ...state,
    huntList: state.huntList.map((search) => {
      if (search._id === action.payload._id) {
        return action.payload;
      }
      return search;
    }),
  };
};

const formatRemoveSearchState = (state, action) => {
  const huntList = state.huntList.filter(
    (search) => search._id !== action.payload._id
  );

  return {
    ...state,
    huntList,
  };
};

const addSearch = (dispatch) => async (search, sync) => {
  dispatch({
    type: 'add_search',
    payload: search,
  });

  return await createHunt(search);
};

const setEditingHunt =
  (dispatch) =>
  ({ hunt, editType }) => {
    dispatch({
      type: 'set_editing_hunt',
      payload: { hunt, editType },
    });
  };

const clearEditingHunt = (dispatch) => () => {
  dispatch({
    type: 'set_editing_hunt',
    payload: { hunt: null, editType: '' },
  });
};

const setSelectedHuntlist = (dispatch) => (selected) => {
  dispatch({
    type: 'set_selected_huntlist',
    payload: selected,
  });
};

const setSelectedMultiEdit = (dispatch) => (selected) => {
  dispatch({
    type: 'set_selected_multiedit',
    payload: selected,
  });
};

const updateSearch = (dispatch) => async (search, type) => {
  if (type === 'stop') {
    search.isStopped = true;

    dispatch({
      type: 'update_search',
      payload: search,
    });
  }

  if (type === 'resume') {
    search.isStopped = false;

    dispatch({
      type: 'update_search',
      payload: search,
    });
  }

  if (type === 'edit') {
    dispatch({
      type: 'edit_search',
      payload: search,
    });
  }

  return await updateHunt(search._id, search);
};

const removeSearch = (dispatch) => async (search, sync) => {
  dispatch({
    type: 'remove_search',
    payload: search,
  });

  return await deleteHunt(search._id, { type: 'delete' });
};

const stopAllHunts = (dispatch) => async () => {
  dispatch({ type: 'stop_all' });

  return await updateAllHunts({ type: 'stop' });
};

const startAllhunts = (dispatch) => async () => {
  dispatch({ type: 'start_all' });

  return await updateAllHunts({ type: 'start' });
};

const selectAllHunts = (dispatch) => (searchWord) => {
  dispatch({ type: 'select_all', payload: searchWord });
};

const deselectAllHunts = (dispatch) => () => {
  dispatch({ type: 'deselect_all' });
};

const setSearches = (dispatch) => (huntList) => {
  console.log('SET HUNTLIST', huntList);

  dispatch({
    type: 'set_hunt_list',
    payload: huntList,
  });
};

const addLiveHunt = (dispatch) => (hunt) => {
  console.log('ADD HUNT', hunt);

  dispatch({
    type: 'add_live_hunt',
    payload: hunt,
  });
};

const sendToExtension = (huntList) => {
  if (
    process.env.NODE_ENV === 'development' ||
    window.location.hostname === 'localhost'
  ) {
    return;
  }

  chrome.runtime?.sendMessage(
    // jlajkhhjgghiidlfgpkhhjbgbfkmklio <- production
    // onmieokgdenmhjijkcfmgnnlngdflmik <- staging
    process.env.NEXT_PUBLIC_EXTENSION_ID,
    {
      type: 'SET_EXTENSION_HUNT_LIST',
      huntList: huntList.filter((hunt) => !hunt?.isHistory),
    },
    (response) => {
      console.log('UPDATED EXTENSION', response?.success);
    }
  );

  chrome.runtime?.sendMessage(
    // jlajkhhjgghiidlfgpkhhjbgbfkmklio <- production
    // onmieokgdenmhjijkcfmgnnlngdflmik <- staging
    // kcnhpaolckjglfacokompmchalkdihil <- wennowallet
    process.env.NEXT_PUBLIC_SNIPE_WALLET_EXTENSION_ID,
    {
      type: 'SET_EXTENSION_HUNT_LIST',
      huntList: huntList.filter((hunt) => !hunt?.isHistory),
    },
    (response) => {
      console.log('UPDATED EXTENSION', response?.success);
    }
  );
};

export const { Provider, Context } = createDataContext(
  searchReducer,
  {
    addSearch,
    updateSearch,
    removeSearch,
    setSearches,
    setEditingHunt,
    clearEditingHunt,
    stopAllHunts,
    startAllhunts,
    setSelectedHuntlist,
    addLiveHunt,
    setSelectedMultiEdit,
    selectAllHunts,
    deselectAllHunts,
  },
  { ...initialState }
);
