import { useEffect, useState } from 'react';
import './WatchlistListings.module.scss';
import {
  Box,
  capitalize,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useWatchlistListings } from './useWatchlistListings';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import PuffLoader from 'react-spinners/PuffLoader';
import { useAppContext } from 'context/AppContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { useRouter } from 'next/router';
import LiveListingBox from 'components/LiveListings/LiveListingBox';
import { useAuth } from 'hooks/useAuth';
import CustomTooltip from 'components/common/CustomTooltip';

const WatchlistListings = ({ onClick }) => {
  const router = useRouter();
  const [assets, setAssets] = useState([]);
  const { loading, user } = useAuth();
  const {
    state: { isMobile, walletInfo },
  } = useAppContext();

  const connected = useWatchlistListings(true, (asset) =>
    setAssets((prev) => [asset, ...prev])
  );

  useEffect(() => {
    // if (Object.entries(selectedTraits).length === 0 && assets.length === 0) {
    //   setAssets([]);
    // } else {
    //   setAssets(
    //     assets.filter((asset) => {
    //       if (filters.traitFilterLogic === 'intersection') {
    //         return Object.entries(selectedTraits).every(
    //           ([traitKey, traitValues]) => {
    //             return traitValues.includes(asset.traits[traitKey]);
    //           }
    //         );
    //       }
    //       if (filters.traitFilterLogic === 'union') {
    //         return Object.entries(selectedTraits).some(
    //           ([traitKey, traitValues]) => {
    //             return traitValues.includes(asset.traits[traitKey]);
    //           }
    //         );
    //       }
    //     })
    //   );
    // }
  }, []);

  // deduplicate assets by assetID
  const dedupedAssets = assets.reduce((acc, asset) => {
    if (!acc.find((a) => a.assetID === asset.assetID)) {
      acc.push(asset);
    }
    return acc;
  }, []);

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
        width: 'auto',
        p: 0,
        mx: 0,
        my: 2,
        height: 'fit-content',
        maxWidth: isMobile ? 330 : '100%',
        minHeight: 150,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          pl: 5.5,
          position: 'relative',
          lineHeight: 1.5,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            <span>Live Watchlist {isMobile ? '' : 'Listings'}</span>
            <Divider
              sx={{
                height: 20,
                width: '1px',
                color: 'var(--fontColor)',
                mx: 0.5,
              }}
              orientation="vertical"
            />
            <Box
              sx={{
                color: tierColor,
                display: 'flex',
                alignItems: 'center',
                columnGap: 0.5,
              }}
            >
              <span>{capitalize(user.snipeTier || 'jungle')}</span> Permissions
              <CustomTooltip
                title="Based on your sniping platform subscription, the following delays are applied: orca: 0, yummi,apex: 3, hunter: 5  and jungle: 7 seconds. Click to open subscribe page. Snipe fee of 3% is applied to live listings purchases."
                onClick={() => router.push('/sniping')}
              />
            </Box>
          </Box>
          {(!loading && connected) || walletInfo.watchlist?.length === 0 ? (
            <CustomTooltip title="Realtime connected" placement="left">
              <div style={{ position: 'absolute', top: 15, left: 15 }}>
                <PuffLoader
                  color={tierColor}
                  loading
                  size={16}
                  speedMultiplier={1}
                />
              </div>
            </CustomTooltip>
          ) : (
            <div style={{ position: 'absolute', top: 17.5, left: 20 }}>
              <CircularProgress size={16} sx={{ color: tierColor }} />
            </div>
          )}
        </Box>
        <Chip
          label="Beta"
          size="small"
          sx={{
            borderRadius: 4,
            fontWeight: 'bold',
            backgroundColor: tierColor,
            color: 'white',
          }}
        />
      </Box>
      <Box sx={{ px: 2, pb: dedupedAssets.length === 0 ? 0 : 2 }}>
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
              <Box sx={{ pb: 2, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: 0.5,
                    textAlign: 'center',
                  }}
                >
                  <LoyaltyIcon /> <span> New listings will be shown here</span>
                </Box>
                <span
                  style={{
                    fontSize: 16,
                    color: tierColor,
                    fontFamily: 'newgilroymedium',
                  }}
                >
                  New listings for collections and assets
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
                {walletInfo.watchlist?.length > 0 && (
                  <CircularProgress
                    size={isMobile ? 16 : 22}
                    sx={{ color: tierColor }}
                  />
                )}{' '}
                <span style={{ fontSize: isMobile ? 16 : 20 }}>
                  {walletInfo.watchlist?.length > 0
                    ? 'Waiting for new listings'
                    : 'Add something to watchlist!'}
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
            }}
          >
            <Box
              sx={{
                flexWrap: 'wrap',
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                px: 2,
                pb: 3,
                alignItems:
                  dedupedAssets.length === 0 ? 'center' : 'flex-start',
                maxHeight: isMobile ? 200 : 250,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {dedupedAssets.map((asset, index) => (
                <LiveListingBox
                  asset={asset}
                  key={index}
                  onClick={onClick}
                  tier="SNIPE"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </WhiteCard>
  );
};

export default WatchlistListings;
