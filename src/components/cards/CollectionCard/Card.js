import React from 'react';
import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import styles from './Card.module.scss';
import { default as MuiSkeleton } from '@mui/material/Skeleton';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { shorten } from 'utils/shorten';
import moment from 'moment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { nFormatter } from 'utils/formatCurrency';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import styled from '@emotion/styled';
import { useAppContext } from 'context/AppContext';
import { IconButton } from '@mui/material';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import CollectionSocials from 'components/CollectionRating/CollectionSocials';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import CustomTooltip from 'components/common/CustomTooltip';
import VerifiedBadge from 'components/badges/VerifiedBadge';

const Skeleton = styled(MuiSkeleton)(() => ({
  backgroundColor: 'var(--skeletonColor)',
}));

const Change = ({ change }) => {
  const symbol = change > 0 ? '+' : change === 0 ? '' : '-';
  const formattedChange = nFormatter(change || 340);

  return (
    <span
      className={
        change > 0
          ? styles.compareHigher
          : change === 0
          ? styles.compareEqual
          : styles.compareLower
      }
      style={{ fontSize: 10 }}
    >
      {`(${symbol}${formattedChange})`}
    </span>
  );
};

const Card = ({
  image = '',
  optimized_image,
  collection_name,
  description,
  verified,
  featured,
  loved,
  supply = 0,
  onClick,
  loading,
  policies,
  style,
  minting,
  votes,
  isAdding,
  addedAt,
  socials,
  upcoming,
  floor,
  listings,
  volume_d,
  floor_change,
  listings_change,
  volume_change,
  id,
  imgStyle = {},
  nextImg = true,
  promotionText,
}) => {
  const { state } = useAppContext();
  const { isMobile } = state;

  const cardStyles = {
    width: isAdding && isMobile ? 300 : 'var(--collectionCardWidth)',
    height: {
      xs: 160,
      md: 180,
      lg: 190,
      xl: 200,
    },
    borderRadius: '10px',
    boxShadow: 'unset',
    margin: '10px',
    backgroundColor: 'var(--collectionCardBg)',
    backgroundImage: 'none',
    color: 'var(--collectionCardColor)',
    ...style,
  };

  const skeletonStles = isMobile
    ? 120
    : {
        xs: 120,
        xl: 150,
      };

  const defaultDescription = `A collection of ${supply} NFTs.`;
  const changeText = (change) =>
    change > 0
      ? `an increase of ${change || 0}`
      : change === 0
      ? 'no change'
      : `a decrease of ${change || 0}`;
  const isUpcoming = upcoming || isAdding;
  const upcomingUTC =
    id === 47536
      ? 'Minting Now'
      : id === 51643
      ? 'Coming Soon'
      : moment
          .utc(addedAt)
          .format(`DD ${isMobile ? 'MMM' : 'MMM'} / HH:mm UTC`);

  const badgeStyles =
    featured && !loading
      ? styles.featured
      : isUpcoming && !loading
      ? styles.upcoming
      : loved && !loading
      ? styles.loved
      : minting && !loading
      ? styles.minting
      : '';

  try {
    socials = JSON.parse(socials);
  } catch (e) {}

  return (
    <MuiCard sx={cardStyles}>
      <CardActionArea sx={{ height: { xs: '100%' } }}>
        <Box
          sx={{
            display: 'flex',
            padding: {
              xs: '8px',
              md: '12px',
            },
          }}
          className={badgeStyles}
        >
          {isUpcoming && !featured && !minting && !loading && (
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title="The collection is coming soon."
            >
              <Box className={styles.upcomingBadge}>{upcomingUTC}</Box>
            </CustomTooltip>
          )}
          {!!minting && !loading && (
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title="Assets are being minted right now"
            >
              <Box className={styles.mintingBadge}>Minting</Box>
            </CustomTooltip>
          )}
          {!!loved && !loading && (
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title="Most liked on CNFT Jungle"
            >
              <Box className={styles.lovedBadge}>Loved</Box>
            </CustomTooltip>
          )}
          {!!featured && !loading && (
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title="Promoted by CNFT Jungle. To buy a promotion go to cnftjungle.io/promotions"
            >
              <Box className={styles.featuredBadge}>Promoted</Box>
            </CustomTooltip>
          )}
          {!!upcoming && !loading && (
            <Box className={styles.verifiedBadge}>
              <BookmarkedBadge
                kind="collection"
                identifier={policies}
                width={25}
                additionalInfo={{
                  name: collection_name,
                  image: optimized_image || image,
                }}
              />
            </Box>
          )}
          {loading ? (
            <Skeleton
              sx={{
                minHeight: skeletonStles,
                minWidth: skeletonStles,
              }}
              animation="wave"
              // width={160}
              variant="rectangular"
            />
          ) : (
            <Box className={styles.imageWrapper}>
              <ImageWithErrorHandler
                src={imgLinkReplace(optimized_image || image)}
                alt="collection"
                className={styles.image}
                nextImg={false}
                style={{
                  // maxHeight: 220,
                  // maxWidth: 220,
                  // height: isMobile ? 100 : 160,
                  // width: isMobile ? 100 : 160,
                  ...imgStyle,
                }}
              />
            </Box>
          )}
          <Box>
            <CardContent
              sx={{
                padding: { xs: '8px', md: '8px 16px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                '&:last-child': {
                  paddingBottom: '8px',
                },
                py: { xs: '0 !important' },
                wordBreak: 'break-word',
                minWidth: { xs: 140, md: 180 },
                width: '100%',
              }}
              onClick={loading ? undefined : onClick}
            >
              {loading ? (
                <Box sx={{ width: '100%' }}>
                  <Skeleton
                    animation="wave"
                    height={40}
                    width="100%"
                    style={{ marginBottom: 6 }}
                  />
                  <Skeleton
                    animation="wave"
                    height={20}
                    width="80%"
                    style={{ marginBottom: 6 }}
                  />
                  <Skeleton animation="wave" height={10} width="100%" />
                  <Skeleton animation="wave" height={10} width="100%" />
                  <Skeleton animation="wave" height={10} width="100%" />
                  <Skeleton animation="wave" height={10} width="50%" />
                </Box>
              ) : (
                <Box className={styles.description}>
                  <Box
                    className={styles.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 0.5,
                      maxWidth: 150,
                      wordBreak: 'break-word',
                    }}
                  >
                    {shorten(collection_name || policies, isUpcoming ? 35 : 18)}
                    {/* {!isUpcoming && (
                    <Box sx={{ ml: 1 }}>
                      <span className={styles.likes}>
                        <FavoriteIconOutlined
                          sx={{
                            fontSize: { xs: 12, md: 14 },
                            color: 'var(--logoColor)',
                            ml: 0.25,
                          }}
                        />
                        {Math.abs(votes || 0)}
                      </span>
                    </Box>
                    deploy
                  )} */}
                    {!isUpcoming && (
                      <VerifiedBadge width={20} verified={verified} />
                    )}
                  </Box>
                  <p className={styles.info}>
                    {shorten(
                      description || defaultDescription,
                      isMobile ? 80 : 135
                    )}
                  </p>
                  {!loading && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        mt: 1,
                        mb: 0.5,
                        width: 225,
                        columnGap: isUpcoming ? 1 : 0,
                      }}
                    >
                      {socials?.price && !promotionText && (
                        <Box className={styles.price}>
                          <span
                            style={{
                              fontSize:
                                isMobile && isAdding ? '12px !important' : 12,
                            }}
                          >
                            {isMobile ? '' : 'Mint:'}{' '}
                            {socials?.price.replace('ADA', '')}{' '}
                            {socials?.currency || 'ADA'}
                          </span>
                        </Box>
                      )}
                      {socials?.supply && !promotionText && (
                        <Box className={styles.price}>
                          <span
                            style={{
                              fontSize:
                                isMobile && isAdding ? '12px !important' : 12,
                            }}
                          >
                            {isMobile ? '' : 'Supply:'} {socials?.supply} NFTs
                          </span>
                        </Box>
                      )}

                      {/* [NOTE] TEMP FEATURED */}
                      {promotionText || socials?.promotionText ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 1,
                          }}
                        >
                          <Box className={styles.circulation}>
                            <span
                              style={{
                                fontSize:
                                  isMobile || isAdding ? '12px !important' : 14,
                                paddingLeft: '0px !important',
                              }}
                            >
                              {promotionText || socials?.promotionText}
                            </span>
                          </Box>
                        </Box>
                      ) : (
                        !isUpcoming && (
                          <CustomTooltip
                            style={{ paddingTop: 0 }}
                            title={
                              promotionText ?? `Collection has ${supply} NFTs.`
                            }
                            placement="top"
                          >
                            <Box className={styles.circulation}>
                              <span>{supply} NFTs</span>
                            </Box>
                          </CustomTooltip>
                        )
                      )}
                      {!isUpcoming && (
                        <CustomTooltip
                          style={{ paddingTop: 0 }}
                          title={`The collection floor is ${
                            floor || 0
                          } ADA with ${changeText(
                            floor_change
                          )} ADA in the last 24hrs. `}
                          placement="top"
                        >
                          <Box className={styles.circulation} sx={{ mx: 0.5 }}>
                            <span>
                              {floor
                                ? `₳${nFormatter(floor || 0, 2)} Floor `
                                : 'Soon'}
                              {floor_change && <Change change={floor_change} />}
                            </span>
                          </Box>
                        </CustomTooltip>
                      )}
                    </Box>
                  )}
                  {!isUpcoming && (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          py: 0.5,
                          width: '100%',
                        }}
                      >
                        <CustomTooltip
                          style={{ paddingTop: 0 }}
                          title={`The volume is ${
                            volume_d || 0
                          } ADA with ${changeText(
                            volume_change
                          )} ADA in the last 24hrs.`}
                        >
                          <Box className={styles.circulation}>
                            <span
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              ₳
                              {volume_d
                                ? `${nFormatter(volume_d || 0, 1)} `
                                : 'No 24h Sales'}
                              {isMobile ? (
                                <CurrencyExchangeIcon
                                  sx={{ fontSize: 12, mx: 0.35 }}
                                />
                              ) : volume_d ? (
                                'Volume'
                              ) : (
                                ''
                              )}
                              {volume_change && (
                                <Change change={volume_change} />
                              )}
                            </span>
                          </Box>
                        </CustomTooltip>
                        <CustomTooltip
                          style={{ paddingTop: 0 }}
                          title={`The listings amount is ${listings} with ${changeText(
                            listings_change
                          )} in the last 24hrs. ${Math.round(
                            (listings / supply) * 100
                          )}% of total minted assets are currently listed.`}
                        >
                          <Box className={styles.circulation} sx={{ mx: 0.5 }}>
                            <span
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {listings
                                ? `${nFormatter(listings || 0, 1)} `
                                : 'No Listings'}
                              {isMobile ? (
                                <ShoppingBagIcon
                                  sx={{ fontSize: 12, mx: 0.25 }}
                                />
                              ) : listings ? (
                                `Listed/${Math.round(
                                  (listings / supply) * 100
                                )}%`
                              ) : (
                                ''
                              )}
                              {listings_change && (
                                <Change change={listings_change} />
                              )}
                            </span>
                          </Box>
                        </CustomTooltip>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </CardContent>
            <Box>
              {isUpcoming && !loading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <CollectionSocials
                    socials={socials || []}
                    isUpcoming
                    collection={{
                      image,
                      optimized_image,
                      name: collection_name,
                      featured,
                    }}
                  />
                  <CustomTooltip
                    style={{ paddingTop: 0 }}
                    title="Add to Calendar"
                  >
                    <IconButton
                      onClick={() => {
                        window.open(
                          `https://www.google.com/calendar/render?action=TEMPLATE&text=${collection_name}+Mint&dates=${moment(
                            addedAt
                          )
                            .utc()
                            .format('YYYYMMDD[T]HHmm[000Z]')}/${moment(addedAt)
                            .utc()
                            .add(1, 'hour')
                            .format(
                              'YYYYMMDD[T]HHmm[000Z]'
                            )}&details=${collection_name}+Mint&sf=true&output=xml`
                        );
                      }}
                    >
                      <NotificationAddIcon
                        sx={{
                          width: 22,
                          color: featured && 'white',
                        }}
                      />
                    </IconButton>
                  </CustomTooltip>

                  {/* <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <span style={{ fontSize: 14 }}>
                        {Math.abs(votes || 0)}
                      </span>
                      <FavoriteIconOutlined
                        sx={{ fontSize: 15, color: 'var(--logoColor)', ml: 0.25 }}
                      />
                    </Box> */}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
