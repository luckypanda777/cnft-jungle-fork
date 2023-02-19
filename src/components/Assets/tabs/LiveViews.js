import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import LiveListings from 'components/LiveListings';
import LiveSales from 'components/LiveSales';
import useHover from '@react-hook/hover';
import useWindowSize from 'hooks/useWindowSize';
import AssetModal from 'components/modals/AssetModal';

const LiveViews = ({ policyId, selectedTraits, filters, collection }) => {
  const { width } = useWindowSize();
  const target = useRef(null);
  const isHovering = useHover(target, { enterDelay: 200, leaveDelay: 200 });
  const [selectedAsset, setSelectedAsset] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  useEffect(() => {}, [isHovering]);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 2,
        columnGap: width < 1250 ? 2 : 1,
        width: '100%',
      }}
      ref={target}
    >
      <Box sx={{ flex: 1, width: '100%' }}>
        <LiveListings
          policyId={policyId}
          selectedTraits={selectedTraits}
          filters={filters}
          isHovering={isHovering}
          onClick={onClick}
        />
      </Box>
      <Box sx={{ flex: 1, width: '100%' }}>
        <LiveSales
          policyId={policyId}
          selectedTraits={selectedTraits}
          filters={filters}
          isHovering={isHovering}
          onClick={onClick}
        />
      </Box>
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset.asset_id}
        additionalAssetData={selectedAsset}
        policyId={policyId}
        collection={collection}
        setOpenModal={setModalOpen}
        sort={{
          sort: 'score',
          sortDirection: 'asc',
        }}
        isSale={selectedAsset.type === 'sale'}
      />
    </Box>
  );
};

export default LiveViews;
