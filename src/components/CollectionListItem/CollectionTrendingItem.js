import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
} from '@mui/material';
import { default as MuiSkeleton } from '@mui/material/Skeleton';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { shorten } from 'utils/shorten';
import dynamic from 'next/dynamic';
import { nFormatter } from 'utils/formatCurrency';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { useAppContext } from 'context/AppContext';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { TrendingBox } from 'components/boxes/BookmarkBoxes/BookmarkBoxes';

const Skeleton = styled(MuiSkeleton)(() => ({
  backgroundColor: 'var(--skeletonColor)',
}));

const TrendingListItem = ({
  collection = {},
  loading,
  sortOrFilerLoading,
  isLast,
  tertiaryType,
}) => {
  const { state } = useAppContext();
  const { yesterday_value = 1, today_value = 100, difference = 0 } = collection;
  const router = useRouter();
  const onClick = (e) => {
    const link = `/collections/${collection?.policies}`;
    if (e.metaKey) {
      return window?.open(link, '_blank');
    }

    if (collection) {
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

  const positiveChange = today_value - yesterday_value > 0;

  return (
    <>
      <TrendingBox
        option={{
          label: collection.collection_name || collection.policies,
          image: collection.optimized_image || collection.image,
          verified: collection.verified,
        }}
        primaryValue={`₳${today_value.toLocaleString()}`}
        secondaryValue={`(${positiveChange ? '+' : '-'}${(
          difference * 100
        ).toFixed(1)}%)`}
        tertiaryValue={
          tertiaryType === 'floor' ? (
            <Box
              sx={{
                display: 'flex',
                columnGap: 0.5,
                fontSize: 12,
                fontFamily: 'newgilroysemibold',
                letterSpacing: 0.25,
              }}
            >
              <span style={{ color: 'var(--rankGrey)' }}>Floor: </span>
              <span style={{ color: 'var(--fontColor)' }}>
                ₳{collection.floor}
              </span>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                columnGap: 0.5,
                fontSize: 12,
                fontFamily: 'newgilroysemibold',
                letterSpacing: 0.25,
              }}
            >
              {' '}
              <span style={{ color: 'var(--rankGrey)' }}>Volume(24h): </span>
              <span style={{ color: 'var(--fontColor)' }}>
                ₳{collection.volume_d}
              </span>
            </Box>
          )
        }
        positiveChange={positiveChange}
        showColor
        identifier={collection.policies}
        type="collection"
        onClick={onClick}
        labelLength={20}
      />
      <Divider sx={{ width: '95%', mx: 'auto' }} />
    </>
  );

  return (
    <>
      <BrowserView>
        <ListItem
          onClick={onClick}
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
            {!collection.image && !collection.optimized_image ? (
              <Avatar
                src={collection.optimized_image || collection.image}
                alt={collection.collection_name}
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
              <Avatar alt={collection.collection_name} sx={avatarStyle}>
                <ImageWithErrorHandler
                  src={imgLinkReplace(
                    collection.optimized_image || collection.image
                  )}
                  alt="unsupported"
                  style={{
                    width: 45,
                    height: 45,
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
              },
            }}
            primary={shorten(
              collection.collection_name || collection.policies,
              35
            )}
            primaryTypographyProps={{
              fontWeight: 'bold',
              fontFamily: 'newgilroymedium',
              color: 'var(--fontColor)',
              fontSize: 14,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '50%',
            }}
          >
            <ListItemText
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'newgilroymedium',
                }}
              >
                ₳{today_value.toLocaleString()}{' '}
              </div>
              <span
                style={{
                  color:
                    positiveChange > 0 ? 'var(--undervaluedColor)' : '#E74C3C',
                  fontSize: 12,
                  fontFamily: 'newgilroymedium',
                }}
              >
                ({positiveChange ? '+' : '-'}
                {(difference * 100).toFixed(1)}%)
              </span>
            </ListItemText>
          </Box>
          {/* <ListItemText sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Chart {...chartData} width={120} height={50} />
        </ListItemText> */}
        </ListItem>
      </BrowserView>
      <MobileView>
        <ListItem
          onClick={onClick}
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
            {!collection.image && !collection.optimized_image ? (
              <Avatar
                src={collection.optimized_image || collection.image}
                alt={collection.collection_name}
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
              <Avatar alt={collection.collection_name} sx={avatarStyle}>
                <ImageWithErrorHandler
                  src={collection.optimized_image || collection.image}
                  alt="unsupported"
                  style={{
                    width: 45,
                    height: 45,
                    objectFit: 'var(--objectFit)',
                  }}
                  nextImg
                />
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            sx={{ width: { xs: 200, md: 200, wordWrap: 'break-word' } }}
            primary={shorten(
              collection.collection_name || collection.policies,
              35
            )}
            primaryTypographyProps={{
              fontWeight: 'bold',
              fontFamily: 'newgilroymedium',
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
            <ListItemText
              primaryTypographyProps={{
                textAlign: 'right',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'newgilroymedium',
              }}
              primary={`₳${nFormatter(today_value, 2)}`}
              secondaryTypographyProps={{
                textAlign: 'right',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'newgilroymedium',
                color:
                  positiveChange > 0 ? 'var(--undervaluedColor)' : '#E74C3C',
              }}
              secondary={
                <span>
                  {positiveChange ? '+' : '-'}
                  {(difference * 100).toFixed(1)}%
                </span>
              }
            />
          </Box>
          {/* <ListItemText sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Chart {...chartData} width={120} height={50} />
        </ListItemText> */}
        </ListItem>
      </MobileView>
      {!isLast && <Divider sx={{ width: '100%' }} />}
    </>
  );
};

export default TrendingListItem;
