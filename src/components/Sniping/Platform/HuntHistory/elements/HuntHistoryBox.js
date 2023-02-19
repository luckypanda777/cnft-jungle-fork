import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { shorten } from 'utils/shorten';
import { Avatar, Box, Button, IconButton, ListItemAvatar } from '@mui/material';
import useWindowSize from 'hooks/useWindowSize';
import moment from 'moment';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CustomTooltip from 'components/common/CustomTooltip';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useContext } from 'react';
import { createHunt } from 'apiProvider';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const HuntHistoryBox = ({ hunt, onClick, sx = {} }) => {
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { huntList },
    setSearches,
  } = useContext(SearchContext);

  const asset = {
    assetID: hunt.history?.assetId,
    assetName: hunt.history?.name,
    assetImage: hunt.history?.image,
    price: hunt.history?.price,
    timestamp: hunt.createdAt,
  };

  console.log(hunt);

  const handleRecreateHunt = async () => {
    const collection = hunt.rules.find((rule) => rule.label === 'collection');

    if (!collection.value?.name) {
      return showFeedback({
        message: 'Please choose a collection',
        kind: 'error',
      });
    }

    return await createHunt(hunt)
      .then(({ hunt: newHunt }) => {
        console.log('Hunt created');
        showFeedback({
          message: 'Hunt created!',
          kind: 'success',
          duration: 2000,
        });
        setSearches([newHunt, ...huntList]);
      })
      .catch((err) => {
        console.log(err);
        showFeedback({
          message: 'Hunt create error!',
          kind: 'error',
          duration: 2000,
        });
      });
  };
  const { width } = useWindowSize();

  if (!asset) return null;

  return (
    <Box
      sx={{
        flex: 1,
        p: 1,
        pr: 3,
        display: 'flex',
        alignItems: 'center',
        columnGap: 1,
        border: '2px solid #29292B',
        borderRadius: 2,
        minWidth: width < 1200 ? '100%' : '30%',
        width: 'fit-content',
        justifyContent: 'flex-start',
        ...sx,
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={asset.assetImage}
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
          gap: 1,
          width: '100%',
          pl: 1,
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
          <span style={{ fontSize: 17, fontFamily: 'newgilroysemibold' }}>
            {shorten(asset.assetName, width < 900 ? 20 : 24)}
          </span>
          <Box>
            <CustomTooltip
              placement="top"
              title="Restart the hunt with same rules that got this asset"
            >
              <IconButton
                sx={{ color: 'var(--fontColor)' }}
                onClick={handleRecreateHunt}
              >
                <RestartAltIcon />
              </IconButton>
            </CustomTooltip>
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
              }}
              onClick={() =>
                onClick({
                  ...asset,
                  asset_id: asset.assetID,
                  optimized_image: asset.assetImage,
                  asset_name: asset.assetName,
                  asset_num: asset.assetNumber,
                })
              }
            >
              Details
            </WalletButtonBase>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            columnGap: 0.5,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontFamily: 'newgilroybold',
            }}
          >
            {asset.price} ADA
            {hunt.isAutoBuy && (
              <CustomTooltip title="Sniped using auto-buy">
                <IconButton
                  aria-label="autobuy"
                  sx={{
                    color: 'var(--fontColor)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <AttachMoneyIcon fontSize="medium" color="primary" />
                </IconButton>
              </CustomTooltip>
            )}
          </span>
          <span style={{ fontSize: 14, color: '#BDBEC6' }}>
            {moment.utc(asset.timestamp).local().format('DD MMM YYYY: HH:mm')}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default HuntHistoryBox;
