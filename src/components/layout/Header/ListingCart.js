import React, { useContext, useEffect, useState } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useAppContext } from 'context/AppContext';
import {
  IconButton,
  Box,
  Divider,
  Button,
  CircularProgress,
  TextField,
  Skeleton,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TrendingBoxSell } from 'components/boxes/BookmarkBoxes';
import useNFTAction from 'hooks/useNFTAction';
import CustomTooltip from 'components/common/CustomTooltip';
import { getSingleAssetInfo } from 'apiProvider';
import { hexifyAssetId } from 'utils/shorten';
import { useMemo } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import classNames from 'classnames';
import styles from './Header.module.scss';
import useDebounce from '../../../hooks/useDebounce';
import { useRouter } from 'next/router';
import axios from 'axios';

const CartListItem = ({ asset, assetValuation }) => {
  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState(0);
  const { state, setListingCart, setLoadingCart } = useAppContext();
  const debouncedCustomInput = useDebounce(customInput, 400);

  const onSelectedValuation = (valuation) => {
    const newCart = state.listingCart.map((item) => {
      if (item.name === asset.asset_name) {
        return {
          ...item,
          selectedValuation: valuation,
        };
      }

      return item;
    });
    setListingCart(newCart);
  };

  const onCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const onClickCustomInput = () => {
    const newCart = state.listingCart.map((item) => {
      if (item.name === asset.asset_name) {
        return {
          ...item,
          selectedValuation: 'customValuation',
          customValuation: parseInt(''),
        };
      }

      return item;
    });
    setListingCart(newCart);
  };

  const cartAsset = useMemo(
    () => state.listingCart.find((item) => item.name === asset.asset_name),
    [state.listingCart]
  );

  useEffect(() => {
    if (debouncedCustomInput) {
      const newCart = state.listingCart.map((item) => {
        if (item.name === asset.asset_name) {
          return {
            ...item,
            selectedValuation: 'customValuation',
            customValuation: parseInt(debouncedCustomInput),
          };
        }

        return item;
      });
      setListingCart(newCart);
    }
  }, [debouncedCustomInput]);

  if (!cartAsset) {
    return (
      <>
        <Box sx={{ display: 'flex', p: 1, columnGap: 1, width: 430 }}>
          <Skeleton
            width={50}
            height={50}
            variant="rectangular"
            sx={{ borderRadius: 2 }}
          />
          <Box
            sx={{
              display: 'flex',
              rowGap: 1,
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <Skeleton
              width={`${parseInt((Math.random() + 0.5) * 60)}%`}
              height={15}
              variant="text"
            />
            <Skeleton
              width={`${parseInt((Math.random() + 0.5) * 30)}%`}
              height={15}
              variant="text"
            />
          </Box>
        </Box>
        <Divider sx={{ width: '95%', mx: 'auto' }} />
      </>
    );
  }

  return (
    <Box>
      <TrendingBoxSell
        option={asset}
        tertiaryValue={
          loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
              <span>Valuating</span>
              <CircularProgress size={14} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                  gap: '5px',
                }}
              >
                <CustomTooltip
                  style={{ paddingTop: 0, marginLeft: 0 }}
                  placement="top"
                  title={
                    cartAsset.floorValuation < 5
                      ? 'Valuation too low, transaction may fail'
                      : ''
                  }
                >
                  <Box
                    className={classNames(
                      styles.infoBox,
                      styles.defaultValuation,
                      cartAsset?.selectedValuation === 'floorValuation' &&
                        styles.selectedValuation,
                      cartAsset.floorValuation < 5 && styles.tooLowValuation
                    )}
                    onClick={() => onSelectedValuation('floorValuation')}
                  >
                    <span className={styles.infoBoxLabel}>Min:&nbsp;</span>
                    <span className={styles.infoBoxValue}>
                      <span className={styles.infoCurrency}>₳</span>
                      {cartAsset.floorValuation}
                    </span>
                  </Box>
                </CustomTooltip>
                <Box
                  className={classNames(
                    styles.infoBox,
                    styles.defaultValuation,
                    cartAsset?.selectedValuation === 'averageValuation' &&
                      styles.selectedValuation,
                    cartAsset.averageValuation < 5 && styles.tooLowValuation
                  )}
                  onClick={() => onSelectedValuation('averageValuation')}
                >
                  <span className={styles.infoBoxLabel}>Avg:&nbsp;</span>
                  <span className={styles.infoBoxValue}>
                    <span className={styles.infoCurrency}>₳</span>
                    {cartAsset.averageValuation}
                  </span>
                </Box>
                <Box
                  className={classNames(
                    styles.infoBox,
                    styles.defaultValuation,
                    cartAsset?.selectedValuation === 'topValuation' &&
                      styles.selectedValuation,
                    cartAsset.topValuation < 5 && styles.tooLowValuation
                  )}
                  onClick={() => onSelectedValuation('topValuation')}
                >
                  <span className={styles.infoBoxLabel}>Top:&nbsp;</span>
                  <span className={styles.infoBoxValue}>
                    <span className={styles.infoCurrency}>₳</span>
                    {cartAsset.topValuation}
                  </span>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box className={styles.defaultCustomPrice}>
                  <InputCustomPrice
                    customInput={customInput}
                    isSelected={
                      cartAsset?.selectedValuation === 'customValuation'
                    }
                    onCustomInputChange={onCustomInputChange}
                    onClickInput={onClickCustomInput}
                  />
                </Box>
              </Box>
            </Box>
          )
        }
        showColor={false}
        identifier={asset.asset_id}
        showIcons={['cart']}
        style={{ cursor: 'auto' }}
        labelLength={35}
        isOwned
        onRemove={() =>
          setListingCart(
            state.listingCart.filter(
              (cartAsset) => cartAsset.asset_id !== asset.asset_id
            )
          )
        }
      />
    </Box>
  );
};

const InputCustomPrice = ({
  customInput,
  onCustomInputChange,
  isSelected,
  onClickInput,
}) => {
  const [onFocus, setOnFocus] = useState(false);

  const handleOnFocus = () => {
    setOnFocus(true);
    onClickInput();
  };

  return (
    <div className={styles.sellCartCustomInputWrap}>
      {!onFocus && !customInput && !isSelected
        ? 'Set Custom Price:'
        : 'Custom Price:'}
      <span
        className={styles.sellCartCustomInputTitleWrap}
        style={{
          backgroundColor: isSelected
            ? 'var(--severeUndervaluedColor)'
            : 'var(--bgColor)',
        }}
      >
        <div
          className={styles.sellCartCustomInputCurrency}
          style={{
            color:
              isSelected || onFocus
                ? 'var(--fontColor)'
                : 'var(--cartSellTitleValue)',
          }}
        >
          ₳
        </div>
        <input
          onFocus={handleOnFocus}
          onBlur={() => setOnFocus(false)}
          placeholder={'Type'}
          className={styles.sellCartCustomInput}
          style={{
            color: !isSelected ? 'var(--saleCardBg)' : 'var(--fontColor)',
          }}
          value={customInput ? customInput : undefined}
          onChange={onCustomInputChange ? onCustomInputChange : undefined}
        />
      </span>
    </div>
  );
};

const ListingCart = () => {
  const { state, setListingCart, setLoadingCart } = useAppContext();
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);
  const router = useRouter();

  const handleRefreshCart = () => {
    setListingCart([]);
  };

  const handleBulkListing = () => {
    const handleSequencePromises = async () => {
      let boughtAssets = [];
      for (let asset of state.listingCart) {
        if (!asset[asset.selectedValuation]) return;

        await handleNFTAction({
          type: 'SELL',
          price: asset[asset.selectedValuation] * 1000000,
          assetId: asset.asset_id,
          isHex: 'false',
          tier: 'JPG',
          onError: (err) => {
            showFeedback({
              open: true,
              message: err,
              duration: 2000,
              kind: 'error',
            });
          },
          onSuccess: async (txHash, signedTx) => {
            showFeedback({
              open: true,
              message: `TX SUBMITTED ${txHash}`,
              duration: 2000,
              kind: 'success',
            });
            try {
              await axios.post(
                'https://server.jpgstoreapis.com/transaction/register',
                {
                  txHash,
                  assetId: asset.asset_id,
                  signedTx, // !IMPORTANT: Relies on Server PR
                }
              );
            } catch (err) {
              console.log(err);
            }
            try {
              eventTrack('listing', asset.asset_id, asset.price);
            } catch (err) {}
            boughtAssets.push(asset.asset_id);
          },
          isMobile: state.isMobile,
        });
      }

      setListingCart(
        state.listingCart.filter(
          (asset) => !boughtAssets.includes(asset.asset_id)
        )
      );
    };

    handleSequencePromises();
  };

  const total = useMemo(
    () =>
      state.listingCart
        .filter((asset) => !isNaN(asset[asset.selectedValuation]))
        .reduce((acc, curr) => {
          return acc + (curr[curr.selectedValuation] || 0);
        }, 0)
        .toLocaleString(),
    [state.listingCart]
  );

  const handleListAll = (valueBy) => {
    const newCart = state.listingCart.map((item) => {
      return { ...item, selectedValuation: valueBy };
    });
    setListingCart(newCart);
  };

  useEffect(() => {
    handleAllValuations();
  }, [state.listingCart.length]);

  const handleAllValuations = async () => {
    setLoadingCart(true);
    try {
      const valuations = await Promise.all(
        state.listingCart
          .filter((asset) => !asset.floorValuation)
          .map((asset) =>
            getSingleAssetInfo(hexifyAssetId(asset.asset_id)).then((asset) => {
              const traitfloors = Object.values(asset?.traitfloors)
                .map((traitfloor) => {
                  const [floor] = Object.entries(traitfloor);
                  return floor?.[1] || 0;
                })
                .filter((floor) => floor > 0);
              const floorValuation = parseInt(asset.floor);
              const averageValuation = parseInt(
                traitfloors.reduce((a, b) => a + b, 0) / traitfloors.length
              );
              const topValuation = parseInt(
                traitfloors.reduce((a, b) => (a > b ? a : b), 0)
              );

              const assetWithValuation = {
                ...asset,
                name: asset.asset_name,
                averageValuation: Math.max(averageValuation || 5, 5),
                floorValuation: Math.max(floorValuation || 5, 5),
                topValuation: Math.max(topValuation || 5, 5),
                selectedValuation: 'averageValuation',
              };

              return assetWithValuation;
            })
          )
      );

      setListingCart([
        ...state.listingCart.filter((asset) => asset.floorValuation),
        ...valuations,
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCart(false);
    }
  };

  if (state.listingCart.length === 0) {
    return (
      <Box
        sx={{
          p: 1,
          display: 'flex',
          textAlign: 'center',
          flexDirection: 'column',
          rowGap: 0.5,
          py: '20px',
        }}
      >
        <Box sx={{ fontSize: 18 }}>Cart is empty. </Box>
        <span
          onClick={() => router.push(`/addresses/${state.walletInfo.address}`)}
          style={{
            fontSize: 16,
            color: 'var(--logoColor)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          - Go to portfolio page
        </span>
        <span style={{ fontSize: 14 }}>- Hover over asset</span>
        <span style={{ fontSize: 14 }}>
          - Click plus in the top left corner to add
        </span>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderBottom: '1px solid var(--shadowColor)',
          padding: '20px',
        }}
      >
        {state.listingCart.map((asset, index) => (
          <CartListItem key={asset.asset_id + index} asset={asset} />
        ))}
      </Box>

      <Box sx={{ p: '20px 20px 31px 20px' }}>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: '14px',
                  fontFamily: 'newgilroymedium',
                }}
              >
                Listing:
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: '14px',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {state.listingCart.length} NFTs
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: '14px',
                  fontFamily: 'newgilroymedium',
                }}
              >
                Value:
              </Typography>
              <div style={{ display: 'flex' }}>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 400,
                    lineHeight: '20px',
                    fontFamily: 'Helvetica',
                  }}
                >
                  ₳
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: '20px',
                    fontFamily: 'newgilroymedium',
                  }}
                >
                  {total.toLocaleString()}
                </Typography>
              </div>
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{
              padding: '12px 33px',
              fontSize: 14,
              lineHeight: 'initial',
              fontWeight: 600,
              borderRadius: '10px',
              textTransform: 'unset',
            }}
            onClick={handleBulkListing}
            disabled={total === 0 || state.loadingCart}
          >
            {loadingNFTAction ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                  columnGap: 1,
                }}
              >
                <span>Creating txs.. </span>
                <CircularProgress size={12} sx={{ color: 'white' }} />
              </Box>
            ) : total === 0 ? (
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: '14px',
                  fontFamily: 'newgilroymedium',
                  letterSpacing: '-0.35px',
                }}
              >
                Select valuation type
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: '17px',
                  fontFamily: 'newgilroymedium',
                  letterSpacing: '-0.35px',
                }}
              >
                List all
              </Typography>
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ListingCart;
