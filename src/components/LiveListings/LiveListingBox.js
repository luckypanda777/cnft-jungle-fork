import { useContext, useEffect, useState } from 'react';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import useNFTAction from 'hooks/useNFTAction';
import { shorten } from 'utils/shorten';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  ListItemAvatar,
  Skeleton,
} from '@mui/material';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';

const LiveListingBox = ({ asset, onClick, sx = {}, loading, tier }) => {
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { isMobile },
  } = useAppContext();
  const { width } = useWindowSize();

  if (loading || !asset) {
    return (
      <Box
        sx={{
          width: '44%',
          minWidth: 200,
          maxWidth: 300,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          columnGap: 1,
          border: '3px solid var(--assetsBg)',
          borderRadius: 2,
          ...sx,
        }}
      >
        <Skeleton
          variant="rect"
          width={50}
          height={50}
          sx={{ borderRadius: 2 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 0.5,
          }}
        >
          <Skeleton variant="text" width={100} height={25} />
          <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
            <Skeleton variant="rect" width={80} height={25} />
            <Skeleton variant="rect" width={80} height={25} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: isMobile || width < 900 ? '100%' : '44%',
        minWidth: 300,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        columnGap: 0.5,
        border: '2px solid var(--assetsBg)',
        borderRadius: 2,
        width: '100%',
        ...sx,
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={imgLinkReplace(asset.assetImage)}
          alt={asset.assetName}
          sx={{ ...avatarStyle, width: 60, height: 60 }}
        >
          <ImageWithErrorHandler
            src="assets/catunsupported.webp"
            alt="unsupported"
            style={{
              width: 60,
              height: 60,
              objectFit: 'var(--objectFit)',
            }}
            nextImg
            layout="fill"
          />
        </Avatar>
      </ListItemAvatar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 0.5,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box style={{ fontSize: isMobile ? 16 : 18, flex: 11 }}>
            {shorten(asset.assetName, 16)}
          </Box>
          <BookmarkedBadge
            kind="asset"
            identifier={asset.assetID}
            additionalInfo={{
              image: asset.assetImage,
              name: asset.assetName,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            columnGap: 0.5,
            width: '100%',
          }}
        >
          <WalletButtonBase
            sx={{
              fontSize: width < 1200 ? 10 : 12,
              borderRadius: 1,
              height: 25,
              minWidth: 'auto',
              maxWidth: 'max-content',
              border: '2px solid var(--logoColor)',
              backgroundColor: 'transparent',
              color: 'var(--whiteColor)',
              '&:disabled': {
                border: '2px solid var(--logoColor)',
              },
              '&:hover': {
                backgroundColor: 'var(--logoColor)',
                color: 'var(--whiteColor)',
                border: '2px solid var(--logoColor)',
              },
              fontFamily: 'newgilroymedium',
            }}
            disabled={!asset.price || loadingNFTAction}
            variant="outlined"
            size="small"
            onClick={() => {
              try {
                handleNFTAction({
                  type: 'BUY',
                  price: asset.price,
                  assetId: asset.assetID,
                  isHex: 'false',
                  tier: tier || 'SNIPE',
                  onError: (err) => {
                    showFeedback({
                      open: true,
                      message: err,
                      duration: 2000,
                      kind: 'error',
                    });
                  },
                  onSuccess: (txHash) => {
                    showFeedback({
                      open: true,
                      message: `TX SUBMITTED ${txHash}`,
                      duration: 2000,
                      kind: 'success',
                    });
                    try {
                      eventTrack('purchase', asset.assetID, asset.price);
                    } catch (err) {}
                  },
                  onFallback: () =>
                    asset.link && window.open(asset.link, '_blank'),
                  isMobile,
                });
              } catch (err) {
                console.log(err);
                asset.link && window.open(asset.link, '_blank');
              }
            }}
          >
            {loadingNFTAction ? (
              <CircularProgress size={14} sx={{ color: 'white' }} />
            ) : (
              <span
                style={{
                  fontSize: asset.price / 1000000 > 1000000 ? 10 : 12,
                }}
              >
                {asset.price
                  ? `${width < 1200 ? '' : 'Buy'} ${parseInt(
                      asset.price / 1000000
                    )} ADA`
                  : 'Not Listed'}
              </span>
            )}
          </WalletButtonBase>
          <WalletButtonBase
            sx={{
              width: width < 1200 ? 80 : 125,
              fontSize: width < 1200 ? 10 : 12,
              borderRadius: 1,
              height: 25,
              minWidth: 'auto',
              maxWidth: 80,
              border: '2px solid #29292B',
              backgroundColor: '#29292B',
              color: 'var(--whiteColor)',
              '&:disabled': {
                border: '2px solid #29292B',
              },
              '&:hover': {
                backgroundColor: '#29292B',
                color: 'var(--whiteColor)',
              },
              fontFamily: 'newgilroymedium',
            }}
            onClick={() =>
              onClick({
                ...asset,
                asset_id: asset.assetID,
                optimized_image: asset.assetImage,
                asset_name: asset.assetName,
                asset_num: asset.assetNumber,
                price: asset.price / 1000000,
              })
            }
          >
            Details
          </WalletButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveListingBox;
