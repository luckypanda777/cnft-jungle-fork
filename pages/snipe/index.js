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
import { tryNTimes } from 'utils/shorten';

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

const Trait = ({
  index,
  traitKey,
  traitValue,
  traitfloors,
  traitFrequency,
  traitPriceDifference,
}) => (
  <Box
    key={index}
    className={styles.paper}
    style={{
      display: 'flex',
      fontSize: 16,
      columnGap: 10,
      justifyContent: 'center',
    }}
  >
    <Box className={styles.heading}>{traitKey}</Box>
    <Box className={styles.heading}> / </Box>
    <Box className={styles.value}>{traitValue}</Box>
    <Box className={styles.value}>({(traitFrequency * 100).toFixed(2)}%)</Box>
    <Box
      style={{
        color:
          traitPriceDifference > 500
            ? 'var(--severeUndervaluedColor)'
            : traitPriceDifference > 200
            ? 'var(--undervaluedColor)'
            : traitPriceDifference > 0
            ? 'var(--slightlyUndervaluedColor)'
            : traitPriceDifference === 0
            ? 'var(--fontColor)'
            : traitPriceDifference < -500
            ? 'var(--severeOvervaluedColor)'
            : traitPriceDifference < -200
            ? 'var(--overvaluedColor)'
            : 'var(--slightlyOvervaluedColor)',
      }}
    >
      {!isNaN(traitPriceDifference) ? (
        <>
          {traitfloors[traitKey][traitValue]} ADA (
          {traitPriceDifference > 0
            ? '+'
            : traitPriceDifference == 0
            ? '='
            : ''}
          {parseInt(traitPriceDifference)} ADA)
        </>
      ) : (
        'No data'
      )}
    </Box>
  </Box>
);

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
  const [loading, setLoading] = useState(quickSnipe);
  const [mounted, setMounted] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();

  const [assetInfo, setAssetInfo] = useState({});
  const [assetInfoLoading, setAssetInfoLoading] = useState(true);

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
      console.log('AUTO BUY ASSET', assetId);

      let retries = 0;
      const buy = () => {
        setLoading(true);
        handleBuyAsset({
          assetId,
          price: price * 1000000,
          tier: 'SNIPE',
          isHex,
          accessKey,
          onError: (err) => {
            console.log('ERROR', err);
            if (
              retries < 25 &&
              ![
                'NO_WALLET_CONNECTED',
                'ALREAD_SNIPED',
                'NOT_ENOUGH_FUNDS',
                'ERROR_SIGNING_TX',
              ].includes(err)
            ) {
              console.log('RETRYING');
              showFeedback({
                message: `Failed #${retries + 1}. Retrying...`,
                kind: 'warning',
                duration: 2000,
              });
              retries++;
              buy();
            } else {
              console.log('RETRYING BUY ASSET FAILED', err);
              setError(err);
              showFeedback({
                message: err,
                kind: 'error',
                duration: 5000,
              });
              setLoading(false);
            }
          },
          onLoading: () => {},
          onSuccess: () => {
            console.log('SUCCESS');
            setLoading(false);
            showFeedback({
              message: 'TX SENT',
              kind: 'success',
              duration: 5000,
            });
          },
          wallet,
          showFeedback,
        });
      };

      buy();
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
    <>
      <NextSeo {...SEO} />
      <Box style={{ position: 'absolute', top: 40, right: 40 }}>
        <Image src={pinkOrca} alt="logo" height={200} width={200} />
      </Box>
      <Box className={styles.main}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginLeft: 75,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            <Box className={styles.assetInfo}>
              <span style={{ fontSize: 24 }}>
                {/* first letter uppercase */}
                Predator Hunt Success!
              </span>
              {label && <span style={{ fontSize: 22 }}>Label: {label}</span>}
              <span>
                Collection Name: {collectionName || assetInfo.collection_name}
              </span>
              <span>Asset Name: {assetName || assetInfo.asset_name}</span>
              <span>Price: {price} ADA</span>
              {assetInfoLoading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 32,
                  }}
                >
                  Loading Asset Info
                  <CircularProgress sx={{ ml: 1 }} />
                </span>
              ) : (
                <>
                  <Box className={styles.image}>
                    {(assetInfo?.optimized_image || assetInfo?.image) && (
                      <ImageWithErrorHandler
                        src={imgLinkReplace(assetInfo?.image)}
                        style={{
                          width: 300,
                          height: 300,
                          borderRadius: 20,
                          margin: 'auto',
                        }}
                        nextImg
                      />
                    )}
                  </Box>
                  <span style={{ color: 'var(--logoColor)' }}>
                    Rarity Rank: {assetInfo?.rarity_rank}
                  </span>
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
                    Collection Floor: {assetInfo?.floor} ADA ({floorDiff} ADA)
                  </span>
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
                                    assetInfo?.collection_traitslist?.[
                                      traitKey
                                    ] || {}
                                  ).reduce((acc, curr) => acc + curr, 0));

                              const traitPriceDifference =
                                assetInfo?.traitfloors?.[traitKey]?.[value] -
                                price;

                              return (
                                <Trait
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
                                assetInfo?.collection_traitslist?.[traitKey] ||
                                  {}
                              ).reduce((acc, curr) => acc + curr, 0));

                          return (
                            <Trait
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
                </>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2, width: '100%' }} />

          <>
            <Box className={classNames(styles.container, styles.price)}>
              <Box className={styles.paper} style={{ flexGrow: 1 }}>
                <Button
                  className={styles.heading}
                  style={{ fontSize: 12 }}
                  onClick={() =>
                    window.open(
                      `https://pool.pm/${encodeURIComponent(
                        assetInfo?.asset_id
                      )}`,
                      '_blank'
                    )
                  }
                  variant="contained"
                >
                  Check on pool.pm
                </Button>
              </Box>
            </Box>
            <Divider sx={{ my: 2, width: '100%' }} />
            <Box className={classNames(styles.container, styles.price)}>
              <Box className={styles.paper} style={{ flexGrow: 1 }}>
                <Button
                  className={styles.heading}
                  style={{ fontSize: 12 }}
                  onClick={() =>
                    window.open(
                      `https://cnftjungle.io/collections/${assetInfo?.policy_id}`,
                      '_blank'
                    )
                  }
                  variant="contained"
                >
                  Check collection on jungle
                </Button>
              </Box>
            </Box>
            <Divider sx={{ my: 2, width: '100%' }} />
            <Box className={classNames(styles.container, styles.price)}>
              <Box className={styles.paper} style={{ flexGrow: 1 }}>
                {showLink ? (
                  <Button
                    className={styles.heading}
                    style={{ fontSize: 12 }}
                    onClick={() => window.open(link, '_blank')}
                    variant="contained"
                  >
                    Listing's link
                  </Button>
                ) : (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 32,
                    }}
                  >
                    Link loading
                    <CircularProgress sx={{ ml: 1 }} />
                  </span>
                )}
              </Box>
            </Box>
            <Divider sx={{ my: 2, width: '100%' }} />
          </>
          {error === 'NO_FUNDS' && (
            <span
              style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}
            >
              You don't have enough funds to buy this asset
            </span>
          )}
          {error === 'NO_WALLET' && (
            <span
              style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}
            >
              No wallet connected
            </span>
          )}
          {error === 'GENERIC_ERROR' && (
            <span
              style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}
            >
              Something went wrong
            </span>
          )}
          {loading && !error ? (
            <span
              style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}
            >
              Snipe in progress
              <CircularProgress sx={{ ml: 1 }} />
            </span>
          ) : (
            <Button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                setError(null);
                handleBuyAsset({
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
                  onLoading: setLoading,
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
                  wallet,
                  showFeedback,
                });
              }}
              variant="contained"
              sx={{ marginTop: 2, width: 200 }}
            >
              {loading ? <CircularProgress size={14} /> : 'Try again'}
            </Button>
          )}

          {txHash && <span>Tx hash: {txHash}</span>}
        </Box>
      </Box>
    </>
  );
};

export default Sniping;
