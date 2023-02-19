import { useContext, useEffect, useRef, useState } from 'react';
import { default as MuiDialog } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import fullLogo from 'assets/junglelogo.png';
import { useRouter } from 'next/router';
import styles from './Modal.module.scss';
import classNames from 'classnames';
import { BrowserView, isBrowser, isMobile } from 'react-device-detect';
import { Box } from '@mui/system';
import Traits from 'components/Traits';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import CollectionsIcon from '@mui/icons-material/Collections';
import { formatPrice } from 'utils/formatCurrency';
import {
  CircularProgress,
  Button,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import Accordion from 'components/common/Accordion';
import AccordionActiveLabel from 'components/common/AccordionActiveLabel';
import dynamic from 'next/dynamic';
import { useAppContext } from 'context/AppContext';
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
import { Dialog } from './Modal';

const AssetSalesHistory = dynamic(() => import('./AssetSalesHistory'), {
  ssr: false,
});

const SimplifiedModal = ({
  assetId,
  policyId,
  open,
  setOpenModal,
  onClose,
  wallet,
  currency = 'ADA',
  showTraitCount,
  isSale,
}) => {
  const router = useRouter();
  const { formatDate } = useFormatDate();
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [asset, setAsset] = useState({});
  const [openedPopover, setOpenedPopover] = useState(false);
  const { handleNFTAction, loadingNFTAction } = useNFTAction();
  const { showFeedback } = useContext(FeedbackContext);
  const [loadingRarity, setLoadingRarity] = useState(false);
  const [rarity, setRarity] = useState(null);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const { state } = useAppContext();
  const walletInfo = state.walletInfo;

  const price = asset?.listing_price || asset?.sold_for;
  const sold_at = asset?.sold_at;
  const link = asset?.listing_link;
  const marketplace = asset?.listing_marketplace;
  const anchor = useRef(null);

  useEffect(() => {
    if (asset.image) {
      fetchAssetRarity();
    }
  }, [asset.image]);

  const fetchAssetRarity = async () => {
    setLoadingRarity(true);
    try {
      await getAssetRarity({
        policyId,
        assetId,
        ipfsCID: parseCID(asset?.image || asset?.optimized_image).replace(
          '?width=600',
          ''
        ),
      }).then(({ data }) => setRarity(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRarity(false);
    }
  };

  useEffect(() => {
    if (!assetId) return;

    setLoadingAsset(true);

    const [policy_id, assetName] = assetId?.split('.') || ['', ''];

    const hexifiedAssetId = `${policy_id}${utf8ToHex(assetName)}`;

    getSingleAssetInfo(hexifiedAssetId)
      .then((res) => {
        const traitsInfo = handleUpdateInfoAfterFetch(res);
        setAsset({ ...res, ...traitsInfo });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoadingAsset(false);
      });
  }, [assetId]);

  const handleUpdateInfoAfterFetch = (response) => {
    if (!response) return;

    const collection = {};

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

    return collection;
  };

  const handleClose = () => {
    setOpenModal(false);
    // remove link to asset after close
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleOpenCollection = () => {
    router.push(`/collections/${asset.policy_id}?assetId=${asset.asset_id}`);
  };

  const handleBuy = () => {
    handleNFTAction({
      type: 'BUY',
      price: price * 1000000,
      assetId: asset.asset_id,
      isHex: 'false',
      tier: asset.isSnipe ? 'SNIPE' : 'JUNGLE',
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

  if (!asset) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box className={styles.header}>
          <img src={fullLogo.src} alt="logo" height={30} width={115} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {asset?.asset_name || ''}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomTooltip title="Open in collection view" placement="top">
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
                  image: asset.optimized_image || asset.image,
                  name: asset.asset_name,
                }}
              />
            </Box>
          </div>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className={styles.content}>
          <Box
            sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}
          >
            {loadingAsset ? (
              <Skeleton
                width={200}
                height={200}
                variant="rectangular"
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <Box className={styles.image}>
                <ImageWithErrorHandler
                  src={imgLinkReplace(asset?.optimized_image || asset?.image)}
                  alt="asset"
                  nextImg={false}
                  style={{ width: 205, height: 205, borderRadius: 10 }}
                  onchain_data={asset.onchain_data}
                  on_chain_src={asset.on_chain_src}
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
              {loadingAsset ? (
                <Skeleton
                  width={200}
                  height={50}
                  variant="rectangular"
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <Box className={styles.rankPaper}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      columnGap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Box className={styles.heading}>Jungle</Box>
                      <Box className={styles.jungleRank}>
                        {asset.rarity_rank || '-'}
                      </Box>
                    </Box>
                    <Divider
                      orientation="vertical"
                      sx={{ height: 20, mx: 'auto' }}
                    />
                    <Box>
                      <Box className={styles.heading}>Tools</Box>
                      <Box className={styles.toolsRank}>
                        {loadingRarity ? (
                          <CircularProgress
                            size={16}
                            sx={{ color: 'var--primaryColor)', p: 0.3 }}
                          />
                        ) : (
                          rarity?.toolsRank || '-'
                        )}
                      </Box>
                    </Box>
                    <Divider
                      orientation="vertical"
                      sx={{ height: 20, mx: 'auto' }}
                    />
                    <Box>
                      <Box className={styles.heading}>Opencnft</Box>
                      <Box className={styles.opencnftRank}>
                        {loadingRarity ? (
                          <CircularProgress
                            size={16}
                            sx={{ color: 'var--primaryColor)', p: 0.3 }}
                          />
                        ) : (
                          rarity?.opencnftRank || '-'
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {loadingAsset ? (
                <Skeleton
                  width={200}
                  height={50}
                  variant="rectangular"
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <Box
                  className={classNames(
                    styles.paper,
                    !price || isSale ? styles.outOfStock : styles.inverted
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
              )}
            </Box>
          </Box>
        </Box>
        {!isMobile &&
          price &&
          !isSale &&
          (!walletInfo.asset_name ? (
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
              assetId={asset.asset_id}
              asset={{ image: asset.image, name: asset.asset_name }}
            />
          ))}
        <Box className={styles.assetTraits}>
          {loadingAsset ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                width: '100%',
              }}
            >
              {new Array(6).fill(0).map(() => (
                <Skeleton
                  width="49%"
                  height={40}
                  variant="rectangular"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          ) : (
            <Traits
              asset={asset}
              collection={{
                traitlist: asset.collection_traitslist,
                supply: asset.supply,
              }}
              wallet={wallet}
              showTraitCount={showTraitCount}
              collectionTraitFloors={asset.collection_traitslist}
              handleTraitFilterFromModal={() => {}}
              loadingAssetTraitfloors={loadingAsset}
            />
          )}
        </Box>
        <Box className={styles.salesHistory}>
          <Accordion
            label={
              <AccordionActiveLabel
                label="Asset Sales History"
                variant="filled"
              />
            }
            fullWidthLabel
          >
            <Box className={styles.walletHolders}>
              <AssetSalesHistory asset={asset} />
            </Box>
          </Accordion>
        </Box>
      </DialogContent>
      <BrowserView>
        <DialogActions>
          <Box className={styles.footer}>
            <span>Disclaimer: </span>
            <p>
              The Rarity Rankings are based on what has been minted on the
              blockchain. As more NFTs are issued or official rarities released,
              they are subject to change.
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
};

export default SimplifiedModal;
