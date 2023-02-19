import { useContext } from 'react';
import { getMode } from '../utils/getMode';
import createDataContext from './createDataContext';
import {
  SAVE_SETTINGS,
  SET_SETTINGS,
  SET_PROJECTS,
  SET_ASSETS,
  SET_THEME_MODE,
  SET_COLLECTION,
  SET_WALLET,
  SET_TOTAL,
  SET_STATS,
  SET_LOCAL_FILTERS,
  SET_WALLET_INFO,
  SET_CART,
  SET_LOADING_CART,
  SET_LISTING_CART,
  setSettings,
  saveSettings,
  setProjects,
  setAssets,
  setThemeMode,
  setCollection,
  setWallet,
  setTotal,
  setStats,
  setLocalFilters,
  setWalletInfo,
  setCart,
  setListingCart,
  setLoadingCart,
} from './actions';
import { getFromLocalStorage } from '../utils/isEmptyObject';

const initialState = {
  settings: {},
  projects: [],
  assets: [],
  theme: getMode(),
  collection: null,
  wallet: '',
  walletInfo: {
    name: '',
    stakeKey: '',
    address: '',
    loading: true,
    termsAccepted: false,
    watchlist: [],
    hideWatchlist: false,
    watchlistNames: [],
  },
  cart: [],
  listingCart: [],
  loadingCart: false,
  supporters: [],
  totalCollections: 0,
  stats: {},
  isMobile: false,
  localFilters: {
    showValuation:
      getFromLocalStorage('showValuation', 'string', false) !== 'no',
    showRanks: getFromLocalStorage('showRanks', 'string', false) !== 'no',
    display: getFromLocalStorage('display', 'string', 'small'),
    chartType: getFromLocalStorage('chartType', 'string', 'bar'),
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        settings: { ...action.payload },
      };

    case SAVE_SETTINGS:
      const syncSettingsState = {
        ...state,
        settings: action.payload,
      };
      return syncSettingsState;

    case SET_PROJECTS:
      return {
        ...state,
        projects: [...action.payload],
      };

    case SET_ASSETS:
      return {
        ...state,
        assets: [...action.payload],
      };

    case SET_THEME_MODE:
      return {
        ...state,
        theme: action.payload.theme,
      };

    case SET_COLLECTION:
      return {
        ...state,
        collection: { ...action.payload },
      };

    case SET_WALLET:
      return {
        ...state,
        wallet: action.payload,
      };

    case SET_WALLET_INFO:
      return {
        ...state,
        walletInfo: {
          ...state.walletInfo,
          ...action.payload,
        },
      };

    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case SET_LISTING_CART:
      return {
        ...state,
        listingCart: action.payload,
      };

    case SET_LOADING_CART:
      return {
        ...state,
        loadingCart: action.payload,
      };

    case SET_TOTAL:
      return {
        ...state,
        totalCollections: action.payload,
      };

    case SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };

    case SET_LOCAL_FILTERS: {
      return {
        ...state,
        localFilters: {
          ...state.localFilters,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export const { Provider, Context } = createDataContext(
  reducer,
  {
    setSettings,
    saveSettings,
    setProjects,
    setAssets,
    setThemeMode,
    setCollection,
    setWallet,
    setTotal,
    setStats,
    setLocalFilters,
    setWalletInfo,
    setCart,
    setLoadingCart,
    setListingCart,
  },
  { ...initialState }
);

export const useAppContext = () => useContext(Context);
