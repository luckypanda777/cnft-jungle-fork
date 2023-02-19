import { useContext } from 'react';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import useNFTAction from 'hooks/useNFTAction';
import { middlen, shorten } from 'utils/shorten';
import {
  Avatar,
  Box,
  Button,
  capitalize,
  Chip,
  CircularProgress,
  ListItemAvatar,
} from '@mui/material';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';

const LiveHuntBox = ({ asset, onClick, sx = {} }) => {
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { isMobile },
  } = useAppContext();
  const { width } = useWindowSize();

  return (
    <Box
      sx={{
        flex: 1,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        columnGap: 1,
        border: '3px solid var(--lightGrey)',
        borderRadius: 2,
        minWidth: width < 1200 ? '100%' : '23%',
        maxWidth: width < 1200 ? '100%' : '23%',
        width: 'fit-content',
        justifyContent: 'flex-start',
        ...sx,
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={imgLinkReplace(asset.assetImage)}
          alt={asset.assetName}
          sx={{ ...avatarStyle, width: 75, height: 75 }}
        >
          <ImageWithErrorHandler
            src="assets/catunsupported.webp"
            alt="unsupported"
            style={{
              width: 75,
              height: 75,
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
          alignItems: 'flex-start',
          rowGap: 0.5,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            columnGap: 0.5,
          }}
        >
          <span style={{ fontSize: 16 }}>
            {shorten(asset.assetName, width < 900 ? 20 : 26)}
          </span>
        </Box>
        {asset.huntLabel && (
          <span style={{ fontSize: 14 }}>{middlen(asset.huntLabel, 15)}</span>
        )}
        <Box
          sx={{
            display: 'flex',
            columnGap: 0.5,
            width: '100%',
          }}
        >
          <Button
            disabled={loadingNFTAction}
            variant="contained"
            size="small"
            sx={{
              width: width < 1200 ? 80 : 100,
              fontSize: width < 1200 ? 12 : 12,
              width: '50%',
              fontFamily: 'newgilroybold',
              color: 'var(--fontColor)',
              '&:hover': {
                backgroundColor: 'var(--logoColor)',
                color: 'var(--fontColor)',
              },
            }}
            onClick={() => {
              try {
                handleNFTAction({
                  type: 'BUY',
                  price: asset.price,
                  assetId: asset.assetID,
                  isHex: 'false',
                  tier: 'SNIPE',
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
              `${parseInt(asset.price / 1000000)} ADA`
            )}
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              width: width < 1200 ? 80 : 100,
              fontSize: width < 1200 ? 10 : 12,
              width: '50%',
              fontFamily: 'newgilroysemibold',
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
            }}
            onClick={() =>
              onClick({
                ...asset,
                asset_id: asset.assetID,
                optimized_image: asset.assetImage,
                asset_name: asset.assetName,
                asset_num: asset.assetNumber,
                listing_price: asset.price / 1000000,
                isSnipe: true,
              })
            }
          >
            {width < 1200 ? 'Info' : 'Details'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveHuntBox;
