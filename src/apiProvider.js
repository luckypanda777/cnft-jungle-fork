import axios from 'axios';
import { API_URL, HEROKU_URL } from './config';
// deploy
const Request = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 120000,
});

async function get(url, params = {}) {
  const wallet = localStorage.getItem('wallet');
  const walletToken = localStorage.getItem('walletToken');
  const addressHeader = {
    'jungle-wallet-address': wallet,
    'jungle-wallet-token': walletToken,
  };

  const extensionToken = localStorage.getItem('extensionToken');

  try {
    for (const key of Object.keys(params)) {
      if (params[key] === '') {
        delete params[key];
      }
    }

    const response = await Request.get(url, {
      params: { ...params },
      headers: {
        ...addressHeader,
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_FAKE_EXTENSION_TOKEN || extensionToken
        }`,
        'x-api-key':
          process.env.NEXT_PUBLIC_REACT_APP_API_KEY ||
          process.env.REACT_APP_API_KEY ||
          '',
      },
    });

    if (!response || response.status !== 200) {
      return Promise.reject(response);
    }

    return response.data;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}

async function post(url, contentType, body = {}) {
  const wallet = localStorage.getItem('wallet');
  const walletToken = localStorage.getItem('walletToken');
  const addressHeader = {
    'jungle-wallet-address': wallet,
    'jungle-wallet-token': walletToken,
  };

  const extensionToken = localStorage.getItem('extensionToken');

  if (contentType === 'multipart/form-data') {
    const formData = new FormData();
    for (const key of Object.keys(body)) {
      if (body[key] !== '') {
        formData.append(key, body[key]);
      }
    }
    body = formData;
  } else {
    for (const key of Object.keys(body)) {
      if (body[key] === '') {
        delete body[key];
      }
    }
  }

  try {
    const response = await Request.post(url, body, {
      headers: {
        ...addressHeader,
        'Content-Type': contentType || 'application/json',
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_FAKE_EXTENSION_TOKEN || extensionToken
        }`,
        'x-api-key':
          process.env.NEXT_PUBLIC_REACT_APP_API_KEY ||
          process.env.REACT_APP_API_KEY ||
          '',
      },
    });

    if (!response || response.status !== 200) {
      return Promise.reject(response);
    }

    return response.data;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}

// [NOTE] NEW API URL FOR BUY ONLY FOR NOW
const NewRequest = axios.create({
  baseURL: 'https://private.cnftjungle.app',
  withCredentials: false,
  timeout: 120000,
});

async function newPost(url, contentType, body = {}) {
  const wallet = localStorage.getItem('wallet');
  const walletToken = localStorage.getItem('walletToken');
  const addressHeader = {
    'jungle-wallet-address': wallet,
    'jungle-wallet-token': walletToken,
  };

  const extensionToken = localStorage.getItem('extensionToken');

  if (contentType === 'multipart/form-data') {
    const formData = new FormData();
    for (const key of Object.keys(body)) {
      if (body[key] !== '') {
        formData.append(key, body[key]);
      }
    }
    body = formData;
  } else {
    for (const key of Object.keys(body)) {
      if (body[key] === '') {
        delete body[key];
      }
    }
  }

  try {
    const response = await NewRequest.post(url, body, {
      headers: {
        ...addressHeader,
        'Content-Type': contentType || 'application/json',
        Authorization: `Bearer ${
          process.env.NEXT_PUBLIC_FAKE_EXTENSION_TOKEN || extensionToken
        }`,
        'x-api-key':
          process.env.NEXT_PUBLIC_REACT_APP_API_KEY ||
          process.env.REACT_APP_API_KEY ||
          '',
      },
    });

    if (!response || response.status !== 200) {
      return Promise.reject(response);
    }

    return response.data;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}

// WTF ARE THOSE ENDPOINTS
const getLeaderboard = () => get('/leaderboard');

// EXTENSION
const getExtensionUser = () => get(`${HEROKU_URL}/me`);
const associateWalletWithUser = (body) =>
  post(`${HEROKU_URL}/wallet/associate`, 'application/json', body);
const syncExtensionState = (body) =>
  post(`${HEROKU_URL}/sync-state`, 'application/json', body);
const getExtensionCollections = (params) =>
  get(`${HEROKU_URL}/collections`, params);
const getExtensionTraitKeys = (params) =>
  get(`${HEROKU_URL}/traitkeys`, params);
const getCollectionFloors = (body) =>
  post(`${HEROKU_URL}/floors`, 'application/json', body);
const editExtensionSearches = (body) =>
  post(`${HEROKU_URL}/user/searches`, 'application/json', body);
const editWalletNotifications = (body) =>
  post(`${HEROKU_URL}/wallet/notifications`, 'application/json', body);
const editWalletSnipeSettings = (body) =>
  post(`${HEROKU_URL}/wallet/snipe-settings`, 'application/json', body);

// [TODO];
// NEW SNIPING
const getHuntList = (params) => get(`${HEROKU_URL}/hunt`, params);
const getSnipes = (policyId, userId) =>
  get(`${HEROKU_URL}/hunt/snipes?policyId=${policyId}&userId=${userId}`);
const createHunt = (body) =>
  post(`${HEROKU_URL}/hunt`, 'application/json', body);
const updateHunt = (huntId, body) =>
  post(`${HEROKU_URL}/hunt/${huntId}`, 'application/json', body);
const deleteHunt = (huntId, body) =>
  post(`${HEROKU_URL}/hunt/${huntId}`, 'application/json', body);
const updateAllHunts = (body) =>
  post(`${HEROKU_URL}/hunt/all`, 'application/json', body);

// HEROKU ENDPOINTS
const sendPromo = (body) =>
  post(`${HEROKU_URL}/send-promo`, 'multipart/form-data', body);
const getUserByAccessKey = (params) => get(`${HEROKU_URL}/access-key`, params);
const sendSubscription = (body) =>
  post(`${HEROKU_URL}/send-subscription`, 'application/json', body);
const getTraitAnalytics = (params) =>
  get(`${HEROKU_URL}/get-trait-analytics`, params);
const getGlobalTraitAnalytics = (params) =>
  get(`${HEROKU_URL}/get-top-traits`, params);
const getGlobalSnipedCollections = (params) =>
  get(`${HEROKU_URL}/get-top-sniped`, params);
const getAssetRarity = (params) => get(`${HEROKU_URL}/get-rarity`, params);
const getFeatured = (params) => get(`${HEROKU_URL}/get-featured`, params);
const getCandlesticks = (params) =>
  get(`${HEROKU_URL}/get-candlesticks`, params);
const getBookmarkAmount = (params) =>
  get(`${HEROKU_URL}/wallet/bookmark-amount`, params);

// REGISTER WALLET
const registerWallet = (body) =>
  post(`${HEROKU_URL}/wallet/create-address`, 'application/json', body);
const getWalletMe = () => get(`${HEROKU_URL}/wallet/me`);
const manageBookmark = (body) =>
  post(`${HEROKU_URL}/wallet/bookmark`, 'application/json', body);
const manageWatchlist = (body) =>
  post(`${HEROKU_URL}/wallet/watchlist`, 'application/json', body);
const manageHuntlist = (body) =>
  post(`${HEROKU_URL}/wallet/huntlist`, 'application/json', body);
const manageRenameHuntlist = (body) =>
  post(`${HEROKU_URL}/wallet/rename-huntlist`, 'application/json', body);
const manageRemoveHuntlist = (body) =>
  post(`${HEROKU_URL}/wallet/remove-huntlist`, 'application/json', body);
const createMobileWalletKey = () =>
  get(`${HEROKU_URL}/wallet/create-mobile-key`);

// TABLE ENDPOINTS
const getCollectionTable = (params) => get('/tables', params);

// SEARCH ENDPOINTS
const getSearchOptions = (query) => get(`/search?query=${query}`);

// WALLET ENDPOINTS
const getWalletAssets = (address, params) => get(`/wallet/${address}`, params);
const sendAda = (body) => post(`/wallet/payment`, 'application/json', body);
const buyNFT = (body) =>
  newPost('/api/v1/wallets/buy', 'application/json', body);
const walletSubmit = (body) => post('/wallet/submit', 'application/json', body);

// FEEDBACK ENDPOINTS
const reportCollection = (collectionId, params) =>
  get(`/feedback/report?collection_id=${collectionId}`, params);
const feedbackCollection = (collectionId, params) =>
  get(`/feedback/collections?collection_id=${collectionId}`, params);

// SALES ENDPOINTS
const getFullFloorHistory = (collectionPolicy, params) =>
  get(`/sales/${collectionPolicy}/topsales`, params);

// DROP ENDPOINTS
const getDrops = (params) => get('/drops', params);
const addCollection = (contentType, body) =>
  post(`/drops/submitdrop`, contentType, body);

// COLLECTION ENDPOINTS
const getCollections = (params) => get('/collections', params);
const getAssets = (collectionId, params) =>
  get(`/collections/${collectionId}`, params);
const getCollectionSales = (collectionId, params) =>
  get(`/sales/${collectionId}`, params);

// ASSETS ENDPOINTS
const getSingleAsset = (assetId) => get(`/assets/${assetId}`);
const getSingleAssetSales = (assetId) => get(`/sales/asset/${assetId}`);
const getSingleAssetInfo = (assetId) => get(`/assets/asset-info/${assetId}`);

// ANALYTICS ENDPOINTS
const getTrending = (params) => get('/analytics/trending', params);
const getTotalVolume = (params) => get('/analytics/totalvolume', params);
const getMarketplaces = (params) => get('/analytics/market-analytics', params);
const getMarketStats = (params) => get('/analytics/market-stats', params);
const getCollectionsAnalytics = (params) =>
  get('/analytics/collections-analytics', params);
const getMarketShare = (params) => get('/analytics/market-share', params);
const getCollectionsShare = (params) =>
  get('/analytics/collections-share', params);
const getTopSales = (params) => get('/analytics/top-sales', params);
const getCollectionsWorth = (params) => get('/analytics/inflatedworth', params);
const getTradeHistory = (collectionId, params) =>
  get(`/analytics/${collectionId}/analytics`, params);
const getPriceToRarity = (collectionId) =>
  get(`/analytics/${collectionId}/analytics?type=priceToRarity`);
const getDailyVolume = () => get(`/analytics/dailyvolume`);
const getAnalyticsIndex = (body) =>
  post(`/analytics/index`, 'application/json', body);

// UTILS
const getCollectionExplorer = (collectionId) =>
  get(`/utils/collection-explorer/${collectionId}`);
const getCollectionExplorerSales = (collectionId) =>
  get(`/utils/collection-explorer-sales/${collectionId}`);
const getCompareSearchOptions = (collectionId, query) =>
  get(`/utils/assetsearch?collection_id=${collectionId}&query=${query}`);
const getCollectionTraitFloors = (collectionId) =>
  get(`/utils/traitfloors/${collectionId}`);

// STRIPE API SUBSCRIPTION
const createCheckoutSession = (body) =>
  post(
    HEROKU_URL + '/subscription/api/create-checkout-session',
    'application/json',
    body
  );
const createPortalSession = (body) =>
  post(
    HEROKU_URL + '/subscription/api/create-portal-session',
    'application/json',
    body
  );
const getApiPlans = () => get(HEROKU_URL + '/subscription/api/plans');
const getApiSubscription = () => get(HEROKU_URL + '/subscription/api/me');

export {
  getCollections,
  getCollectionTable,
  getAssets,
  getSingleAsset,
  getSearchOptions,
  getCompareSearchOptions,
  getWalletAssets,
  reportCollection,
  feedbackCollection,
  getLeaderboard,
  getDrops,
  addCollection,
  getTrending,
  getMarketplaces,
  getTotalVolume,
  getCollectionsWorth,
  getCollectionsAnalytics,
  getMarketStats,
  getMarketShare,
  getCollectionsShare,
  getTopSales,
  getFeatured,
  getCollectionExplorer,
  getCollectionExplorerSales,
  getTradeHistory,
  getFullFloorHistory,
  sendPromo,
  getSingleAssetSales,
  getCollectionTraitFloors,
  getCollectionSales,
  sendAda,
  getPriceToRarity,
  getSingleAssetInfo,
  buyNFT,
  getTraitAnalytics,
  getGlobalTraitAnalytics,
  getAnalyticsIndex,
  getUserByAccessKey,
  sendSubscription,
  getExtensionUser,
  syncExtensionState,
  getExtensionCollections,
  getCollectionFloors,
  registerWallet,
  getWalletMe,
  manageBookmark,
  getAssetRarity,
  associateWalletWithUser,
  editExtensionSearches,
  editWalletNotifications,
  createCheckoutSession,
  createPortalSession,
  getApiPlans,
  getApiSubscription,
  createMobileWalletKey,
  manageWatchlist,
  getHuntList,
  createHunt,
  updateHunt,
  deleteHunt,
  updateAllHunts,
  editWalletSnipeSettings,
  manageHuntlist,
  manageRenameHuntlist,
  manageRemoveHuntlist,
  getExtensionTraitKeys,
  getGlobalSnipedCollections,
  walletSubmit,
  getSnipes,
  getCandlesticks,
  getBookmarkAmount,
  getDailyVolume,
};
