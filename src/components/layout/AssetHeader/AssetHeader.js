import { useAppContext } from 'context/AppContext';
import { Box, Grid, Paper, Avatar, Typography, Divider } from '@mui/material';
import CollectionSocials from 'components/CollectionRating/CollectionSocials';
import CollectionStats from 'components/CollectionStats';
import styles from './AssetHeader.module.scss';
import moment from 'moment';
import Image from 'next/image';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { isMobile } from 'react-device-detect';
import { avatarStyle as globalAvatarStyle } from 'utils/globalStyles';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { nFormatter } from 'utils/formatCurrency';
import CustomTooltip from 'components/common/CustomTooltip';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import DoxxedBadge from 'components/badges/DoxxedBadge';
import { middlen } from 'utils/shorten';

const avatarStyle = {
  ...globalAvatarStyle,
  width: 200,
  height: 200,
  background: 'var(--searchBg)',
  borderRadius: 5,
};

const Header = () => {
  const { state } = useAppContext();

  const isUpcoming =
    state.collection?.upcoming &&
    state.collection?.addedAt > parseInt(moment().unix() * 1000) &&
    !state.collection?.supply > 0;

  const marketCap = state.collection?.floor * state.collection?.supply;

  if (isUpcoming) {
    return (
      <Paper
        elevation={0}
        sx={{
          padding: '24px',
          position: 'relative',
          height: '83.75vh',
          my: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid container rowGap={2}>
          <Grid
            container
            item
            md={12}
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            wrap="nowrap"
          >
            <Grid item>
              {!state.collection?.image &&
              !state.collection?.optimized_image ? (
                <Avatar
                  alt="collection"
                  variant="rounded"
                  src={imgLinkReplace(
                    state.collection?.optimized_image || state.collection?.image
                  )}
                  sx={{
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    position: 'relative',
                    border: '2px solid var(--traitPercentText)',
                    marginTop: isMobile ? 5 : 0,
                  }}
                >
                  <ImageWithErrorHandler
                    src="assets/catunsupported.webp"
                    alt="unsupported"
                    style={{
                      width: 250,
                      height: 250,
                      objectFit: 'var(--objectFit)',
                    }}
                  />
                </Avatar>
              ) : (
                <Avatar
                  alt={state.collection?.collection_name}
                  sx={{
                    ...avatarStyle,
                    marginTop: isMobile ? 5 : 0,
                    width: 250,
                    height: 250,
                  }}
                >
                  <Image
                    src={imgLinkReplace(
                      state.collection?.optimized_image ||
                        state.collection?.image
                    )}
                    layout="fill"
                    alt="collection image"
                  />
                </Avatar>
              )}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box
                variant="h1"
                sx={{
                  fontFamily: 'newgilroybold',
                  wordBreak: 'break-word',
                  fontSize: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {state.collection?.collection_name ||
                  state.collection?.policies}
                <BookmarkedBadge
                  showAmount
                  type="collection"
                  identifier={state.collection?.policies}
                  width={30}
                  additionalInfo={state.collection}
                />
                {!!state.collection?.verified && (
                  <VerifiedBadge
                    width={25}
                    height={25}
                    verified={state.collection?.verified}
                  />
                )}
                {!!state.collection?.minting && (
                  <CustomTooltip
                    title="Collection is minting now"
                    style={{
                      marginLeft: 0,
                      paddingTop: 0,
                      marginBottom: 0,
                      paddingBottom: 3,
                      height: 26,
                    }}
                    placement="top"
                  >
                    <LocalFireDepartmentIcon
                      sx={{ color: 'var(--tertiaryColor)', fontSize: 26 }}
                    />
                  </CustomTooltip>
                )}
                {!!state.collection?.featured && (
                  <CustomTooltip
                    title="Collection is featured"
                    style={{ marginLeft: 0, paddingTop: 5, marginBottom: 0 }}
                    placement="top"
                  >
                    <FilterVintageIcon
                      sx={{ color: 'var(--primaryColor)', fontSize: 26 }}
                    />
                  </CustomTooltip>
                )}
                {!!state.collection?.policies && (
                  <DoxxedBadge
                    width={20}
                    policyId={state.collection.policies}
                  />
                )}
              </Box>
              <span
                style={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  maxWidth: '500px',
                  mx: 'auto',
                  wordBreak: 'break-word',
                  mt: 1,
                  fontSize: 18,
                  fontFamily: 'newgilroymedium',
                }}
              >
                {state.collection?.description}
              </span>
              {state.collection?.id === 53047 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 2,
                    marginTop: 2,
                  }}
                >
                  <Box className={styles.circulation}>
                    <span
                      className={styles.badge}
                      style={{
                        fontSize: isMobile ? '10px !important' : 14,
                      }}
                    >
                      5th June @ 4 a.m. UTC
                    </span>
                  </Box>
                </Box>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <span className={styles.circulation}>
                    <span className={styles.badge} style={{ fontSize: 16 }}>
                      {state.collection?.socials?.promotionText
                        ? state.collection?.socials.promotionText
                        : moment
                            .utc(state.collection?.addedAt)
                            .format('DD MMMM @ HH:mm UTC')}
                    </span>
                  </span>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
          }}
        >
          <CollectionSocials
            socials={state.collection?.socials || {}}
            policyId={state.collection?.policies}
            collection={{
              image:
                state.collection?.optimized_image || state.collection?.image,
              name: state.collection?.collection_name,
            }}
          />
        </Box>
      </Paper>
    );
  }

  if (state.isMobile) {
    return (
      <Paper
        elevation={0}
        sx={{
          // padding: '24px',
          p: 1,
          position: 'relative',
          height: isUpcoming ? '83.75vh' : 'fit-content',
          my: 'auto',
          display: 'flex',
          alignItems: 'center',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          mb: 2,
        }}
      >
        <Box container rowGap={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 2,
            }}
          >
            <CollectionSocials
              socials={state.collection?.socials || {}}
              policyId={state.collection?.policies}
              collection={{
                image:
                  state.collection?.optimized_image || state.collection?.image,
                name: state.collection?.collection_name,
              }}
            />
            <Box item>
              {!state.collection?.image &&
              !state.collection?.optimized_image ? (
                <Avatar
                  alt="collection"
                  variant="rounded"
                  src={imgLinkReplace(
                    state.collection?.optimized_image || state.collection?.image
                  )}
                  sx={{
                    width: isUpcoming ? 250 : 150,
                    height: isUpcoming ? 250 : 150,
                    borderRadius: '50%',
                    position: 'relative',
                    border: '2px solid var(--traitPercentText)',
                    mt: 1,
                  }}
                >
                  <ImageWithErrorHandler
                    src="assets/catunsupported.webp"
                    alt="unsupported"
                    style={{
                      width: isUpcoming ? 250 : 150,
                      height: isUpcoming ? 250 : 150,
                      objectFit: 'var(--objectFit)',
                    }}
                  />
                </Avatar>
              ) : (
                <Avatar
                  alt={state.collection?.collection_name}
                  sx={{
                    ...avatarStyle,
                    mt: 1,
                    width: isUpcoming ? 250 : 200,
                    height: isUpcoming ? 250 : 200,
                  }}
                >
                  <Image
                    src={imgLinkReplace(
                      state.collection?.optimized_image ||
                        state.collection?.image
                    )}
                    layout="fill"
                    alt="collection image"
                  />
                </Avatar>
              )}
            </Box>
            <Box item xs={12} sx={{ textAlign: 'center' }}>
              <Box
                variant="h1"
                sx={{
                  fontFamily: 'newgilroybold',
                  wordBreak: 'break-word',
                  fontSize: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {state.collection?.collection_name ||
                  state.collection?.policies}
                {!!state.collection?.verified && (
                  <VerifiedBadge
                    width={25}
                    height={25}
                    verified={state.collection?.verified}
                  />
                )}
                {!!state.collection?.minting && (
                  <CustomTooltip
                    title="Collection is minting now"
                    style={{
                      marginLeft: 0,
                      paddingTop: 0,
                      marginBottom: 0,
                      paddingBottom: 3,
                      height: 26,
                    }}
                    placement="top"
                  >
                    <LocalFireDepartmentIcon
                      sx={{ color: 'var(--tertiaryColor)', fontSize: 26 }}
                    />
                  </CustomTooltip>
                )}
                {!!state.collection?.featured && (
                  <CustomTooltip
                    title="Collection is featured"
                    style={{ marginLeft: 0, paddingTop: 5, marginBottom: 0 }}
                    placement="top"
                  >
                    <FilterVintageIcon
                      sx={{ color: 'var(--primaryColor)', fontSize: 26 }}
                    />
                  </CustomTooltip>
                )}
                {!!state.collection?.policies && (
                  <DoxxedBadge
                    width={22}
                    policyId={state.collection.policies}
                  />
                )}
              </Box>
              {!isUpcoming && (
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'newgilroybold',
                    wordBreak: 'break-word',
                    fontSize: 20,
                    color: 'var(--collectionFont)',
                  }}
                >
                  {marketCap ? nFormatter(marketCap, 2) : '-'} Market Cap /{' '}
                  {state.collection?.supply} NFTs
                </Typography>
              )}
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  maxWidth: '500px',
                  mx: 'auto',
                  wordBreak: 'break-word',
                  mt: 1,
                  fontSize: isUpcoming ? 18 : 16,
                }}
              >
                {state.collection?.description}
              </Typography>
              {!!isUpcoming &&
                (state.collection?.id === 53047 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: 2,
                      marginTop: 2,
                    }}
                  >
                    <Box className={styles.circulation}>
                      <span
                        className={styles.badge}
                        style={{
                          fontSize: isMobile
                            ? '10px !important'
                            : isUpcoming
                            ? 14
                            : 12,
                        }}
                      >
                        5th June @ 4 a.m. UTC
                      </span>
                    </Box>
                  </Box>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <span className={styles.circulation}>
                      <span
                        className={styles.badge}
                        style={{ fontSize: isUpcoming ? 16 : 12 }}
                      >
                        {moment
                          .utc(state.collection?.addedAt)
                          .format('DD MMMM @ HH:mm UTC')}
                      </span>
                    </span>
                  </div>
                ))}
            </Box>
          </Box>
          {!isUpcoming && (
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <CollectionStats {...state.collection} />
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        position: 'relative',
        height: 'fit-content',
        my: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    >
      <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
        <Box>
          {!state.collection?.image && !state.collection?.optimized_image ? (
            <Avatar
              alt="collection"
              variant="rounded"
              src={imgLinkReplace(
                state.collection?.optimized_image || state.collection?.image
              )}
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                position: 'relative',
                border: '2px solid var(--traitPercentText)',
                marginTop: isMobile ? 5 : 0,
              }}
            >
              <ImageWithErrorHandler
                src="assets/catunsupported.webp"
                alt="unsupported"
                style={{
                  width: 70,
                  height: 70,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          ) : (
            <Avatar
              alt={state.collection?.collection_name}
              sx={{
                ...avatarStyle,
                marginTop: isMobile ? 5 : 0,
                width: 70,
                height: 70,
                borderRadius: '8px',
              }}
            >
              <ImageWithErrorHandler
                src={imgLinkReplace(
                  state.collection?.optimized_image || state.collection?.image
                )}
                alt="collection image"
                style={{
                  width: 70,
                  height: 70,
                  objectFit: 'var(--objectFit)',
                }}
              />
            </Avatar>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Box
            style={{
              fontFamily: 'newgilroybold',
              wordBreak: 'break-word',
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 3,
              columnGap: 2,
            }}
          >
            {middlen(
              state.collection?.collection_name || state.collection?.policies,
              16
            )}
            {!!state.collection?.verified && (
              <VerifiedBadge
                width={25}
                height={25}
                verified={state.collection?.verified}
              />
            )}
            {!!state.collection?.minting && (
              <CustomTooltip
                title="Collection is minting now"
                style={{
                  marginLeft: 0,
                  paddingTop: 0,
                  marginBottom: 0,
                  paddingBottom: 3,
                  height: 26,
                }}
                placement="top"
              >
                <LocalFireDepartmentIcon
                  sx={{ color: 'var(--tertiaryColor)', fontSize: 26 }}
                />
              </CustomTooltip>
            )}
            {!!state.collection?.featured && (
              <CustomTooltip
                title="Collection is featured"
                style={{ marginLeft: 0, paddingTop: 5, marginBottom: 0 }}
                placement="top"
              >
                <FilterVintageIcon
                  sx={{ color: 'var(--primaryColor)', fontSize: 26 }}
                />
              </CustomTooltip>
            )}
            {!!state.collection?.policies && (
              <DoxxedBadge width={22} policyId={state.collection.policies} />
            )}
          </Box>
          <CollectionStats {...state.collection} />
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
      >
        <CollectionSocials
          socials={state.collection?.socials || {}}
          policyId={state.collection?.policies}
          collection={{
            image: state.collection?.optimized_image || state.collection?.image,
            name: state.collection?.collection_name,
          }}
        />
      </Box>
    </Paper>
  );
};

export default Header;
