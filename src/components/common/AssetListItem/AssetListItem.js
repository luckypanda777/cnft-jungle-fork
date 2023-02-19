import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  Box,
  Divider,
} from '@mui/material';
import { getRarestTrait } from 'utils/getRarestTrait';
import { isMobile } from 'react-device-detect';
import { shorten } from 'utils/shorten';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import useFormatDate from 'hooks/useFormatDate';

const AssetListItem = ({
  index,
  onClick,
  asset,
  loading,
  sortOrFilerLoading,
  isLast,
  collectionTraits = {},
  collectionSupply,
  isSale,
}) => {
  const { formatDate } = useFormatDate();
  if (loading || sortOrFilerLoading) {
    return (
      <>
        <ListItem sx={{ height: 75 }}>
          <ListItemText>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </ListItemText>
        </ListItem>
        {!isLast && <Divider />}
      </>
    );
  }

  const rarestTrait = getRarestTrait({
    assetTraits: asset.traits,
    collectionTraits,
    collectionSupply,
  });

  return (
    <>
      <ListItem>
        <ListItemButton
          onClick={onClick}
          sx={{ minWidth: 150, maxWidth: 300, padding: isMobile ? 0 : 'auto' }}
        >
          <ListItemAvatar>
            <Avatar
              src={imgLinkReplace(asset.optimized_image || asset.image)}
              alt={asset.name}
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
                nextImg
                layout="fill"
              />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            sx={{ wordBreak: 'break-word !important' }}
            primary={isMobile ? '#' + asset.asset_num : asset.name}
            primaryTypographyProps={{
              fontWeight: 'bold',
              color: 'var(--fontColor)',
              fontSize: isMobile ? 14 : 16,
            }}
            secondary={
              asset.rarity_rank ? asset.rarity_rank + ' Rank' : 'No Rank'
            }
          />
        </ListItemButton>

        <ListItemText
          primary={
            <span style={{ fontWeight: 'bold' }}>
              {isMobile
                ? shorten(rarestTrait.displayText, 25)
                : rarestTrait.displayText}
            </span>
          }
          primaryTypographyProps={{
            fontSize: isMobile ? 12 : 16,
            color: 'var(--fontColor)',
            textAlign: isMobile ? 'center' : 'right',
            fontFamily: 'newgilroymedium',
          }}
        />

        {!isSale ? (
          <ListItemText
            onClick={() =>
              asset.listing_link && window.open(asset.listing_link, '_blank')
            }
            sx={{ cursor: 'pointer' }}
            primary={
              <span>
                {asset.listing_price
                  ? asset.listing_price + ' ADA'
                  : 'Not listed'}
              </span>
            }
            secondary={<span>{asset.listing_marketplace}</span>}
            primaryTypographyProps={{
              fontWeight: 'bold',
              color: 'var(--fontColor)',
              fontSize: isMobile ? 12 : 16,
              textAlign: 'right',
            }}
            secondaryTypographyProps={{
              color: 'var(--fontColor)',
              fontSize: 12,
              textAlign: 'right',
            }}
          />
        ) : (
          <ListItemText
            primary={
              <span>
                {asset.sold_for ? asset.sold_for + ' ADA' : 'Not listed'}
              </span>
            }
            secondary={<span>{formatDate(asset.sold_at)}</span>}
            primaryTypographyProps={{
              fontWeight: 'bold',
              color: 'var(--fontColor)',
              fontSize: isMobile ? 12 : 16,
              textAlign: 'right',
            }}
            secondaryTypographyProps={{
              color: 'var(--fontColor)',
              fontSize: isMobile ? 10 : 14,
              textAlign: 'right',
            }}
          />
        )}
      </ListItem>
      {!isLast && <Divider />}
    </>
  );
};

export default AssetListItem;
