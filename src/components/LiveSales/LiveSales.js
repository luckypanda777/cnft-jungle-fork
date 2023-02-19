import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LiveSales.module.scss';
import { Box, Chip, CircularProgress } from '@mui/material';
import { useLiveSales } from 'hooks/useLiveSales';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import PuffLoader from 'react-spinners/PuffLoader';
import { useAppContext } from 'context/AppContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/router';
import LiveListingBox from './LiveSaleBox';
import styles from './LiveSales.module.scss';
import CustomTooltip from 'components/common/CustomTooltip';
import { getCollectionSales } from 'apiProvider';
import PauseIcon from '@mui/icons-material/Pause';

const LiveSales = ({
  policyId,
  filters,
  selectedTraits,
  onClick,
  isHovering,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const [assets, setSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const { loading, user } = useAuth();
  const {
    state: { isMobile },
  } = useAppContext();

  const connected = useLiveSales(policyId, true, (asset) =>
    setSales((prev) => [asset, ...prev])
  );

  useEffect(() => {
    fetchCurrentSales();
    // setSales([]);
  }, [policyId]);

  useEffect(() => {
    setIsPaused(isHovering);
  }, [isHovering]);

  const fetchCurrentSales = async () => {
    try {
      setLoadingSales(true);
      const data = await getCollectionSales(policyId, {
        page: 1,
        perPage: 50,
        sort: 'recent',
        sortDirection: 'desc',
      });

      setSales(
        data.assets.map((asset) => ({
          assetImage: asset.image,
          assetName: asset.name,
          assetID: asset.asset_id,
          price: asset.sold_for * 1000000,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSales(false);
    }
  };

  // deduplicate assets by assetID
  const dedupedSales = useMemo(
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
            <span>Live {isMobile ? '' : 'Sales'}</span>
            <CustomTooltip
              title="Based on your sniping platform subscription, the following delays are applied: orca: 0, yummi,apex: 3, hunter: 5  and jungle: 7 seconds. Click to open subscribe page."
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
      {loadingSales ? (
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
            pb: dedupedSales.length === 0 ? 0 : 2,
            overflow: 'hidden',
          }}
        >
          {dedupedSales.length === 0 ? (
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
                    <LoyaltyIcon /> <span> New sales will be shown here</span>
                  </Box>
                  <span
                    style={{
                      fontSize: 16,
                      color: tierColor,
                      fontFamily: 'newgilroymedium',
                    }}
                  >
                    {Object.entries(selectedTraits).length === 0
                      ? 'Showing all new sales'
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
                    Waiting for new sales..
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
                  overflowX: 'hidden',
                  flexDirection: 'column',
                  px: 2,
                }}
              >
                {dedupedSales.map((asset, index) => (
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

export default LiveSales;
