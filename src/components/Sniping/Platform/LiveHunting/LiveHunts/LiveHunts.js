import { useContext, useState } from 'react';
import './LiveHunts.module.scss';
import {
  Box,
  capitalize,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useLiveHunts } from './useLiveHunts';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import PuffLoader from 'react-spinners/PuffLoader';
import { useAppContext } from 'context/AppContext';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { useAuth } from 'hooks/useAuth';
import { useRouter } from 'next/router';
import LiveHuntBox from './LiveHuntBox';
import AssetModal from 'components/modals/AssetModal';
import CustomTooltip from 'components/common/CustomTooltip';
import { Context as SearchContext } from 'context/SearchContext';

const LiveHunts = ({ policyId }) => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const {
    state: { isMobile },
  } = useAppContext();
  const {
    state: { liveHunts },
  } = useContext(SearchContext);

  const connected = useLiveHunts(policyId, true);

  const onClick = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

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
        mt: 0,
        mx: 0,
        mb: 2,
        height: 'fit-content',
        minHeight: '60vh',
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          pl: 3,
          pr: 0,
          position: 'relative',
          lineHeight: 1.5,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 0.5 }}>
            <span>100 Most Recent Live {isMobile ? '' : 'Hunts'}</span>
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
              <CustomTooltip title="Based on your sniping platform subscription, the following delays are applied: orca: 0, yummi,apex: 3, hunter: 5  and jungle: 7 seconds. Click to open subscribe page. Snipe fee of 3% is applied to live listings purchases." />
            </Box>
          </Box>
          {!loading && connected ? (
            <CustomTooltip title="Realtime connected" placement="left">
              <div style={{ position: 'absolute', top: 15, left: -5 }}>
                <PuffLoader
                  color={tierColor}
                  loading
                  size={16}
                  speedMultiplier={1}
                />
              </div>
            </CustomTooltip>
          ) : (
            <div style={{ position: 'absolute', top: 20, left: -5 }}>
              <CircularProgress size={16} sx={{ color: tierColor }} />
            </div>
          )}
        </Box>
        <Chip
          label="Experimental"
          size="small"
          sx={{
            borderRadius: 4,
            fontWeight: 'bold',
            backgroundColor: tierColor,
            color: 'white',
          }}
        />
      </Box>
      <Box sx={{ pb: liveHunts.length === 0 ? 0 : 2 }}>
        {liveHunts.length === 0 ? (
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
                  <LoyaltyIcon /> <span> New hunts will be shown here</span>
                </Box>
                <span style={{ fontSize: 16, color: tierColor }}>
                  Showing all hunts
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
                <CircularProgress
                  size={isMobile ? 16 : 22}
                  sx={{ color: tierColor }}
                />{' '}
                <span style={{ fontSize: isMobile ? 16 : 22 }}>
                  Waiting for new listings
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
                justifyContent: 'flex-start',
                gap: 1,
                pb: 3,
                alignItems: liveHunts.length === 0 ? 'center' : 'flex-start',
                maxHeight: '70vh',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {liveHunts.map((asset, index) => (
                <LiveHuntBox asset={asset} key={index} onClick={onClick} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={{ traitlist: {} }}
        setOpenModal={setModalOpen}
        sort={{
          sort: 'score',
          sortDirection: 'asc',
        }}
      />
    </WhiteCard>
  );
};

export default LiveHunts;
