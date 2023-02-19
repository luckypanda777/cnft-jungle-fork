export const SET_SETTINGS = 'SET_SETTINGS';
export const setSettings = (dispatch) => (settings) => {
  dispatch({
    type: SET_SETTINGS,
    payload: settings,
  });
};

export const SAVE_SETTINGS = 'SAVE_SETTINGS';
export const saveSettings = (dispatch) => (settings) => {
  dispatch({
    type: SAVE_SETTINGS,
    payload: settings,
  });
};

export const SET_PROJECTS = 'SET_PROJECTS';
export const setProjects = (dispatch) => (data) => {
  dispatch({
    type: SET_PROJECTS,
    payload: data,
  });
};

export const SET_ASSETS = 'SET_ASSETS';
export const setAssets = (dispatch) => (assets) => {
  dispatch({
    type: SET_ASSETS,
    payload: assets,
  });
};

export const SET_THEME_MODE = 'SET_THEME_MODE';
export const setThemeMode = (dispatch) => (theme) => {
  dispatch({
    type: SET_THEME_MODE,
    payload: { theme },
  });
};

export const SET_COLLECTION = 'SET_COLLECTION';
export const setCollection = (dispatch) => (collection) => {
  dispatch({
    type: SET_COLLECTION,
    payload: { ...collection },
  });
};

export const SET_WALLET = 'SET_WALLET';
export const setWallet = (dispatch) => (wallet) => {
  dispatch({
    type: SET_WALLET,
    payload: wallet,
  });
};

export const SET_CART = 'SET_CART';
export const setCart = (dispatch) => (cart) => {
  dispatch({
    type: SET_CART,
    payload: cart,
  });
};

export const SET_LISTING_CART = 'SET_LISTING_CART';
export const setListingCart = (dispatch) => (listingCart) => {
  dispatch({
    type: SET_LISTING_CART,
    payload: listingCart,
  });
};

export const SET_LOADING_CART = 'SET_LOADING_CART';
export const setLoadingCart = (dispatch) => (loading) => {
  dispatch({
    type: SET_LOADING_CART,
    payload: loading,
  });
};

export const SET_WALLET_INFO = 'SET_WALLET_INFO';
export const setWalletInfo = (dispatch) => (walletInfo) => {
  dispatch({
    type: SET_WALLET_INFO,
    payload: walletInfo,
  });
};

export const SET_TOTAL = 'SET_TOTAL';
export const setTotal = (dispatch) => (total) => {
  dispatch({
    type: SET_TOTAL,
    payload: total,
  });
};

export const SET_STATS = 'SET_STATS';
export const setStats = (dispatch) => (stats) => {
  dispatch({
    type: SET_STATS,
    payload: stats,
  });
};

export const SET_LOCAL_FILTERS = 'SET_LOCAL_FILTERS';
export const setLocalFilters = (dispatch) => (filter) => {
  dispatch({
    type: SET_LOCAL_FILTERS,
    payload: { ...filter },
  });
};
