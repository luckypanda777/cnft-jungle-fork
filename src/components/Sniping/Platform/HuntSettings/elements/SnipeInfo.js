import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import moment from 'moment';
import { Box } from '@mui/material';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { shorten } from 'utils/shorten';
import CustomTooltip from 'components/common/CustomTooltip';
import { capitalize } from 'lodash';

const SnipeInfo = ({ snipe }) => {
  const { name, image, price, timestamp, type } = snipe;
  console.log(snipe);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        color: 'var(--fontColor)',
      }}
    >
      <span
        style={{
          color:
            type === 'price'
              ? 'goldenrod'
              : type === 'rarity'
              ? 'var(--logoColor)'
              : type === 'rarity'
              ? 'var(--primaryColor)'
              : 'var(--slightlyUndervaluedColor)',
        }}
      >
        {capitalize(type)}
      </span>

      <CustomTooltip
        title={
          <img
            src={imgLinkReplace(image)}
            alt={name}
            width={150}
            height={150}
            style={{ borderRadius: 6 }}
          />
        }
      >
        <ListItemAvatar sx={{ pl: 1 }}>
          <img
            src={imgLinkReplace(image)}
            alt={name}
            width={40}
            height={40}
            style={{ borderRadius: 6 }}
          />
        </ListItemAvatar>
      </CustomTooltip>
      <ListItemText
        sx={{ my: 0, textAlign: 'left' }}
        primaryTypographyProps={{
          fontFamily: 'newgilroymedium',
          pl: 1,
          fontSize: 12,
        }}
        secondaryTypographyProps={{
          fontFamily: 'newgilroymedium',
          pl: 1,
          fontSize: 11,
        }}
        primary={
          <CustomTooltip title={name} placement="top">
            <span style={{ fontSize: 13 }}>{shorten(name, 50)}</span>
          </CustomTooltip>
        }
        secondary={
          <CustomTooltip title="Hunt start time" placement="bottom">
            <span style={{ fontSize: 12 }}>
              Sniped at{' '}
              {timestamp
                ? moment(timestamp).format('DD/MM/YYYY')
                : 'Not registered date'}
            </span>
          </CustomTooltip>
        }
      />
      <ListItemText
        sx={{ my: 0 }}
        primaryTypographyProps={{
          fontFamily: 'newgilroymedium',
          px: 1,
          fontSize: 12,
          textAlign: 'right',
        }}
        primary={<span style={{ fontSize: 13 }}>{price} ADA</span>}
      />
    </Box>
  );
};

export default SnipeInfo;
