import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import classNames from 'classnames';
import styles from './styles.module.scss';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { formatPrice } from 'utils/formatCurrency';
import { Chip, CircularProgress, Divider, Grid, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NumbersIcon from '@mui/icons-material/Numbers';
import { getUndervaluedTextAndStyle } from 'utils/getUndervalued';
import { getRarestTrait } from 'utils/getRarestTrait';
import { useAppContext } from 'context/AppContext';
import Typography from '@mui/material/Typography';
import { rewardNameMappingToPolicyId } from 'components/cards/AssetCard/rewardMapping';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useContext, useEffect, useRef, useState } from 'react';
import BoltIcon from '@mui/icons-material/Bolt';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import useFormatDate from 'hooks/useFormatDate';
import ListingTypeIcon from 'components/common/ListingTypeIcon/ListingTypeIcon';
import CustomTooltip from 'components/common/CustomTooltip';

const SalesCard = ({
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
  forceSmallDisplay,
  showRarestTrait = true,
  sale_price,
  sold_at,
  sold_for,
}) => {
  const {
    state: { localFilters, isMobile },
  } = useAppContext();
  const { showFeedback } = useContext(FeedbackContext);
  const { showRanks, showValuation, display } = localFilters;
  const [openedPopover, setOpenedPopover] = useState(false);
  const anchor = useRef(null);
  const { formatDate } = useFormatDate();

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
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

  const dateLabel = sold_at ? formatDate(sold_at) : 'No date';

  return (
    <MuiCard
      className={classNames(className, styles.muiCard)}
      sx={{ ...style }}
      onMouseLeave={handlePopoverClose}
      onMouseEnter={handlePopoverOpen}
    >
      <CardActionArea>
        <CardContent style={{ padding: '10px' }}>
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
                height: forceSmallDisplay || display === 'small' ? 160 : 230,
                minHeight: forceSmallDisplay || display === 'small' ? 160 : 230,
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
                minHeight: forceSmallDisplay || display === 'small' ? 160 : 230,
              }}
            >
              <ImageWithErrorHandler
                src={imgLinkReplace(optimized_image || image)}
                onchain_data={onchain_data}
                alt="collection"
                className={styles.image}
                style={{
                  maxHeight:
                    forceSmallDisplay || display === 'small' ? 160 : 220,
                  maxWidth:
                    forceSmallDisplay || display === 'small' ? 160 : 220,
                  height: forceSmallDisplay || display === 'small' ? 160 : 220,
                  width: forceSmallDisplay || display === 'small' ? 160 : 220,
                }}
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
                            {!showRanks ||
                            policy_id ===
                              'c76e5286fce9e6f5c9b1c5a61f74bc7fa89ed0f946ff2ae5d875f2cb'
                              ? '***'
                              : rank}
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

                            {asset_num}
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
                        <CustomTooltip
                          title={rarestTrait.displayTextNoPercentage}
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 12,
                              fontFamily: 'newgilroybold',
                            }}
                          >
                            {rarestTrait.displayTextNoPercentage}
                          </Typography>
                        </CustomTooltip>
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
                  sx={{ width: '100%', mx: 'auto', color: 'black' }}
                  className={
                    !(loading || sortOrFilerLoading) &&
                    styles[valueCoefficientStyle]
                  }
                />
              </Box>
            )}

            <Box
              className={classNames(
                styles.priceInfo,
                !price || sale_price || loading || sortOrFilerLoading
                  ? styles.outOfStock
                  : null
              )}
              onClick={() => link && window.open(link, '_blank')}
            >
              <Box
                ref={anchor}
                className={[
                  styles.priceContainer,
                  !(loading || sortOrFilerLoading) &&
                    styles[valueCoefficientStyle],
                ]}
              >
                {loading || sortOrFilerLoading ? (
                  <Box sx={{ width: '100%' }}>
                    <Skeleton animation="wave" height={14} width={'100%'} />
                    <Skeleton animation="wave" height={22} width={'100%'} />
                  </Box>
                ) : (
                  <>
                    <Box className={styles.title}>{dateLabel}</Box>
                    <Box
                      className={styles.price}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {!(sold_for || sale_price) ? (
                        'Not sold'
                      ) : (
                        <>
                          <ListingTypeIcon
                            listing_type={
                              is_smart_contract ? 'smartcontract' : listing_type
                            }
                          />
                          {formatPrice(sold_for || sale_price, currency)}
                        </>
                      )}
                    </Box>
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

export default SalesCard;
