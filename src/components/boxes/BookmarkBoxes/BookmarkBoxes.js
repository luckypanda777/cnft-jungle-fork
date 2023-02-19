import {
  Avatar,
  Box,
  Divider,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import AddressBadge from 'components/badges/AddressBadge';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { AddressLink } from 'components/Portfolio/data/mockAssets';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import { useAppContext } from 'context/AppContext';
import React from 'react';
import { parseCID } from 'utils/cardanoUtils';
import { avatarStyle, avatarStyleV2 } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { middlen, shorten } from 'utils/shorten';
import AddToCartBadge from 'components/badges/AddToCartBadge';
import ICRemove from 'assets/remove.svg';

const SearchBox = ({
  key,
  option,
  onClick,
  showIcons = ['bookmark', 'verified', 'whale'],
  type = 'collection',
  identifier = '',
  style = {},
  labelLength = 10,
  border,
  isPrivate,
  showSupply,
}) => {
  const {
    state: { isMobile },
  } = useAppContext();
  const ipfsCID = parseCID(option.image);

  const Hidden = () =>
    false ? (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--primaryColor)',
          color: 'white',
          opacity: 0.975,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          zIndex: 100,
          border: '1px solid var(--primaryColor)',
        }}
      >
        <span style={{ opacity: 1 }}>Private</span>
      </Box>
    ) : null;

  if (type === 'wallet') {
    return (
      <Box sx={{ position: 'relative' }}>
        <Hidden />
        <Box
          key={key}
          sx={{
            height: 30,
            py: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bgColor)',
            borderRadius: 2,
            px: 1,
            cursor: 'pointer',
            border: border ? '1px solid var(--primaryColor)' : 'none',
            ...style,
          }}
          onClick={onClick}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <AddressLink
              length={15}
              address="addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z"
            />
          </Box>
          {showIcons.length > 0 && (
            <>
              <Divider
                orientation="vertical"
                sx={{
                  width: '1px',
                  height: 35,
                  my: 'auto',
                  mx: 0.5,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showIcons.includes('bookmark') && (
                  <BookmarkedBadge
                    identifier={identifier}
                    kind={type}
                    width={22}
                    additionalInfo={{
                      name: option.label || option.name,
                      image: option.image,
                    }}
                  />
                )}
                {showIcons.includes('whale') && (
                  <AddressBadge type="orca" width={20} />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      key={key}
      sx={{
        height: 60,
        py: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 2,
        px: 1,
        cursor: 'pointer',
        border: border ? '1px solid var(--primaryColor)' : 'none',
        position: 'relative',
        ...style,
      }}
    >
      <Hidden />
      <Box
        sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}
        onClick={onClick}
      >
        <ListItemAvatar>
          {!option.image ? (
            <Avatar
              src={option.image}
              alt={option.label || option.name}
              sx={{ ...avatarStyle, backgroundColor: 'transparent' }}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  borderRadius: '8px',
                  width: 45,
                  height: 45,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar
              alt={option.label || option.name}
              sx={{ ...avatarStyle, backgroundColor: 'transparent' }}
            >
              <ImageWithErrorHandler
                src={ipfsCID ? imgLinkReplace(option.image) : option.image}
                style={{
                  borderRadius: '8px',
                  width: 40,
                  height: 40,
                  objectFit: 'var(--objectFit)',
                  marginRight: 10,
                }}
              />
            </Avatar>
          )}
        </ListItemAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ display: 'flex', minWidth: 0 }}>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {middlen(option.label || option.name, isMobile ? 8 : labelLength)}
            </Typography>
            {showIcons.length > 0 && (
              <>
                {/* <Divider
            orientation="vertical"
            sx={{
              width: '1px',
              height: 35,
              my: 'auto',
              mx: 0.5,
            }}
          /> */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingLeft: '3px',
                  }}
                >
                  {showIcons.includes('bookmark') && (
                    <BookmarkedBadge
                      identifier={identifier}
                      kind={type}
                      width={15}
                      additionalInfo={{
                        name: option.label || option.name,
                        image: option.image,
                      }}
                    />
                  )}
                  {showIcons.includes('verified') && (
                    <VerifiedBadge verified={option.verified} width={15} />
                  )}
                </Box>
              </>
            )}
          </Box>
          {showSupply && (
            <Box
              sx={{
                display: 'flex',
                columnGap: 0.5,
                fontSize: 10,
                lineHeight: '12px',
                justifyContent: 'flex-start',
                textAlign: 'left',
                letterSpacing: '-0.25px',
                letterSpacing: 0.25,
                color: 'var(--rankGrey)',
              }}
            >
              <span>Supply:</span>
              <span>{option.supply || 0} NFTs</span>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const TrendingBox = ({
  key,
  option,
  onClick,
  showIcons = ['bookmark', 'verified', 'whale'],
  type = 'collection',
  style = {},
  labelLength = 10,
  primaryValue,
  secondaryValue,
  tertiaryValue,
  showColor,
  positiveChange,
  identifier,
  textCut = 'shorten',
  isOwned,
}) => {
  const ipfsCID = parseCID(option.image);

  return (
    <Box
      key={key}
      sx={{
        height: 60,
        py: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bgColor)',
        borderRadius: 2,
        px: 1,
        cursor: 'pointer',
        ...style,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', flex: 1 }}
        onClick={onClick}
      >
        <ListItemAvatar>
          {!option.image ? (
            <Avatar
              src={option.image}
              alt={option.label || option.name}
              sx={avatarStyle}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  borderRadius: '8px',
                  width: 45,
                  height: 45,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar alt={option.label || option.name} sx={avatarStyle}>
              <ImageWithErrorHandler
                src={ipfsCID ? imgLinkReplace(option.image) : option.image}
                style={{
                  borderRadius: '8px',
                  width: 45,
                  height: 45,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          )}
        </ListItemAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography
                sx={{ fontWeight: 500, wordBreak: 'break', fontSize: 14 }}
              >
                {textCut === 'middlen'
                  ? middlen(option.label || option.name, labelLength)
                  : shorten(option.label || option.name, labelLength)}
              </Typography>
              {tertiaryValue && (
                <Typography
                  sx={{
                    fontWeight: 500,
                    wordBreak: 'break',
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'var(--primaryColor)',
                    fontFamily: 'newgilroymedium',
                  }}
                >
                  {tertiaryValue}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              {primaryValue && (
                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                  {primaryValue}
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: 500,
                  wordBreak: 'break',
                  color: showColor
                    ? positiveChange
                      ? 'var(--undervaluedColor)'
                      : '#E74C3C'
                    : 'var(--fontColor)',
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {secondaryValue}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {showIcons.length > 0 && (
        <>
          <Divider
            orientation="vertical"
            sx={{
              width: '1px',
              height: 35,
              my: 'auto',
              mx: 0.5,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {showIcons.includes('bookmark') && (
              <BookmarkedBadge
                identifier={identifier}
                kind={type}
                width={22}
                additionalInfo={{
                  name: option.label || option.name,
                  image: option.image,
                }}
              />
            )}
            {showIcons.includes('cart') && (
              <AddToCartBadge asset={option} type={isOwned && 'sell'} />
            )}
            {/* <VerifiedBadge verified={option.verified} width={20} /> */}
          </Box>
        </>
      )}
    </Box>
  );
};

const TrendingBoxBuy = ({
  key,
  option,
  onClick,
  showIcons = ['bookmark', 'verified', 'whale'],
  type = 'collection',
  style = {},
  labelLength = 10,
  primaryValue,
  secondaryValue,
  tertiaryValue,
  showColor,
  positiveChange,
  identifier,
  textCut = 'shorten',
  isOwned,
  buyValue,
  onRemove,
}) => {
  const ipfsCID = parseCID(option.image);

  return (
    <Box
      key={key}
      sx={{
        height: 50,
        py: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          overflow: 'hidden',
        }}
        onClick={onClick}
      >
        <ListItemAvatar style={{ minWidth: 'unset', marginRight: '10px' }}>
          {!option.image ? (
            <Avatar
              src={option.image}
              alt={option.label || option.name}
              sx={avatarStyleV2}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  borderRadius: '8px',
                  width: 50,
                  height: 50,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar alt={option.label || option.name} sx={avatarStyleV2}>
              <ImageWithErrorHandler
                src={ipfsCID ? imgLinkReplace(option.image) : option.image}
                style={{
                  borderRadius: '8px',
                  width: 50,
                  height: 50,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          )}
        </ListItemAvatar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            marginRight: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: 0,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: '19px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {textCut === 'middlen'
                  ? middlen(option.label || option.name, labelLength)
                  : shorten(option.label || option.name, labelLength)}
              </Typography>
              {tertiaryValue && (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: '15px',
                    fontWeight: 'bold',
                    color: 'var(--primaryColor)',
                    fontFamily: 'newgilroymedium',
                    color: 'var(--grey)',
                  }}
                >
                  {tertiaryValue}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              {primaryValue && (
                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                  {primaryValue}
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: 500,
                  wordBreak: 'break',
                  color: showColor
                    ? positiveChange
                      ? 'var(--undervaluedColor)'
                      : '#E74C3C'
                    : 'var(--fontColor)',
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {secondaryValue}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {showIcons.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {showIcons.includes('bookmark') && (
              <BookmarkedBadge
                identifier={identifier}
                kind={type}
                width={22}
                additionalInfo={{
                  name: option.label || option.name,
                  image: option.image,
                }}
              />
            )}
            {showIcons.includes('cart') && (
              <AddToCartBadge asset={option} type={isOwned && 'sell'} />
            )}
            {showIcons.includes('remove') && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: '50px',
                }}
              >
                <ICRemove style={{ cursor: 'pointer' }} onClick={onRemove} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'var(--fontColor)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'newgilroymedium',
                    pb: '6px',
                  }}
                >
                  {buyValue}
                </Typography>
              </div>
            )}
            {/* <VerifiedBadge verified={option.verified} width={20} /> */}
          </Box>
        </>
      )}
    </Box>
  );
};

const TrendingBoxSell = ({
  key,
  option,
  onClick,
  showIcons = ['bookmark', 'verified', 'whale'],
  type = 'collection',
  style = {},
  labelLength = 10,
  primaryValue,
  secondaryValue,
  tertiaryValue,
  showColor,
  positiveChange,
  identifier,
  textCut = 'shorten',
  isOwned,
  onRemove,
}) => {
  const ipfsCID = parseCID(option.image);

  return (
    <Box
      key={key}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      <Box
        sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}
        onClick={onClick}
      >
        <ListItemAvatar style={{ minWidth: 'unset', marginRight: '10px' }}>
          {!option.image ? (
            <Avatar
              src={option.image}
              alt={option.label || option.name}
              sx={avatarStyleV2}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  borderRadius: '10px',
                  width: 50,
                  height: 50,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar alt={option.label || option.name} sx={avatarStyleV2}>
              <ImageWithErrorHandler
                src={ipfsCID ? imgLinkReplace(option.image) : option.image}
                style={{
                  borderRadius: '10px',
                  width: 50,
                  height: 50,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          )}
        </ListItemAvatar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: '19px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontFamily: 'newgilroymedium',
                  }}
                >
                  {textCut === 'middlen'
                    ? middlen(option.label || option.name, labelLength)
                    : shorten(option.label || option.name, labelLength)}{' '}
                  #{option.asset_num}
                </Typography>
                <div style={{ alignSelf: 'center', cursor: 'pointer' }}>
                  <ICRemove style={{ cursor: 'pointer' }} onClick={onRemove} />
                </div>
              </div>
              {tertiaryValue && (
                <Typography
                  sx={{
                    lineHeight: 'unset',
                  }}
                >
                  {tertiaryValue}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              {primaryValue && (
                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                  {primaryValue}
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: 500,
                  wordBreak: 'break',
                  color: showColor
                    ? positiveChange
                      ? 'var(--undervaluedColor)'
                      : '#E74C3C'
                    : 'var(--fontColor)',
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'newgilroymedium',
                }}
              >
                {secondaryValue}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { SearchBox, TrendingBox, TrendingBoxBuy, TrendingBoxSell };
