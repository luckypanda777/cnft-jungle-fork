/* global chrome */

import { useEffect, useState, useContext, useCallback } from 'react';
import { Box, Button, CircularProgress, Divider } from '@mui/material';
import pinkOrca from 'assets/pinkorcalogo.png';
import styles from '../../styles/Snipe.module.scss';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { assetIdToHex } from 'utils/cardanoUtils';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import Image from 'next/image';
import classNames from 'classnames';
import { handleBuyAsset } from 'utils/purchaseNFT';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { eventTrack } from 'config/analytics';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { getSingleAssetInfo } from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import JungleLogo from 'assets/icons/jungle.svg';
import Trait from './Trait';
import MobileTrait from './MobileTrait';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import Select from 'components/common/Select';
import useNFTAction from 'hooks/useNFTAction';

const SEO = {
  title: 'CNFT Jungle - Advanced CNFT Sniping ',
  description: 'Get a huge edge with our advanced sniping tools',
};

export async function getServerSideProps(ctx) {
  const {
    assetId = '',
    wallet = 'nami',
    price = 0,
    isHex = false,
    huntType = 'Price',
    assetName = '',
    collectionName = '',
    accessKey = '',
    link = '',
    label = '',
    quickSnipe = true,
    purchaseType = 'SNIPE',
  } = ctx.query;

  return {
    props: {
      //header: false,
      wallet: wallet === 'typhon' ? 'typhoncip30' : wallet,
      isHex,
      assetId,
      price,
      huntType,
      assetName,
      collectionName,
      accessKey,
      link,
      label,
      purchaseType,
      quickSnipe:
        quickSnipe === 'undefined' || quickSnipe === 'true' ? true : false,
    },
  };
}

const Sniping = ({
  assetId,
  wallet,
  price,
  huntType,
  isHex,
  assetName,
  collectionName,
  accessKey,
  link,
  label,
  quickSnipe,
  purchaseType = 'SNIPE',
}) => {
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();

  const [assetInfo, setAssetInfo] = useState({});
  const [assetInfoLoading, setAssetInfoLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState(wallet);
  const { handleNFTAction, loadingNFTAction } = useNFTAction();

  const fetchAssetInfo = async () => {
    try {
      const hexifiedAssetId =
        isHex === 'false' ? assetIdToHex(assetId) : assetId;

      const response = await getSingleAssetInfo(hexifiedAssetId);

      console.log('response', response);

      setAssetInfo(response);
    } catch (err) {
      console.log('ASSET INFO ERROR', err);
      setAssetInfo({});
    }

    setAssetInfoLoading(false);
  };

  const purchaseAsset = () => {
    setError(null);
    handleNFTAction({
      type: 'BUY',
      assetId,
      price: price * 1000000,
      tier: 'SNIPE',
      accessKey,
      isHex,
      onError: (err) => {
        setError(err);
        showFeedback({
          message: err,
          kind: 'error',
          duration: 5000,
        });
      },
      onSuccess: (txHash) => {
        showFeedback({
          message: `TRANSACTION SEND`,
          kind: 'success',
          duration: 5000,
        });
        setTxHash(txHash);
        try {
          eventTrack('snipe', assetId, price);
          postTweet();
        } catch (err) {
          console.log('ERROR', err);
        }
      },
      wallet: selectedWallet,
      showFeedback,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const postTweet = useCallback(async () => {
    return await axios.post(
      'https://cnft-predator.herokuapp.com/send-tweet',
      {
        name: assetInfo?.asset_name,
        price,
        image:
          !assetInfo?.optimized_image ||
          assetInfo?.optimized_image?.includes('unsupported')
            ? assetInfo?.image
            : assetInfo?.optimized_image,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );
  }, [assetInfo]);

  useEffect(() => {
    console.log({
      name: assetInfo?.asset_name,
      price,
      image:
        !assetInfo?.optimized_image ||
        assetInfo?.optimized_image?.includes('unsupported')
          ? assetInfo?.image
          : assetInfo?.optimized_image,
    });

    if (quickSnipe && mounted) {
      setTimeout(() => {
        handleNFTAction({
          type: 'BUY',
          assetId,
          price: price * 1000000,
          tier: 'SNIPE',
          isHex,
          accessKey,
          onError: (err) => {
            setError(err);
            showFeedback({
              message: err,
              kind: 'error',
              duration: 5000,
            });
          },
          onSuccess: (txHash) => {
            showFeedback({
              message: `TRANSACTION SEND`,
              kind: 'success',
              duration: 5000,
            });
            try {
              eventTrack('snipe', assetId, price);
              postTweet();
            } catch (err) {
              console.log('ERROR', err);
            }
          },
          wallet: selectedWallet,
          showFeedback,
        }).catch(() => setError(true));
      }, 100);
    }

    if (assetId) {
      fetchAssetInfo();
    }
  }, [assetId, mounted]);

  useEffect(() => {
    setTimeout(() => {
      setShowLink(true);
    }, 5000);
  }, [walletInfo.address]);

  if (!mounted) return null;

  const floorDiff = assetInfo?.floor ? assetInfo?.floor - price : 0;

  return (
    <Box className={styles.main}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          p: 2,
          rowGap: 2,
          width: '90%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: 0.5,
            justifyContent: 'center',
          }}
        >
          <JungleLogo width={150} height={40} />
          <span
            style={{
              fontSize: 30,
              paddingTop: 5,
              fontFamily: 'newgilroysemibold',
            }}
          >
            Checkout
          </span>
        </Box>
        {assetInfoLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
              <Box className={styles.image}>
                {(assetInfo?.optimized_image || assetInfo?.image) && (
                  <ImageWithErrorHandler
                    src={imgLinkReplace(assetInfo?.image)}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 20,
                    }}
                    nextImg
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {label && <span style={{ fontSize: 22 }}>Label: {label}</span>}
                <span
                  style={{
                    fontSize: 14,
                    color: '#BDBEC6',
                    fontFamily: 'newgilroysemibold',
                  }}
                >
                  Collection
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontFamily: 'newgilroyregular',
                    wordBreak: 'break-all',
                  }}
                >
                  {collectionName || assetInfo.collection_name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: '#BDBEC6',
                    fontFamily: 'newgilroysemibold',
                  }}
                >
                  Asset Name
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontFamily: 'newgilroyregular',
                    wordBreak: 'break-all',
                  }}
                >
                  {assetName || assetInfo.asset_name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: '#BDBEC6',
                    fontFamily: 'newgilroysemibold',
                  }}
                >
                  Rarity Rank
                </span>
                <span style={{ fontSize: 16, fontFamily: 'newgilroyregular' }}>
                  {assetInfo?.rarity_rank}
                </span>
              </Box>
            </Box>

            <Box>
              {label && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <span
                    style={{ fontSize: 16, fontFamily: 'newgilroyregular' }}
                  >
                    {label}
                  </span>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Collection Floor</span>
                <span
                  style={{
                    color:
                      floorDiff > 500
                        ? 'var(--severeUndervaluedColor)'
                        : floorDiff > 200
                        ? 'var(--undervaluedColor)'
                        : floorDiff > 0
                        ? 'var(--slightlyUndervaluedColor)'
                        : floorDiff === 0
                        ? 'var(--fontColor)'
                        : floorDiff < -500
                        ? 'var(--severeOvervaluedColor)'
                        : floorDiff < -200
                        ? 'var(--overvaluedColor)'
                        : 'var(--slightlyOvervaluedColor)',
                  }}
                >
                  {assetInfo?.floor} ADA ({floorDiff} ADA)
                </span>
              </Box>
              <Box className={styles.assetTraits}>
                {Object.keys(assetInfo?.traits || {}).length > 0 &&
                  Object.entries(assetInfo?.traits || {})
                    .sort((a, b) => {
                      try {
                        const traitPriceDifference =
                          assetInfo?.traitfloors?.[a[0]]?.[a[1]] - price;
                        const traitPriceDifference2 =
                          assetInfo?.traitfloors?.[b[0]]?.[b[1]] - price;

                        return traitPriceDifference2 - traitPriceDifference;
                      } catch {
                        return 0;
                      }
                    })
                    .map(([traitKey, traitValue], index) => {
                      if (Array.isArray(traitValue)) {
                        return traitValue.map((value, index) => {
                          const traitFrequency =
                            assetInfo.collection_traitslist?.[traitKey]?.[
                              value
                            ] /
                            (assetInfo.collection_supply ||
                              Object.values(
                                assetInfo?.collection_traitslist?.[traitKey] ||
                                  {}
                              ).reduce((acc, curr) => acc + curr, 0));

                          const traitPriceDifference =
                            assetInfo?.traitfloors?.[traitKey]?.[value] - price;

                          return (
                            <MobileTrait
                              key={index}
                              traitKey={traitKey}
                              traitValue={value}
                              traitFrequency={traitFrequency}
                              traitfloors={assetInfo?.traitfloors}
                              traitPriceDifference={traitPriceDifference}
                            />
                          );
                        });
                      }

                      const traitPriceDifference =
                        assetInfo?.traitfloors?.[traitKey]?.[traitValue] -
                        price;

                      const traitFrequency =
                        assetInfo.collection_traitslist?.[traitKey]?.[
                          traitValue
                        ] /
                        (assetInfo.collection_supply ||
                          Object.values(
                            assetInfo?.collection_traitslist?.[traitKey] || {}
                          ).reduce((acc, curr) => acc + curr, 0));

                      return (
                        <MobileTrait
                          key={index}
                          traitKey={traitKey}
                          traitValue={traitValue}
                          traitFrequency={traitFrequency}
                          traitPriceDifference={traitPriceDifference}
                          traitfloors={assetInfo?.traitfloors || {}}
                        />
                      );
                    })}
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '90%',
          mx: 'auto',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <span>Select Wallet</span>
        <Select
          options={[
            { label: 'nami', value: 'nami' },
            { label: 'flint', value: 'flint' },
            { label: 'eternl', value: 'eternl' },
            { label: 'gerowallet', value: 'gerowallet' },
            { label: 'typhon', value: 'typhon' },
          ]}
          onChange={(e) => setSelectedWallet(e.target.value)}
          sx={{ width: 100, minWidth: '90%' }}
          value={selectedWallet || 'nami'}
          name="selectedWallet"
        />
      </Box>
      <WalletButtonBase
        sx={{ width: '90%', mx: 'auto' }}
        onClick={purchaseAsset}
        disabled={loadingNFTAction}
      >
        {loadingNFTAction ? (
          <CircularProgress size={28} sx={{ color: 'var(--whiteColor)' }} />
        ) : (
          `Purchase for ${price} ADA`
        )}
      </WalletButtonBase>
    </Box>
  );
};

export default Sniping;
