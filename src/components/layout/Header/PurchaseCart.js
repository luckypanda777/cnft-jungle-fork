import React, { useContext, useRef, useState, useEffect, useMemo } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useAppContext } from 'context/AppContext';
import {
  IconButton,
  Box,
  Divider,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TrendingBoxBuy } from 'components/boxes/BookmarkBoxes';
import useNFTAction from 'hooks/useNFTAction';
import CustomTooltip from 'components/common/CustomTooltip';
import { useRouter } from 'next/router';

const PurchaseCart = () => {
  const { state, setCart } = useAppContext();
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);

  const router = useRouter();

  const handleRefreshCart = () => {
    setCart([]);
  };

  const handleBulkPurchase = () => {
    const handleSequencePromises = async () => {
      let boughtAssets = [];
      for (let asset of state.cart) {
        await handleNFTAction({
          type: 'BUY',
          price: asset.price * 1000000,
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
          onSuccess: async (txHash, singedTx) => {
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
              eventTrack('purchase', asset.asset_id, asset.price);
            } catch (err) {}
            boughtAssets.push(asset.asset_id);
          },
          isMobile: state.isMobile,
        });
      }

      setCart(
        state.cart.filter((asset) => !boughtAssets.includes(asset.asset_id))
      );
    };

    handleSequencePromises();
  };

  const total = useMemo(() => {
    return state.cart
      .reduce((acc, curr) => {
        return acc + curr.price;
      }, 0)
      .toLocaleString();
  }, [state.cart]);

  if (state.cart.length === 0) {
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
        <span style={{ fontSize: 14 }}>- Go to any collection page</span>
        <span style={{ fontSize: 14 }}>- Hover over asset</span>
        <span style={{ fontSize: 14 }}>
          - Click plus in the top left corner to add
        </span>
      </Box>
    );
  }

  return (
    <>
      {/* <Box
        sx={{
          backgroundColor: 'green',
          padding: '20px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <span style={{ fontSize: 16, textAlign: 'center' }}>
          Buying {state.cart.length} NFTs with value of {total || '-'} ADA
        </span>
      </Box> */}
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          py: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          borderBottom: '1px solid var(--shadowColor)',
        }}
      >
        {state.cart.map((asset, index) => {
          return (
            <Box key={index} style={{ padding: '0 20px' }}>
              <TrendingBoxBuy
                option={asset}
                tertiaryValue={`#${asset.asset_num}`}
                buyValue={`${asset.price?.toLocaleString()} ADA`}
                showColor={false}
                identifier={asset.asset_id}
                showIcons={['remove']}
                style={{
                  // width: 450,
                  cursor: 'auto',
                }}
                labelLength={20}
                onRemove={() => {
                  setCart(
                    state.cart.filter(
                      (cartAsset) => cartAsset.asset_id !== asset.asset_id
                    )
                  );
                }}
              />
              {/* <Divider sx={{ width: '95%', mx: 'auto' }} /> */}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ p: '20px' }}>
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
                mb: '5px',
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
                Total
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: '14px',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {state.cart.length} NFTs
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
            onClick={handleBulkPurchase}
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
                Buy all
              </Typography>
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PurchaseCart;
