import { Box } from '@mui/system';
import { useAuth } from 'hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { useSearch } from 'hooks/useSearch';
import { useState } from 'react';
import AssetModal from 'components/modals/AssetModal';
import HuntHistoryBox from './elements/HuntHistoryBox';
import moment from 'moment';

const HuntHistory = () => {
  const { loading } = useAuth();
  const { huntList, loadingHunts } = useSearch(true);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const onClick = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  if (loading || loadingHunts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <CircularProgress sx={{ fontSize: 26 }} />
        </Box>
      </Box>
    );
  }

  if (huntList.length === 0) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', mt: 2, fontSize: 18 }}
      >
        History is empty
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mx: 5,
        mt: 3,
      }}
    >
      <Box sx={{ fontSize: 18, fontFamily: 'newgilroysemibold' }}>
        Showing last 100 hunt alerts
      </Box>
      <Box
        sx={{
          flexWrap: 'wrap',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 1,
          pb: 3,
          alignItems: 'flex-start',
          maxHeight: '60vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          mt: 2,
          pr: 2,
        }}
      >
        {huntList
          .sort(
            (a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()
          )
          .map(
            (hunt, index) =>
              hunt.history && (
                <HuntHistoryBox hunt={hunt} key={index} onClick={onClick} />
              )
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
        wallet
      />
    </Box>
  );
};

export default HuntHistory;
