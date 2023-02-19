import { useContext, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { tooltipClasses } from '@mui/material/Tooltip';
import JungleLogo from 'assets/icons/jungle.svg';
import { useRouter } from 'next/router';
import Copy from 'assets/copy-icon.svg';
import styles from './Modal.module.scss';
import classNames from 'classnames';
import { BrowserView, isBrowser, isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import Traits from 'components/Traits';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import CollectionsIcon from '@mui/icons-material/Collections';
import { formatPrice } from 'utils/formatCurrency';
import { CircularProgress, Button, Chip, Divider } from '@mui/material';
import CompareSearch from 'components/Compare/CompareSearch';
import { formatTraits } from 'utils/flattenObject';
import { getUndervaluedTextAndStyle } from 'utils/getUndervalued';
import Accordion from 'components/common/Accordion';
import AccordionActiveLabel from 'components/common/AccordionActiveLabel';
import dynamic from 'next/dynamic';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useAppContext } from 'context/AppContext';
import { rewardNameMappingToPolicyId } from 'components/cards/AssetCard/rewardMapping';
import OnchainData from 'components/modals/RealtimeModal/OnchainData';
import WalletPopover from 'components/common/WalletPopover';
import PurchasePopover from 'components/common/PurchasePopover/PurchasePopover';
import { parseCID, utf8ToHex } from 'utils/cardanoUtils';
import { getAssetRarity, getSingleAssetInfo } from 'apiProvider';
import useFormatDate from 'hooks/useFormatDate';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import useNFTAction from 'hooks/useNFTAction';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import CustomTooltip from 'components/common/CustomTooltip';

const AssetSalesHistory = dynamic(() => import('./AssetSalesHistory'), {
  ssr: false,
});

export const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'var(--assetsBg)' : '#29292B',
    borderRadius: 10,
    maxWidth: '850px',
    width: '100%',
    backgroundImage: 'none',
  },
  '& .MuiDialogContent-root': {
    padding: '0 15px',
  },
  '& .MuiDialogTitle-root': {
    padding: '20px 30px',
  },
  '& .MuiDialogActions-root': {
    padding: '20px 30px',
  },
}));

export const MediaIconButton = ({ children, color, ...rest }) => {
  return (
    <IconButton
      size="medium"
      sx={{
        borderRadius: '12px',
        backgroundColor: color,
        '&:hover': {
          backgroundColor: color,
        },
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
};

export const CopiedTooltip = styled(({ className, ...props }) => (
  <CustomTooltip
    {...props}
    arrow
    placement="top"
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    padding: '10px 15px',
  },
}));

export async function copy(text) {
  if ('clipboard' in window.navigator) {
    return await window.navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

const compareClassName = ({
  value,
  otherValue,
  isContainerStyles = false,
  lowerTheBetter = false,
}) => {
  if (!value || !otherValue || value === 'None' || otherValue === 'None') {
    return '';
  }

  let result = value > otherValue ? 1 : value < otherValue ? -1 : 0;

  if (lowerTheBetter) {
    result *= -1;
  }

  if (isContainerStyles) {
    return result > 0
      ? styles.compareContainerHigher
      : result < 0
      ? styles.compareContainerLower
      : '';
  }

  return result > 0
    ? styles.compareHigher
    : result < 0
    ? styles.compareLower
    : '';
};

const rankType = (sort) =>
  sort.sort === 'scoreWithTraitCount' ? 'Rank With TC' : 'Rank';

const rarityType = (sort) =>
  sort.sort === 'statistical'
    ? 'Probability'
    : sort.sort === 'scoreWithTraitCount'
    ? 'Rarity Score With TC'
    : 'Rarity Score';

const assetRank = (target, sort) =>
  sort.sort === 'statistical'
    ? target?.statistical_rarity_rank || '-'
    : sort.sort === 'scoreWithTraitCount'
    ? target?.tcount_rarity_rank || '-'
    : target?.rarity_rank || '-';

const assetRarity = (target, sort) =>
  sort.sort === 'statistical'
    ? target?.statistical_rarity?.toString()
      ? target?.statistical_rarity.toExponential(5)
      : '-'
    : sort.sort === 'scoreWithTraitCount'
    ? target?.tcount_rarity?.toString()
      ? Math.round(target?.tcount_rarity)
      : '-'
    : target?.rarity_score?.toString()
    ? Math.round(target?.rarity_score)
    : '-';

const AssetInfo = ({
  sort,
  currency,
  right,
  asset,
  compareWithAssetInfo,
  isCompare,
  isSale,
}) => {
  const {
    listing_price,
    listing_link,
    listing_marketplace,
    listing_type,
    optimized_image,
    image,
    asset_num,
    is_smart_contract,
    rewards,
    onchain_data,
    on_chain_src,
  } = asset;

  return (
    <Box className={styles.assetInfo}>
      {!right && (
        <Box className={styles.image}>
          <ImageWithErrorHandler
            src={imgLinkReplace(optimized_image || image)}
            alt="asset"
            nextImg={false}
            style={{ width: 205, height: 205 }}
            onchain_data={onchain_data}
            on_chain_src={on_chain_src}
          />
        </Box>
      )}
      <Box className={classNames(styles.container, styles.ranks)}>
        {/** Name */}
        {!isCompare && (
          <Box className={styles.paper}>
            <Box className={styles.heading}>Asset Number</Box>
            <Box className={styles.value}>#{asset_num}</Box>
          </Box>
        )}
        {/** Rank */}
        <Box className={styles.paper}>
          <Box className={styles.heading}>Rank</Box>
          <Box
            className={classNames(
              styles.value,
              compareClassName({
                value: assetRank(assetInfo, sort),
                otherValue: assetRank(compareWithAssetInfo, sort),
                lowerTheBetter: true,
              })
            )}
          >
            {assetRank(assetInfo, sort)}
          </Box>
        </Box>
        {/** Score */}
        <Box className={styles.paper}>
          <Box className={styles.heading}>
            {rewards
              ? 'Reward'
              : sort.sort === 'statistical'
              ? 'Probability'
              : 'Rarity Score'}
            :
          </Box>
          <Box
            className={classNames(
              styles.value,
              compareClassName({
                value: assetRarity(assetInfo, sort),
                otherValue: assetRarity(compareWithAssetInfo, sort),
              })
            )}
          >
            {'SOON' || rewards || assetRarity(assetInfo, sort)}
          </Box>
        </Box>
        <Box
          className={classNames(
            styles.paper,
            !listing_price || isSale ? styles.outOfStock : styles.inverted,
            compareClassName({
              value: listing_price,
              otherValue: compareWithassetInfo?.listing_price || 0,
              isContainerStyles: true,
              lowerTheBetter: true,
            })
          )}
        >
          <Box className={styles.heading}>
            {listing_marketplace ? listing_marketplace : 'Price'}
          </Box>
          {!listing_price ? (
            <Box className={styles.value} sx={{ fontSize: '18px !important' }}>
              None
            </Box>
          ) : (
            <Box
              className={classNames(styles.value)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px !important',
              }}
              onClick={() => window.open(listing_link, '_blank')}
            >
              {formatPrice(listing_price || 0, currency || 'ada')}
            </Box>
          )}
        </Box>
      </Box>
      {right && (
        <Box
          className={styles.image}
          sx={{ mt: isMobile && 2, mb: '0 !important' }}
        >
          <ImageWithErrorHandler
            src={imgLinkReplace(optimized_image || image)}
            alt="asset"
            nextImg={false}
            style={{ width: 205, height: 205 }}
            onchain_data={onchain_data}
            on_chain_src={on_chain_src}
          />
        </Box>
      )}
    </Box>
  );
};

const Modal = ({
  open,
  setOpenModal,
  assetId,
  policyId,
  onClose,
  collection,
  wallet,
  sort,
  currency = 'ADA',
  showTraitCount,
  handleNext,
  handlePrevious,
  handleTraitFilterFromModal,
  isSale,
  hideArrows = false,
  initialAsset = null,
  additionalAssetData = {},
}) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const headerRef = useRef(null);
  const { formatDate } = useFormatDate();
  const [loadingAssetTraitfloors, setLoadingAssetTraitfloors] = useState(false);
  const [loadingAssetInfo, setLoadingAssetInfo] = useState(false);
  const [collectionTraitFloors, setCollectionTraitFloors] = useState({});
  const [compareWithTraitFloors, setCompareWithTraitFloors] = useState({});
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareWith, setCompareWith] = useState(null);
  const [compareWithLoading, setCompareWithLoading] = useState(false);
  const [assetInfo, setAssetInfo] = useState(null);
  const [openedPopover, setOpenedPopover] = useState(false);
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const { state } = useAppContext();
  const { showRanks, showValuation } = state.localFilters;
  const walletInfo = state.walletInfo;

  const price =
    assetInfo?.listing_price || assetInfo?.price || assetInfo?.sold_for;
  const sold_at = assetInfo?.sold_at;
  const deal_coefficient = assetInfo?.deal_coefficient;
  const average_coefficient = assetInfo?.average_coefficient;
  const link = assetInfo?.listing_link;
  const reward = assetInfo?.rewards;
  const marketplace = assetInfo?.listing_marketplace;
  const assetLink = typeof window !== 'undefined' ? window.location.href : '';
  const anchor = useRef(null);

  useEffect(() => {
    if (!assetId) {
      return setAssetInfo({});
    }

    setLoadingAssetTraitfloors(true);
    if (!initialAsset) {
      setLoadingAssetInfo(true);
    }

    const [policy_id, assetName] = assetId?.split('.') || ['', ''];

    const hexifiedAssetId = `${policy_id}${utf8ToHex(assetName)}`;

    if (compareWith) {
      const [compareWithPolicyId, compareWithAssetName] =
        compareWith?.assetId?.split('.') || ['', ''];

      const compareWithHexifiedAssetId = `${compareWithPolicyId}${utf8ToHex(
        compareWithAssetName
      )}`;

      getSingleAssetInfo(compareWithHexifiedAssetId)
        .then((res) => {
          if (!initialAsset) {
            setAssetInfo({ ...res, ...additionalAssetData });
          }
          setCompareWithTraitFloors(res.traitfloors || {});
          handleUpdateInfoAfterFetch(res);
        })
        .catch((err) => console.error(err));
    }

    getSingleAssetInfo(hexifiedAssetId)
      .then((res) => {
        if (!initialAsset) {
          setAssetInfo({ ...res, ...additionalAssetData });
        }
        setCollectionTraitFloors(res.traitfloors || {});
        handleUpdateInfoAfterFetch(res);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoadingAssetTraitfloors(false);
        setLoadingAssetInfo(false);
      });
  }, [assetId, compareWith]);

  useEffect(() => {
    if (initialAsset) {
      setAssetInfo(initialAsset);
    }
  }, [initialAsset]);

  const handleUpdateInfoAfterFetch = (response) => {
    if (!response) return;

    if (
      !collection?.traitlist ||
      Object.keys(collection?.traitlist).length === 0
    ) {
      collection.traitlist = response.collection_traitslist;
      collection.collection_name = response.collection_name;
      collection.supply = Object.values(
        response.collection_traitslist?.traitcount
      )?.reduce((a, b) => a + b);
    }

    if (!assetInfo?.name) {
      assetInfo.name = response.asset_name;
    }
  };

  const handleClose = () => {
    setCompareWith(null);
    setOpenModal(false);
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleCopy = () => {
    copy(assetLink)
      .then(() => {
        setTooltipOpen(true);
        inputRef.current.select();
      })
      .catch((e) => console.error(e));
  };

  const handleOpenCollection = () => {
    router.push(`/collections/${assetInfo?.policy_id}?assetId=${assetId}`);
  };

  const handleStartCompare = (e) => {
    setCompareOpen(true);
  };

  const handleSelectCompare = (selected) => {
    const selectedTraits = formatTraits(selected, collection);

    setCompareWith({ ...selected, traits: selectedTraits });
    setCompareOpen(false);
  };

  const handleToggleLoading = (loading) => {
    setCompareWithLoading(loading);
  };

  const handleBuy = () => {
    handleNFTAction({
      type: 'BUY',
      price: price * 1000000,
      assetId: assetId,
      isHex: 'false',
      tier: assetInfo?.isSnipe ? 'SNIPE' : 'JUNGLE',
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
      },
      onFallback: () => link && window.open(link, '_blank'),
    });
  };

  const id = compareOpen ? 'simple-popover' : undefined;
  const HeaderText = () => {
    if (!assetInfo?.name) {
      return '';
    }

    if (isBrowser) {
      return `${assetInfo?.name} vs ${compareWith?.name}`;
    }

    return `#${assetInfo?.asset_num} vs #${compareWith?.asset_num}`;
  };

  if (!assetId) {
    return null;
  }

  console.log(assetInfo);

  const { valueCoefficientStyle, valueCoefficientText, trueCoefficient } =
    getUndervaluedTextAndStyle({
      showValuation,
      price,
      deal_coefficient,
      average_coefficient,
    });

  if (compareWith) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box className={styles.header}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                fontSize: compareWith ? '16px' : '18px',
              }}
              ref={headerRef}
            >
              <HeaderText />
              {wallet ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomTooltip title="Open in collection view">
                    <IconButton
                      size="small"
                      onClick={handleOpenCollection}
                      sx={{ ml: 0.5 }}
                    >
                      <CollectionsIcon />
                    </IconButton>
                  </CustomTooltip>
                  <BookmarkedBadge
                    kind="asset"
                    identifier={assetId}
                    additionalInfo={{
                      image: assetInfo?.optimized_image || assetInfo?.image,
                      name: assetInfo?.name,
                    }}
                    width={25}
                  />
                </Box>
              ) : (
                <CustomTooltip title="Find another NFT from the same collection to compare attributes with.">
                  {compareWithLoading ? (
                    <CircularProgress
                      size={15}
                      className={styles.loader}
                      sx={{ ml: 1 }}
                    />
                  ) : (
                    <Button
                      sx={{ fontSize: 10, ml: 1, p: 0.5 }}
                      variant="contained"
                      onClick={handleStartCompare}
                      color="secondary"
                    >
                      Compare
                    </Button>
                  )}
                </CustomTooltip>
              )}
              {compareOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 30,
                    zIndex: 100,
                    right: -75,
                  }}
                >
                  <CompareSearch
                    collectionId={collection?.id}
                    onSelect={handleSelectCompare}
                    setLoading={handleToggleLoading}
                  />
                </Box>
              )}
            </div>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className={styles.compareContainer}>
            <Box className={styles.compare}>
              <AssetInfo
                asset={assetInfo}
                sort={sort}
                isCompare
                compareWithAssetInfo={compareWith}
                isSale={isSale}
              />
              <Box className={styles.assetTraits}>
                <Traits
                  asset={assetInfo}
                  collection={collection}
                  wallet={wallet}
                  isCompare
                  compareWithAssetInfo={compareWith}
                  compareClassName={compareClassName}
                  showTraitCount={showTraitCount}
                  collectionTraitFloors={collectionTraitFloors}
                  compareWithTraitFloors={compareWithTraitFloors}
                  handleTraitFilterFromModal={handleTraitFilterFromModal}
                  loadingAssetTraitfloors={loadingAssetTraitfloors}
                />
              </Box>
            </Box>
            <Box className={styles.compare}>
              <AssetInfo
                asset={compareWith}
                sort={sort}
                right
                isCompare
                compareWithAssetInfo={asset}
              />
              <Box className={styles.assetTraits}>
                <Traits
                  asset={compareWith}
                  collection={collection}
                  wallet={wallet}
                  isCompare
                  compareWithAssetInfo={asset}
                  compareClassName={compareClassName}
                  showTraitCount={showTraitCount}
                  collectionTraitFloors={collectionTraitFloors}
                  compareWithTraitFloors={compareWithTraitFloors}
                  handleTraitFilterFromModal={handleTraitFilterFromModal}
                  loadingAssetTraitfloors={loadingAssetTraitfloors}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <BrowserView>
          <DialogActions>
            <Box className={styles.footer}>
              <span>Disclaimer: </span>
              <p>
                The Rarity Rankings are based on what has been minted on the
                blockchain. As more NFTs are issued or official rarities
                released, they are subject to change.
              </p>
              <p>
                Read about our calculation methods in{' '}
                <a
                  href="https://medium.com/@cnftpredator/nft-ranks-rarity-calculations-explained-by-cnft-jungle-7641f863b7c3"
                  target="_blank"
                >
                  Ranks & Rarity explained by CNFT Jungle article.
                </a>
              </p>
            </Box>
          </DialogActions>
        </BrowserView>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {!hideArrows && handlePrevious && typeof handlePrevious === 'function' && (
        <Box className={styles.leftArrow}>
          <IconButton onClick={handlePrevious}>
            <ArrowCircleLeftIcon
              sx={{
                fontSize: 50,
                color: 'var(--whiteColor)',
                fill: 'var(--fontColor)',
              }}
            />
          </IconButton>
        </Box>
      )}
      {!hideArrows && handleNext && typeof handleNext === 'function' && (
        <Box className={styles.rightArrow}>
          <IconButton onClick={handleNext}>
            <ArrowCircleRightIcon
              sx={{
                fontSize: 50,
                color: 'var(--whiteColor)',
                fill: 'var(--fontColor)',
              }}
            />
          </IconButton>
        </Box>
      )}
      {!loadingAssetInfo && (
        <DialogTitle>
          <Box className={styles.header}>
            <JungleLogo width={115} height={30} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {assetInfo?.asset_id ===
              '3bcc312ebe7cd9281ab3e3d641bf70f207012e539b0e6e7c3f1560d7.2Bill7009' ? (
                <span style={{ color: 'var(--errorColor)' }}>STOLEN</span>
              ) : (
                assetInfo?.name || assetInfo?.asset_name || ''
              )}
              {wallet ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomTooltip
                    title="Open in collection view"
                    style={{ paddingTop: 0 }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleOpenCollection}
                      sx={{ ml: 0.5 }}
                    >
                      <CollectionsIcon />
                    </IconButton>
                  </CustomTooltip>
                  <BookmarkedBadge
                    kind="asset"
                    identifier={assetId}
                    width={25}
                    additionalInfo={{
                      image: assetInfo?.optimized_image || assetInfo?.image,
                      name: assetInfo?.name,
                    }}
                  />
                </Box>
              ) : (
                <CustomTooltip
                  title="Find another NFT from the same collection to compare attributes with."
                  style={{ paddingTop: 0 }}
                >
                  {compareWithLoading ? (
                    <CircularProgress
                      size={15}
                      className={styles.loader}
                      sx={{ ml: 1 }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BookmarkedBadge
                        kind="asset"
                        identifier={assetId}
                        width={25}
                        additionalInfo={{
                          image: assetInfo?.optimized_image || assetInfo?.image,
                          name: assetInfo?.name,
                        }}
                      />
                      <Button
                        sx={{ fontSize: 10, ml: 1 }}
                        variant="contained"
                        onClick={handleStartCompare}
                        color="secondary"
                      >
                        Compare
                      </Button>
                    </Box>
                  )}
                </CustomTooltip>
              )}
              {/* <Popover
              id={id}
              open={compareOpen}
              onClose={() => setCompareOpen(false)}
            > */}
              {compareOpen && (
                <Box sx={{ position: 'absolute', top: 50 }}>
                  <CompareSearch
                    collectionId={collection?.id}
                    onSelect={handleSelectCompare}
                    setLoading={handleToggleLoading}
                  />
                </Box>
              )}
              {/* </Popover> */}
            </div>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      <DialogContent>
        {loadingAssetInfo ? (
          <Box className={styles.content}>
            <Box
              sx={{
                height: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                fontSize: 18,
                rowGap: 2,
              }}
            >
              Loading Asset Info..
              <CircularProgress size={40} />
            </Box>
          </Box>
        ) : (
          <Box className={styles.content}>
            <Box className={styles.assetInfo}>
              <Box className={styles.image}>
                <ImageWithErrorHandler
                  src={imgLinkReplace(
                    assetInfo?.optimized_image || assetInfo?.image
                  )}
                  alt="asset"
                  nextImg={false}
                  style={{ width: 205, height: 205 }}
                  onchain_data={assetInfo?.onchain_data}
                  on_chain_src={assetInfo?.on_chain_src}
                />
              </Box>
              <Box className={classNames(styles.container, styles.ranks)}>
                {/** Name */}
                <Box className={styles.paper}>
                  <Box className={styles.heading}>Asset Number</Box>
                  <Box className={styles.value}>
                    #
                    {assetInfo?.asset_num ||
                      assetInfo?.asset_name?.replace(/\D/g, '')}
                  </Box>
                </Box>
                {/** Rank */}
                <Box className={styles.rankPaper}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Box className={styles.heading}>Rank</Box>
                    <Box className={styles.jungleRank}>
                      {!showRanks ||
                      assetInfo?.policy_id ===
                        'c76e5286fce9e6f5c9b1c5a61f74bc7fa89ed0f946ff2ae5d875f2cb'
                        ? '***'
                        : assetRank(assetInfo, sort)}
                    </Box>
                  </Box>
                </Box>
                {/** Score */}
                <Box className={styles.paper}>
                  {reward ? (
                    <>
                      <Box className={styles.heading}>Reward</Box>
                      <Box className={styles.value}>
                        {rewardNameMappingToPolicyId[assetInfo?.policy_id].show
                          ? `${reward} $${
                              rewardNameMappingToPolicyId[assetInfo?.policy_id]
                                .label
                            }`
                          : '$SOON'}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box className={styles.heading}>{rarityType(sort)}</Box>
                      <Box className={styles.value}>
                        {assetRarity(assetInfo, sort)}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>

              <Box className={classNames(styles.container, styles.price)}>
                <Box
                  className={classNames(
                    styles.paper,
                    !price || isSale ? styles.outOfStock : styles.inverted,
                    styles[valueCoefficientStyle]
                  )}
                  style={{ cursor: 'pointer' }}
                  ref={anchor}
                  onMouseLeave={handlePopoverClose}
                  onMouseEnter={handlePopoverOpen}
                >
                  <Box className={styles.heading}>
                    {marketplace
                      ? marketplace
                      : isSale
                      ? formatDate(sold_at)
                      : 'Price'}
                  </Box>
                  {!price ? (
                    <Box className={styles.value}>None</Box>
                  ) : (
                    <Box
                      className={styles.value}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={handleBuy}
                    >
                      {loadingNFTAction ? (
                        <CircularProgress
                          size={22}
                          sx={{ color: 'white', mt: 0.5 }}
                        />
                      ) : (
                        formatPrice(price, currency)
                      )}
                    </Box>
                  )}
                </Box>
                <Box className={styles.paper} style={{ flexGrow: 1 }}>
                  <Box
                    className={styles.heading}
                    style={{ marginBottom: '6px' }}
                  >
                    Share by link:
                  </Box>
                  <Box
                    className={styles.share}
                    style={{ marginBottom: '10px' }}
                  >
                    <ClickAwayListener
                      onClickAway={() => setTooltipOpen(false)}
                    >
                      <CopiedTooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={() => setTooltipOpen(false)}
                        open={tooltipOpen}
                        title="Copied!"
                        disableHoverListener
                      >
                        <input
                          ref={inputRef}
                          className={styles.linkInput}
                          readOnly
                          value={assetLink || ''}
                        />
                      </CopiedTooltip>
                    </ClickAwayListener>
                    <MediaIconButton
                      color="var(--secondaryColor)"
                      onClick={handleCopy}
                    >
                      <Copy />
                    </MediaIconButton>
                  </Box>
                  <Button
                    className={styles.heading}
                    sx={{ fontSize: 12, borderRadius: 1 }}
                    onClick={() =>
                      window.open(
                        `https://pool.pm/${encodeURIComponent(assetId)}`,
                        '_blank'
                      )
                    }
                    variant="contained"
                    color="secondary"
                  >
                    Check on pool.pm
                  </Button>
                  {/*<Box className={styles.share}>
                  <TwitterShareButton
                    title={`Check out ${assetInfo?.name} on the CNFT Jungle:`}
                    url={assetLink}
                  >
                    <TwitterIcon
                      size={32}
                      round
                      // iconFillColor="#54acee"
                    />
                  </TwitterShareButton>
                  <TelegramShareButton
                    title={`Check out ${assetInfo?.name} on the CNFT Jungle:`}
                    url={assetLink}
                  >
                    <TelegramIcon
                      size={32}
                      round
                      // iconFillColor="#54acee"
                    />
                  </TelegramShareButton>
                </Box> */}
                </Box>
              </Box>
            </Box>
            {!isMobile &&
              price &&
              !isSale &&
              (!walletInfo.name ? (
                <WalletPopover
                  anchor={anchor}
                  open={openedPopover}
                  handleClose={handlePopoverClose}
                  handleOpen={handlePopoverOpen}
                />
              ) : (
                <PurchasePopover
                  purchaseLoading={loadingNFTAction}
                  anchor={anchor}
                  open={openedPopover}
                  handleClose={handlePopoverClose}
                  handleOpen={handlePopoverOpen}
                  handlePurchase={handleBuy}
                  handleLink={() => link && window.open(link, '_blank')}
                  assetId={assetId}
                  asset={{ image: assetInfo?.image, name: assetInfo?.name }}
                />
              ))}
            <Box className={styles.salesHistory}>
              <Accordion
                sharp={false}
                label={
                  <AccordionActiveLabel
                    label="Asset Sales History"
                    variant="filled"
                  />
                }
              >
                <Box className={styles.walletHolders}>
                  <AssetSalesHistory
                    asset={{ ...assetInfo, asset_id: assetId }}
                  />
                </Box>
              </Accordion>
            </Box>
            <Box className={styles.assetTraits}>
              <Traits
                asset={assetInfo}
                collection={collection}
                wallet={wallet}
                showTraitCount={showTraitCount}
                collectionTraitFloors={collectionTraitFloors}
                handleTraitFilterFromModal={handleTraitFilterFromModal}
                loadingAssetTraitfloors={loadingAssetTraitfloors}
              />
            </Box>
            {/* <Box className={styles.onchainData}>
            <Accordion
              sharp={false}
              label={
                <AccordionActiveLabel
                  label={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      Onchain Data
                    </span>
                  }
                  variant="filled"
                />
              }
            >
              <Box className={styles.walletHolders}>
                <OnchainData onchainData={assetInfo?.onchain_data} />
              </Box>
            </Accordion>
          </Box> */}
          </Box>
        )}
      </DialogContent>
      {!loadingAssetInfo && (
        <BrowserView>
          <DialogActions>
            <Box className={styles.footer}>
              <span>Disclaimer: </span>
              <p>
                The Rarity Rankings are based on what has been minted on the
                blockchain. As more NFTs are issued or official rarities
                released, they are subject to change.
              </p>
              <p>
                Read about our calculation methods in{' '}
                <a
                  href="https://medium.com/@cnftpredator/nft-ranks-rarity-calculations-explained-by-cnft-jungle-7641f863b7c3"
                  target="_blank"
                >
                  Ranks & Rarity explained by CNFT Jungle article.
                </a>
              </p>
            </Box>
          </DialogActions>
        </BrowserView>
      )}
    </Dialog>
  );
};

export default Modal;
