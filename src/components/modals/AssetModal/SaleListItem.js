import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import moment from 'moment';
import React from 'react';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import useFormatDate from 'hooks/useFormatDate';

const SaleListItem = ({
  optimized_image,
  image,
  marketplace,
  price,
  time,
  sold_at,
  asset_id,
  isLast,
  loading,
}) => {
  const { formatDate } = useFormatDate();
  if (marketplace === 'jpgstore') {
    marketplace = 'jpg.store';
  }

  if (loading) {
    return (
      <>
        <ListItem sx={{ height: 80 }}>
          <ListItemText>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </ListItemText>
        </ListItem>
        {!isLast && <Divider sx={{ width: '100%' }} />}
      </>
    );
  }

  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          textAlign: 'center',
          borderRadius: 1,
          px: 3,
        }}
      >
        <ListItemAvatar>
          {!(optimized_image || image) ? (
            <Avatar src={image} alt="asset" sx={avatarStyle}>
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  width: 45,
                  height: 45,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar alt="asset" sx={avatarStyle}>
              <ImageWithErrorHandler
                src={imgLinkReplace(optimized_image || image)}
                alt="unsupported"
                style={{
                  width: 45,
                  height: 45,
                  objectFit: 'var(--objectFit)',
                }}
                nextImg
                layout="fill"
              />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {asset_id.split('.')[1]}
        </ListItemText>
        <ListItemText sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {price.toLocaleString()} ADA
        </ListItemText>
        <ListItemText
          sx={{ fontWeight: 'bold', textAlign: 'right' }}
          primary={formatDate(sold_at || time)}
          secondary={marketplace}
        />
      </ListItem>
      {!isLast && <Divider sx={{ width: '100%', mt: 0.2 }} />}
    </>
  );
};

export default SaleListItem;
