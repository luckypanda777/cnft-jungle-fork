// import { setLocalData } from '../utils/storage';
import createDataContext from './createDataContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'set_auth_state_from_storage':
      if (!state.synced || state.syncTimestamp < Date.now()) {
        return {
          ...state,
          ...action.payload,
          synced: true,
          syncTimestamp: Date.now(),
        };
      }
      return state;
    case 'set_auth':
      return { ...state, ...action.payload };
    case 'set_allowance':
      return { ...state, allowance: action.payload };
    case 'block_user':
      return { ...state, blocked: true };
    default:
      return state;
  }
};

const initialState = {
  user: false,
  blocked: false,
  synced: false,
  allowance: {
    huntAmount: 0,
    autoBuyHuntAmount: 0,
  },
};

const setAuth = (dispatch) => (auth) => {
  console.log('SET AUTH', auth);

  dispatch({
    type: 'set_auth',
    payload: auth,
  });
};

const setAllowance = (dispatch) => (allowance) => {
  console.log('SET ALLOWANCE', allowance);

  dispatch({
    type: 'set_allowance',
    payload: allowance,
  });
};

const blockUser = (dispatch) => (user) => {
  dispatch({
    type: 'block_user',
    payload: user,
  });
};

const syncAuthContextFromStorage = (dispatch) => (cache) => {
  dispatch({
    type: 'set_auth_state_from_storage',
    payload: cache,
  });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    setAuth,
    setAllowance,
    blockUser,
    syncAuthContextFromStorage,
  },
  { ...initialState }
);
