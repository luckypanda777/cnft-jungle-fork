import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import classNames from 'classnames';
import styles from './Card.module.scss';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { formatPrice } from 'utils/formatCurrency';
import MarketplaceIcon from 'components/common/MarketplaceIcon';
import { Chip, CircularProgress, Divider, Grid, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NumbersIcon from '@mui/icons-material/Numbers';
import { getUndervaluedTextAndStyle } from 'utils/getUndervalued';
import { getRarestTrait } from 'utils/getRarestTrait';
import { useAppContext } from 'context/AppContext';
import Typography from '@mui/material/Typography';
import { rewardNameMappingToPolicyId } from './rewardMapping';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useContext, useEffect, useRef, useState } from 'react';
import useNFTAction from 'hooks/useNFTAction';
import BoltIcon from '@mui/icons-material/Bolt';
import { eventTrack } from 'config/analytics';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import AddToCartBadge from 'components/badges/AddToCartBadge';

const Card = ({
  image,
  name,
  asset_num,
  asset_id,
  listings,
  onchain_data,
  onClick,
  style,
  className = '',
  loading,
  sortOrFilerLoading,
  optimized_image,
  sort = '',
  rarity_rank,
  rewards,
  tcount_rarity_rank,
  statistical_rarity_rank,
  listing_marketplace: marketplace,
  listing_link: link,
  listing_price: price,
  listing_type,
  currency = 'ADA',
  is_smart_contract,
  deal_coefficient,
  average_coefficient,
  collectionTraits = {},
  collectionSupply,
  traits,
  policy_id,
  showPurchasePopover = true,
  forceSmallDisplay,
  showRarestTrait = true,
  sale_price,
  sale_marketplace,
  nextImg = false,
  cheapest,
  on_chain_src,
  isOwned,
}) => {
  const {
    state: { walletInfo, localFilters, isMobile, cart, listingCart },
  } = useAppContext();
  const { showFeedback } = useContext(FeedbackContext);
  const { showRanks, showValuation, display } = localFilters;
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const [queriedPurchase, setQueriedPurchase] = useState(false);
  const [hoverState, setHoverState] = useState(false);
  const anchor = useRef(null);

  const handlePopoverOpen = () => {
    setHoverState(true);
  };

  const handlePopoverClose = () => {
    setHoverState(false);
  };

  const rank =
    sort.sort === 'statistical'
      ? statistical_rarity_rank || 'None'
      : sort.sort === 'scoreWithTraitCount'
      ? tcount_rarity_rank || 'None'
      : rarity_rank || 'None';

  const { valueCoefficientStyle, valueCoefficientText, trueCoefficient } =
    getUndervaluedTextAndStyle({
      showValuation,
      price,
      deal_coefficient,
      average_coefficient,
    });

  const rarestTrait = getRarestTrait({
    assetTraits: traits,
    collectionTraits,
    collectionSupply,
  });

  const inCart =
    cart?.some((a) => a.asset_id === asset_id) ||
    listingCart?.some((a) => a.asset_id === asset_id || a.asset_name === name);

  useEffect(() => {
    if (walletInfo.name && walletInfo.address && queriedPurchase) {
      try {
        handleNFTAction({
          ...queriedPurchase,
          price: price * 1000000,
          onError: (err) => {
            link && window.open(link, '_blank');
          },
          onSuccess: (txHash) => {
            showFeedback({
              open: true,
              message: `TX SUBMITTED ${txHash}`,
              duration: 2000,
              kind: 'success',
            });
          },
          onFallback: () => link && window.open(link, '_blank'),
        });

        setQueriedPurchase(false);
      } catch (err) {
        link && window.open(link, '_blank');
      }
    }
  }, [walletInfo, queriedPurchase]);

  return (
    <MuiCard
      className={classNames(className, styles.muiCard)}
      sx={{ ...style }}
      onMouseLeave={handlePopoverClose}
      onMouseEnter={handlePopoverOpen}
    >
      <CardActionArea>
        <CardContent style={{ padding: '10px' }}>
          {!(loading || sortOrFilerLoading) &&
            hoverState &&
            (isOwned || marketplace === 'jpgstore') && (
              <Box className={styles.addToCartBox}>
                <AddToCartBadge
                  asset={{
                    asset_id,
                    image: optimized_image || image,
                    name,
                    price,
                    marketplace,
                    asset_num,
                  }}
                  width={20}
                  type={isOwned ? 'sell' : 'buy'}
                />
              </Box>
            )}
          {!(loading || sortOrFilerLoading) && hoverState && (
            <Box className={styles.bookmarkBox}>
              <BookmarkedBadge
                kind="asset"
                identifier={asset_id}
                additionalInfo={{ image: optimized_image || image, name }}
                width={22}
              />
            </Box>
          )}
          {!(loading || sortOrFilerLoading) && !!cheapest && (
            <>
              <Box className={styles.cheapestBox}>
                <Chip
                  label="Cheapest"
                  size="small"
                  className={styles.cheapestChip}
                />
              </Box>
            </>
          )}
          {!(loading || sortOrFilerLoading) && !!rewards && (
            <>
              <Box
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  right: 5,
                  top: 5,
                }}
              >
                <Chip
                  label={
                    rewardNameMappingToPolicyId[policy_id]?.show ? (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {rewardNameMappingToPolicyId[policy_id]?.boost && (
                          <BoltIcon sx={{ fontSize: 16 }} />
                        )}
                        {`${rewards} $${rewardNameMappingToPolicyId[policy_id]?.label}`}
                      </span>
                    ) : (
                      'SOON'
                    )
                  }
                  size="small"
                  sx={{ ml: 1, borderRadius: 1.5, fontWeight: 'bold' }}
                  color="primary"
                />
              </Box>
            </>
          )}
          {loading || sortOrFilerLoading ? (
            <Skeleton
              sx={{
                height: forceSmallDisplay || display === 'small' ? 150 : 230,
                minHeight: forceSmallDisplay || display === 'small' ? 150 : 230,
                borderTopRightRadius: '12px',
                borderTopLeftRadius: '12px',
              }}
              animation="wave"
              width="100%"
              variant="rectangular"
            />
          ) : (
            <Box
              onClick={onClick}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                minHeight: forceSmallDisplay || display === 'small' ? 150 : 230,
              }}
            >
              <ImageWithErrorHandler
                src={imgLinkReplace(optimized_image || image)}
                onchain_data={onchain_data}
                on_chain_src={on_chain_src}
                alt="collection"
                className={styles.image}
                nextImg={nextImg}
                style={{
                  maxHeight:
                    forceSmallDisplay || display === 'small' ? 150 : 220,
                  maxWidth:
                    forceSmallDisplay || display === 'small' ? 150 : 220,
                  height: forceSmallDisplay || display === 'small' ? 150 : 220,
                  width: forceSmallDisplay || display === 'small' ? 150 : 220,
                }}
                overlayOnClick={onClick}
              />
            </Box>
          )}
          <Box className={styles.description}>
            {loading ? (
              <Box sx={{ marginTop: '10px' }}>
                <Skeleton animation="wave" height={14} width={'100%'} />
                <Skeleton animation="wave" height={14} width={'100%'} />
              </Box>
            ) : (
              <Box className={styles.primaryInfo} onClick={onClick}>
                <Box className={styles.circulation}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                  >
                    {sortOrFilerLoading ? (
                      <Skeleton width={25} />
                    ) : (
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {asset_id ===
                        '3bcc312ebe7cd9281ab3e3d641bf70f207012e539b0e6e7c3f1560d7.2Bill7009' ? (
                          <span style={{ color: 'var(--errorColor)' }}>
                            STOLEN
                          </span>
                        ) : (
                          <>
                            {forceSmallDisplay || display === 'small' ? (
                              <EmojiEventsIcon style={{ fontSize: 16 }} />
                            ) : (
                              'Rank '
                            )}
                            <span style={{ paddingTop: 2 }}>
                              {!showRanks ||
                              policy_id ===
                                'c76e5286fce9e6f5c9b1c5a61f74bc7fa89ed0f946ff2ae5d875f2cb'
                                ? '***'
                                : rank}
                            </span>
                          </>
                        )}
                      </Box>
                    )}
                  </span>
                </Box>
                <Box className={styles.circulation}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                  >
                    {sortOrFilerLoading ? (
                      <Skeleton width={25} />
                    ) : (
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {asset_id ===
                        '3bcc312ebe7cd9281ab3e3d641bf70f207012e539b0e6e7c3f1560d7.2Bill7009' ? (
                          <span style={{ color: 'var(--errorColor)' }}>
                            STOLEN
                          </span>
                        ) : (
                          <>
                            {forceSmallDisplay || display === 'small' ? (
                              <NumbersIcon style={{ fontSize: 16 }} />
                            ) : (
                              'Num #'
                            )}
                            <span style={{ paddingTop: 2 }}>{asset_num}</span>
                          </>
                        )}
                      </Box>
                    )}
                  </span>
                </Box>
              </Box>
            )}

            {showRarestTrait && (
              <Box
                className={classNames(
                  styles.priceInfo,
                  inCart ? styles.inCart : null,
                  !price || loading || sortOrFilerLoading
                    ? styles.outOfStock
                    : null
                )}
              >
                <Box
                  className={[
                    styles.priceContainer,
                    !(loading || sortOrFilerLoading) &&
                      styles[valueCoefficientStyle],
                  ]}
                >
                  {loading || sortOrFilerLoading ? (
                    <Box sx={{ width: '100%' }}>
                      <Skeleton
                        animation="wave"
                        height={22}
                        width={'100%'}
                        sx={{ mx: 'auto' }}
                      />
                    </Box>
                  ) : (
                    <Grid
                      container
                      spacing={0}
                      wrap="nowrap"
                      justifyContent="center"
                    >
                      {rarestTrait.displayTextNoPercentage.length > 16 ? (
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 12,
                            fontFamily: 'newgilroybold',
                          }}
                        >
                          {rarestTrait.displayTextNoPercentage}
                        </Typography>
                      ) : (
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 12,
                            fontFamily: 'newgilroybold',
                          }}
                        >
                          {rarestTrait.displayTextNoPercentage}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          textAlign: 'right',
                          fontSize: 12,
                          fontFamily: 'newgilroybold',
                          ml: 0.5,
                        }}
                      >
                        {`(${rarestTrait.percentage}%)`}
                      </Typography>
                    </Grid>
                  )}
                </Box>
                <Divider
                  sx={{
                    width: '90%',
                    mx: 'auto',
                    color: 'black',
                    backgroundColor: '#FFF',
                    opacity: 0.15,
                  }}
                />
              </Box>
            )}

            <Box
              className={classNames(
                styles.priceInfo,
                inCart ? styles.inCart : null,
                !price || sale_price || loading || sortOrFilerLoading
                  ? styles.outOfStock
                  : null
              )}
              // onClick={() => link && window.open(link, '_blank')}
              onClick={() => {
                // if (isMobile) {
                //   return link && window.open(link, '_blank');
                // }

                if (!walletInfo.name) {
                  link && window.open(link, '_blank');

                  return showFeedback({
                    open: true,
                    message: 'Please connect wallet first',
                    duration: 2000,
                    kind: 'error',
                  });
                }
                if (loadingNFTAction || !walletInfo.name) return;

                if (marketplace !== 'jpgstore') {
                  return link && window.open(link, '_blank');
                }

                try {
                  handleNFTAction({
                    type: 'BUY',
                    price: price * 1000000,
                    assetId: asset_id,
                    isHex: 'false',
                    tier: 'JUNGLE',
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
                        eventTrack('purchase', asset_id, price);
                      } catch (err) {}
                    },
                    onFallback: () => link && window.open(link, '_blank'),
                    isMobile,
                  });
                } catch (err) {
                  link && window.open(link, '_blank');
                }
              }}
            >
              <Box
                ref={anchor}
                className={[
                  styles.priceContainer,
                  !(loading || sortOrFilerLoading) &&
                    styles[valueCoefficientStyle],
                ]}
              >
                {loadingNFTAction ? (
                  <Box className={styles.price}>
                    <CircularProgress
                      size={18}
                      sx={{ color: 'var(--whiteColor)' }}
                    />
                  </Box>
                ) : loading || sortOrFilerLoading ? (
                  <Box sx={{ width: '100%' }}>
                    <Skeleton animation="wave" height={14} width={'100%'} />
                    <Skeleton animation="wave" height={22} width={'100%'} />
                  </Box>
                ) : hoverState && price ? (
                  <Box
                    className={styles.slideUp}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Buy
                  </Box>
                ) : (
                  <>
                    {inCart ? (
                      <Box
                        className={styles.price}
                        sx={{
                          fontSize:
                            (forceSmallDisplay || display === 'small') &&
                            '20px !important',
                        }}
                      >
                        Selected
                      </Box>
                    ) : !price && !sale_price ? (
                      <Box
                        className={styles.price}
                        sx={{
                          fontSize:
                            (forceSmallDisplay || display === 'small') &&
                            '20px !important',
                        }}
                      >
                        Not on Sale
                      </Box>
                    ) : (
                      <Box
                        className={styles.price}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <MarketplaceIcon
                          marketplace={marketplace || sale_marketplace}
                        />
                        {formatPrice(price || sale_price, currency)}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
