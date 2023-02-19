import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LiveListings.module.scss';
import { Box, Chip, CircularProgress } from '@mui/material';
import { useLiveListings } from 'hooks/useLiveListings';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import PuffLoader from 'react-spinners/PuffLoader';
import { useAppContext } from 'context/AppContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/router';
import LiveListingBox from './LiveListingBox';
import CustomTooltip from 'components/common/CustomTooltip';
import { getAssets } from 'apiProvider';
import PauseIcon from '@mui/icons-material/Pause';

const LiveListings = ({
  policyId,
  filters,
  selectedTraits,
  onClick,
  isHovering,
}) => {
  const router = useRouter();
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const { loading, user } = useAuth();
  const {
    state: { isMobile },
  } = useAppContext();
  const [isPaused, setIsPaused] = useState(false);

  const connected = useLiveListings(policyId, true, (asset) =>
    setAssets((prev) => [asset, ...prev])
  );

  useEffect(() => {
    fetchCurrentListings();
    // setAssets([]);
  }, [policyId]);

  useEffect(() => {
    setIsPaused(isHovering);
  }, [isHovering]);

  const fetchCurrentListings = async () => {
    try {
      setLoadingAssets(true);
      const data = await getAssets(policyId, {
        page: 1,
        perPage: 50,
        onSale: true,
        sort: 'listed',
        sortDirection: 'desc',
      });

      setAssets(
        data.assets.map((asset) => ({
          assetImage: asset.image,
          assetName: asset.name,
          assetID: asset.asset_id,
          price: asset.listing_price * 1000000,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAssets(false);
    }
  };

  // deduplicate assets by assetID
  const dedupedAssets = useMemo(
    () =>
      assets
        .filter((asset) => {
          if (filters.traitFilterLogic === 'intersection') {
            return Object.entries(selectedTraits).every(
              ([traitKey, traitValues]) => {
                return traitValues?.includes(asset.traits?.[traitKey]);
              }
            );
          }

          if (filters.traitFilterLogic === 'union') {
            return Object.entries(selectedTraits).some(
              ([traitKey, traitValues]) => {
                return traitValues?.includes(asset.traits?.[traitKey]);
              }
            );
          }

          return asset;
        })
        .reduce((acc, asset) => {
          if (!acc.find((a) => a.assetID === asset.assetID)) {
            acc.push(asset);
          }
          return acc;
        }, []),
    [assets, selectedTraits]
  );

  const tierColor =
    user.snipeTier === 'orca'
      ? 'var(--logoColor)'
      : user.snipeTier === 'apex'
      ? 'goldenrod'
      : user.snipeTier === 'hunter'
      ? '#f89993'
      : user.snipeTier === 'yummi'
      ? 'var(--primaryColor)'
      : 'var(--undervaluedColor)';

  console.log(dedupedAssets);

  return (
    <WhiteCard
      sx={{
        p: 0,
        mt: 0,
        mx: 0,
        mb: 2,
        height: 'fit-content',
        maxWidth: 'auto',
        height: '100%',
        minWidth: 360,
        maxHeight: 660,
        minHeight: 660,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          position: 'relative',
          lineHeight: 1.5,
          alignItems: 'center',
          // width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 18,
            }}
          >
            <span>Live {isMobile ? '' : 'Listings'}</span>
            <CustomTooltip
              title="Based on your sniping platform subscription, the following delays are applied: orca: 0, yummi,apex: 3, hunter: 5  and jungle: 7 seconds. Click to open subscribe page. Snipe fee of 3% is applied to live listings purchases."
              onClick={() => router.push('/manage-subscription')}
              style={{ paddingTop: 6 }}
            />
          </Box>

          {isPaused ? (
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
              <PauseIcon sx={{ color: 'var(--goldenCard)' }} />
              Paused
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
              <Box sx={{ pb: 1, pr: 3 }}>
                <CustomTooltip title="Realtime connected" placement="left">
                  <PuffLoader
                    color={tierColor}
                    loading
                    size={16}
                    speedMultiplier={1}
                  />
                </CustomTooltip>
              </Box>
              Live
            </Box>
          )}
        </Box>
      </Box>
      {loadingAssets ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            minWidth: 360,
            px: 2,
          }}
        >
          <CircularProgress sx={{ fontSize: 26, mt: 0 }} />
        </Box>
      ) : (
        <Box
          sx={{
            px: 2,
            pb: dedupedAssets.length === 0 ? 0 : 2,
            overflow: 'hidden',
          }}
        >
          {dedupedAssets.length === 0 ? (
            <Box
              style={{
                fontSize: isMobile ? 16 : 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {!loading && connected ? (
                <Box sx={{ pb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 0.5,
                    }}
                  >
                    <LoyaltyIcon />{' '}
                    <span> New listings will be shown here</span>
                  </Box>
                  <span
                    style={{
                      fontSize: 16,
                      color: tierColor,
                      fontFamily: 'newgilroymedium',
                    }}
                  >
                    {Object.entries(selectedTraits).length === 0
                      ? 'Showing all new listings'
                      : 'Showing for Selected Traits'}
                  </span>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: 1,
                    pb: 2,
                  }}
                >
                  <span style={{ fontSize: isMobile ? 16 : 22 }}>
                    Waiting for new listings..
                  </span>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: '100%',
                  maxHeight: 575,
                  gap: 0.5,
                  overflowY: 'auto',
                  flexDirection: 'column',
                  overflowX: 'hidden',
                  px: 2,
                }}
              >
                {dedupedAssets.map((asset, index) => (
                  <LiveListingBox
                    tier="SNIPE"
                    asset={asset}
                    key={asset.assetID + index}
                    onClick={onClick}
                    sx={{ width: '100%' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </WhiteCard>
  );
};

export default LiveListings;
