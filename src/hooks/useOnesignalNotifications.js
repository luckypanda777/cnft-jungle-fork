import { associateWalletWithUser } from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useAuth } from './useAuth';

const useOnesignalNotifications = () => {
  const {
    state: { walletInfo },
  } = useAppContext();

  // useEffect(() => {
  //   if (!walletInfo.address) return;

  //   initializeOnesignal();
  // }, [walletInfo.address]);

  const initializeOnesignal = async () => {
    window.OneSignal = window.OneSignal || [];

    console.log('Starting onesignal');
    try {
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_ID,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID,
        allowLocalhostAsSecureOrigin: true,
      });

      console.log('OneSignal initialized');
      await OneSignal.showSlidedownPrompt({ force: true });
      console.log('SETTING EXTERNAL USER ID', walletInfo.address);
      return await OneSignal.setExternalUserId(walletInfo.address);
    } catch (err) {
      console.log('ONESIGNAL ERROR', err);
    }
    console.log('Starting onesignal');
  };

  return { initializeOnesignal };
};

export { useOnesignalNotifications };
