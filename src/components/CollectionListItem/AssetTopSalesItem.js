import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import { default as MuiSkeleton } from '@mui/material/Skeleton';
import DefaultListItemText from './ListItemText';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { shorten } from 'utils/shorten';
import { nFormatter } from 'utils/formatCurrency';
import { BrowserView, MobileView } from 'react-device-detect';
import unsupported from 'assets/catunsupported.webp';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import moment from 'moment';
import { getRarestTrait } from 'utils/getRarestTrait';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import useFormatDate from 'hooks/useFormatDate';
import { TrendingBox } from 'components/boxes/BookmarkBoxes/BookmarkBoxes';

const Skeleton = styled(MuiSkeleton)(() => ({
  backgroundColor: 'var(--skeletonColor)',
}));

const AssetTopSalesItem = ({
  asset = {},
  loading,
  sortOrFilerLoading,
  isLast,
  onClick = undefined,
  showTime = false,
  infiniteBox = false,
  bookmarks = true,
}) => {
  const router = useRouter();
  const { formatDate } = useFormatDate();

  const handleClick = (e) => {
    if (onClick && typeof onClick === 'function') {
      return onClick(e);
    }

    const link = `/collections/${asset.asset_id.split('.')[0]}/?assetId=${
      asset.asset_id
    }`;

    if (e.metaKey) {
      return window.open(link, '_blank');
    }

    if (asset) {
      router.push(link);
    }
  };

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

  if (bookmarks) {
    return (
      <>
        <TrendingBox
          option={{
            label:
              asset.name ||
              asset.asset_name ||
              asset.policy_id ||
              asset.asset_id?.split('.')[1],
            image: asset.optimized_image || asset.image,
          }}
          primaryValue={`₳${asset.price?.toLocaleString()}`}
          secondaryValue={asset.marketplace}
          tertiaryValue={
            showTime &&
            `Sold at: ${
              moment(asset.sold_at || asset.time).format(
                'DD/MM/YYYY HH:mm UTC'
              ) || 'N/A'
            }`
          }
          showColor={false}
          identifier={asset.asset_id}
          type="asset"
          onClick={handleClick}
          labelLength={10}
          textCut="middlen"
        />{' '}
        <Divider sx={{ width: '95%', mx: 'auto' }} />
      </>
    );
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
      <BrowserView>
        <ListItem
          onClick={handleClick}
          sx={{
            ':hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
            },
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            height: 80,
            p: { xs: 1, sm: 1, md: 1 },
          }}
        >
          <ListItemAvatar>
            {!asset.image && !asset.optimized_image ? (
              <Avatar
                src={asset.optimized_image || asset.image}
                alt={asset.asset_name}
                sx={avatarStyle}
              >
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
              <Avatar alt={asset.asset_name} sx={avatarStyle}>
                <ImageWithErrorHandler
                  src={imgLinkReplace(asset.optimized_image || asset.image)}
                  onchain_data={asset.onchain_data}
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
          <ListItemText
            sx={{
              width: {
                xs: 200,
                md: 200,
                wordWrap: 'break-word',
                fontFamily: 'newgilroymedium',
              },
            }}
            primary={shorten(
              asset.name ||
                asset.asset_name ||
                asset.policy_id ||
                asset.asset_id.split('.')[1],
              28
            )}
            primaryTypographyProps={{
              fontFamily: 'newgilroymedium',
              fontWeight: 'bold',
              color: 'var(--fontColor)',
              fontSize: 14,
            }}
          />
          {infiniteBox ? (
            <>
              {asset.price && (
                <ListItemText
                  sx={{
                    width: { xs: 160, md: 160, wordWrap: 'break-word' },
                    textAlign: 'right',
                  }}
                  primary={
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      ₳{asset.price.toLocaleString()}
                    </div>
                  }
                  primaryTypographyProps={{
                    fontFamily: 'newgilroymedium',
                    fontWeight: 'bold',
                    color: 'var(--fontColor)',
                    fontSize: 14,
                  }}
                  secondary={
                    <div style={{ fontSize: 14 }}>{asset.marketplace}</div>
                  }
                />
              )}
            </>
          ) : (
            <>
              {asset.price && (
                <ListItemText
                  sx={{ width: { xs: 160, md: 160, wordWrap: 'break-word' } }}
                  primary={
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {asset.price.toLocaleString()} ADA
                    </div>
                  }
                  primaryTypographyProps={{
                    fontFamily: 'newgilroymedium',
                    fontWeight: 'bold',
                    color: 'var(--fontColor)',
                    fontSize: 14,
                  }}
                />
              )}
              {showTime && (
                <ListItemText>
                  <span style={{ fontSize: 14 }}>
                    {formatDate(asset.sold_at || asset.time)}
                  </span>
                </ListItemText>
              )}
              <ListItemText sx={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14 }}>{asset.marketplace}</div>
              </ListItemText>
            </>
          )}
        </ListItem>
      </BrowserView>
      <MobileView>
        <ListItem
          onClick={handleClick}
          sx={{
            ':hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
            },
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            height: 80,
            p: { xs: 1, sm: 1, md: 3 },
          }}
        >
          <ListItemAvatar>
            {!asset.image && !asset.optimized_image ? (
              <Avatar
                src={asset.optimized_image || asset.image}
                alt={asset.asset_name}
                sx={avatarStyle}
              >
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
              <Avatar alt={asset.asset_name} sx={avatarStyle}>
                <ImageWithErrorHandler
                  src={imgLinkReplace(asset.optimized_image || asset.image)}
                  onchain_data={asset.onchain_data}
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
          <ListItemText
            sx={{ width: { xs: 200, md: 200, wordWrap: 'break-word' } }}
            primary={shorten(asset.asset_name || asset.policy_id, 35)}
            primaryTypographyProps={{
              fontFamily: 'newgilroymedium',
              fontWeight: 'bold',
              color: 'var(--fontColor)',
              fontSize: 16,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}
          >
            {infiniteBox ? (
              <>
                {asset.price && (
                  <ListItemText
                    sx={{
                      width: { xs: 160, md: 160, wordWrap: 'break-word' },
                      textAlign: 'right',
                    }}
                    primary={`₳${asset.price.toLocaleString()}`}
                    primaryTypographyProps={{
                      fontFamily: 'newgilroymedium',
                      fontWeight: 'bold',
                      color: 'var(--fontColor)',
                      fontSize: 16,
                    }}
                    secondary={
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {asset.marketplace}
                      </div>
                    }
                  />
                )}
              </>
            ) : (
              <>
                {asset.price && (
                  <ListItemText
                    sx={{ width: { xs: 160, md: 160, wordWrap: 'break-word' } }}
                    primary={
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {asset.price.toLocaleString()} ADA
                      </div>
                    }
                    primaryTypographyProps={{
                      fontFamily: 'newgilroymedium',
                      fontWeight: 'bold',
                      color: 'var(--fontColor)',
                      fontSize: 16,
                    }}
                  />
                )}
                {showTime && (
                  <ListItemText>
                    <span style={{ fontSize: 14 }}>
                      {formatDate(asset.sold_at || asset.time)}
                    </span>
                  </ListItemText>
                )}
                <ListItemText sx={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14 }}>{asset.marketplace}</div>
                </ListItemText>
              </>
            )}
          </Box>
        </ListItem>
      </MobileView>
      {!isLast && <Divider sx={{ width: '100%' }} />}
    </>
  );
};

export default AssetTopSalesItem;
