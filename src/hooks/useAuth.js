import { useContext, useEffect, useState } from 'react';
import { Context as AuthContext } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { getWalletMe, registerWallet } from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import {
  APEX_PASS,
  MANGO_PASS,
  ORCA_PASS,
} from 'components/Sniping/Platform/NFTHunt/hunt-assets';

const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    setAuth,
    setAllowance,
  } = useContext(AuthContext);
  const {
    state: { walletInfo },
  } = useAppContext();

  const checkUser = async (bounceUser = true) => {
    setLoading(true);

    try {
      const response = await registerWallet({
        address: walletInfo.address,
      });

      if (response.user) {
        let huntAmount = 0;
        let autoBuyHuntAmount = 0;

        const assetsOwned = response.user?.assetsOwned?.map((asset) =>
          asset.replace('HUNT', 'APEX').replace('APEXERPASS', 'HUNTER')
        );

        assetsOwned.forEach((asset) => {
          if (asset.includes('HUNTER')) {
            if (MANGO_PASS.includes(asset)) {
              huntAmount += 60;
              autoBuyHuntAmount += 4;
            } else {
              huntAmount += 30;
              autoBuyHuntAmount += 2;
            }
          }

          if (asset.includes('APEX')) {
            huntAmount += 100;
            autoBuyHuntAmount += 4;
          }

          if (asset.includes('WENNO')) {
            huntAmount += 1;
            autoBuyHuntAmount += 0.5;
          }

          if (APEX_PASS.includes(asset) && response.user.snipeTier !== 'orca') {
            response.user.snipeTier = 'apex';
          }

          if (ORCA_PASS.includes(asset)) {
            response.user.snipeTier = 'orca';
          }
        });

        if (response.user.snipeTier === 'orca') {
          huntAmount += 1000000;
          autoBuyHuntAmount += 10;
        }

        if (!!response.user.snipeAccessExpiry) {
          huntAmount += 30;
          autoBuyHuntAmount += 2;
        }

        if (
          response.user.address ===
          'addr1qx6u9sras5j5c9ek0npwk8vd6wxq936qtyqu34rr60athwyrnlpcq9u972r744ddpv7ryluw2nr36c2km80lhvlj84mq6f7uwy'
        ) {
          autoBuyHuntAmount += 14;
        }

        if (
          response.user.address ===
          'addr1q92whuh9rx8xn6eh0xx8qz7lawml4853j6yh4j3x4kmv4m5hps9ma6559026fpsx7s33jn04ecqrdke5dd303676hv3sywyhxt'
        ) {
          autoBuyHuntAmount += 11;
        }

        if (
          response.user.address ===
          'addr1q9j65jm0grszzef6zz957z8zdk5tfdaqa6w02n7q9ushcjy9z4n6t2dr8xzavp5qhcxh6kxdnacj23cfwyfhv66zzhds4n4xn0'
        ) {
          huntAmount += 30;
        }

        if (
          response.user.address ===
          'addr1q89z8nrk786ejpjfdn98kqwd8zhkytsd65yx05cey46jlzuqkynwpmtwyxvvphregus45ak944c93l4cpv0apjhs7xzq4pmmk4'
        ) {
          autoBuyHuntAmount += 16;
        }

        if (
          response.user.address ===
          'addr1q9mrhr0m06lju9mq8ckhvgdnu4efpntrd2yhaf7jaepjlperkpjgycs24q0xhmfd5edcrne3h98xeavlg590hzs8uxtq6etkkf'
        ) {
          response.user.snipeTier = 'apex';
        }

        if (
          response.user.stakeKey ===
          'stake1uxl3w9skj86jk5c35rvz87zrg3sk6pg3ch24r6d2cz8nvvgxjf00j'
        ) {
          response.user.snipeTier = 'orca';
        }

        console.log('AUTH HUNTS', huntAmount, autoBuyHuntAmount);

        setAllowance({
          huntAmount,
          autoBuyHuntAmount: Math.floor(autoBuyHuntAmount),
        });
        setAuth({ user: response.user });
        localStorage.setItem('user', response.user._id);
        if (response?.user?.snipeTier) {
          setExtensionAuthState(response.user);
        }
      }
    } catch (err) {
      console.log('AUTH ERROR', err);
      if (bounceUser) clearAuth();
    } finally {
      setLoading(false);
    }

    return;
  };

  const clearAuth = () => {
    // disconnect();
    setAuth({ user: false });
    localStorage.removeItem('extensionToken');
    localStorage.removeItem('mobileAcessKey');
    setLoading(false);
  };

  const setExtensionAuthState = async (newUser = null) => {
    // if dev mode or localhost, don't set extension auth state
    if (
      process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost'
    ) {
      return;
    }
    if (!chrome?.runtime) return setLoading(false);

    setLoading(true);
    console.log('EXTENSION ID', process.env.NEXT_PUBLIC_EXTENSION_ID);

    // if (process.env.NODE_ENV === 'production') {
    console.log('EXTENSION LOGIN START');

    const token = localStorage.getItem('walletToken');
    console.log(
      'SETTING EXTENSION AUTH CONTEXT',
      process.env.NEXT_PUBLIC_EXTENSION_ID,
      token,
      user
    );

    chrome?.runtime?.sendMessage(
      // jlajkhhjgghiidlfgpkhhjbgbfkmklio <- production
      // onmieokgdenmhjijkcfmgnnlngdflmik <- staging
      process.env.NEXT_PUBLIC_EXTENSION_ID,
      {
        type: 'SET_EXTENSION_AUTH_CONTEXT',
        token,
        user: newUser || user,
      },
      (response) => {
        console.log('AUTH RESPONSE', response);
      }
    );

    chrome?.runtime?.sendMessage(
      // jlajkhhjgghiidlfgpkhhjbgbfkmklio <- production
      // onmieokgdenmhjijkcfmgnnlngdflmik <- staging
      // kcnhpaolckjglfacokompmchalkdihil <- wennowallet
      process.env.NEXT_PUBLIC_SNIPE_WALLET_EXTENSION_ID,
      {
        type: 'SET_EXTENSION_AUTH_CONTEXT',
        token,
        user: newUser || user,
      },
      (response) => {
        console.log('AUTH RESPONSE', response);
      }
    );

    // }

    setLoading(false);
  };

  const saveSettings = (settings) => {};

  const verifyMobileAccessKey = async (mobileAccessKey, setError) => {
    try {
      const response = await api.post('/verify-mobile-key', {
        mobileAccessKey,
      });

      if (response.success) {
        localStorage.setItem('extensionToken', response.token);
        localStorage.setItem('mobileAccessKey', mobileAccessKey);

        reconnect(response.token);
        return checkUser();
      }

      return setError(true);
    } catch (err) {
      console.log('VERIFY MOBILE KEY ERROR', err);
      return setError(true);
    }
  };

  return {
    loading: loading || walletInfo.loading,
    user,
    checkUser,
    clearAuth,
    setExtensionAuthState,
    verifyMobileAccessKey,
    setAuth,
    setLoading,
  };
};

export { useAuth };
