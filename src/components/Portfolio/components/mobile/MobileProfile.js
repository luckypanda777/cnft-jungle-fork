import ShareIcon from '@mui/icons-material/Share';
import { Box, Divider, Skeleton, Tooltip } from '@mui/material';
import { middlen } from 'utils/shorten';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import { useEffect, useState } from 'react';
import { ProfileSkeleton } from '../LoadingSkeletons';
import orca from 'assets/jungleorca.png';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BalanceIcon from '@mui/icons-material/Balance';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useAppContext } from 'context/AppContext';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import CustomTooltip from 'components/common/CustomTooltip';

const Profile = ({ address, bookmarked }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setTimeout(() => {
      setProfile({
        tags: ['whale', 'trader', 'active', 'bluechip'],
        nft_amount: 537,
        collection_amount: 38,
        top_holding: {
          collection_name: 'Clay Nation',
          nft_amount: 312,
          policy_id: '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728',
        },
      });
      setLoading(false);
    }, 750);
  }, [address]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <Box sx={{ flex: 1, position: 'relative', py: 2, height: 'auto' }}>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex',
          columnGap: 0.5,
          alignItems: 'center',
        }}
      >
        <BookmarkedBadge bookmarked={bookmarked} width={30} kind="profile" />
        <CustomTooltip title="Copy wallet link.">
          <ShareIcon fontSize="small" sx={{ cursor: 'pointer' }} />
        </CustomTooltip>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <img
          src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
          style={{
            borderRadius: '50%',
            width: 100,
            height: 100,
          }}
        />
        <span>{middlen(address, 7)}</span>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            columnGap: 1,
          }}
        >
          {profile.tags.includes('whale') && (
            <CustomTooltip title="Wallet is a whale. Total holdings exceed 1 million ADA.">
              <img src={orca.src} style={{ width: 36, height: 24 }} />
            </CustomTooltip>
          )}
          {profile.tags.includes('active') && (
            <CustomTooltip title="Wallet is an active trader.">
              <PublishedWithChangesIcon sx={{ color: 'var(--primaryColor)' }} />
            </CustomTooltip>
          )}
          {profile.tags.includes('trader') && (
            <CustomTooltip title="Wallet is making profit.">
              <BalanceIcon sx={{ color: 'var(--primaryColor)' }} />
            </CustomTooltip>
          )}
          {profile.tags.includes('bluechip') && (
            <CustomTooltip title="Wallet is collection blue chips.">
              <OpacityIcon sx={{ color: 'var(--primaryColor)' }} />
            </CustomTooltip>
          )}
        </Box>
        {/* <Divider sx={{ width: '100%', mx: 'auto' }} /> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            rowGap: 1,
          }}
        >
          <span>{profile.nft_amount || 357} NFTs</span>
          <Divider
            orientation="vertical"
            sx={{ height: 20, width: '2px', mx: 2 }}
          />
          <span>{profile.collection_amount || 9} Collections</span>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            rowGap: 1,
            mt: 1,
          }}
        >
          <Box
            onClick={() =>
              router.push(
                `/collections/${
                  profile.top_holding?.policy_id ||
                  '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728'
                }`
              )
            }
          >
            Top Holding:{' '}
            <span style={{ color: 'var(--primaryColor)', cursor: 'pointer' }}>
              {profile.top_holding?.collection_name || 'Clay Nation'}
            </span>
            <Box>({profile.top_holding?.nft_amount} NFTs)</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
