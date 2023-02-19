import { useAppContext } from 'context/AppContext';
import { useState } from 'react';
import { handleBuyAsset, handleSellAsset } from 'utils/purchaseNFT';

const useNFTAction = () => {
  const {
    state: { walletInfo },
  } = useAppContext();
  const [loadingNFTAction, setLoadingNFTAction] = useState(false);

  const handleNFTAction = ({
    type,
    price,
    assetId,
    isHex,
    tier = 'JUNGLE',
    onError,
    onSuccess,
    onFallback,
    registerDelay,
    wallet,
  }) => {
    if (type === 'BUY') {
      setLoadingNFTAction(true);
      return handleBuyAsset({
        assetId,
        price,
        isHex,
        wallet: wallet || walletInfo.name,
        tier,
        onError,
        onSuccess,
        onFallback,
        onLoading: setLoadingNFTAction,
        registerDelay,
      });
    }

    if (type === 'SELL') {
      setLoadingNFTAction(true);
      return handleSellAsset({
        assetId,
        price,
        isHex,
        wallet: walletInfo.name,
        tier,
        onError,
        onSuccess,
        onFallback,
        onLoading: setLoadingNFTAction,
        registerDelay,
      });
    }
  };

  return { handleNFTAction, loadingNFTAction };
};

export default useNFTAction;
