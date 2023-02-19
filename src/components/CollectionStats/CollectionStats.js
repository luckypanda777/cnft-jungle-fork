import styles from './CollectionStats.module.scss';
import { Box, Divider, Tooltip } from '@mui/material';
import { nFormatter } from 'utils/formatCurrency';
import { useAppContext } from 'context/AppContext';

const CollectionStats = ({
  policies,
  addedAt,
  upcoming,
  supply,
  floor,
  volume_d,
  volume_w,
  volume_m,
  listings,
  floor_change,
  volume_change,
  listings_change,
  holder_amount,
}) => {
  const {
    state: { isMobile },
  } = useAppContext();
  const changeText = (change) =>
    change > 0
      ? `an increase of ${change}`
      : change === 0
      ? 'no change'
      : `a decrease of ${change}`;

  const Change = ({ change }) => {
    const symbol = change > 0 ? '+' : change === 0 ? '' : '-';
    const formattedChange = nFormatter(change || 340);

    return (
      <span
        className={
          change > 0
            ? styles.compareHigher
            : change === 0
            ? styles.compareEqual
            : styles.compareLower
        }
        style={{ fontSize: 10 }}
      >
        {`(${symbol}${formattedChange})`}
      </span>
    );
  };

  const floorTitle = `${floor || '-'} ADA`;
  const monthlyVolumeTitle = `${volume_m ? nFormatter(volume_m, 2) : '-'} ADA`;
  const walletsTitle = `${holder_amount || '-'} Wallets`;
  const listingsTitle = `${listings || '-'} NFTs/${Math.round(
    ((listings || 0) / supply) * 100
  )}%`;

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          px: 0,
          mb: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: 1,
          my: 1,
          mt: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15 }}>Floor</span>
          <span style={{ fontSize: 13 }}>{floorTitle}</span>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15 }}>31d Volume</span>
          <span style={{ fontSize: 13 }}>{monthlyVolumeTitle}</span>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15 }}>Holders</span>
          <span style={{ fontSize: 13 }}>{walletsTitle}</span>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15 }}>For Sale</span>
          <span style={{ fontSize: 13 }}>{listingsTitle}</span>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'center',
        flexDirection: 'column',
        fontFamily: 'newgilroymedium',
        fontSize: 14,
        rowGap: 0.25,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>Supply: </span>
          <span style={{ marginLeft: 3 }}>{supply} NFTs</span>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>Floor: </span>
          <span style={{ marginLeft: 3 }}>{floorTitle}</span>
        </Box>
        <Divider orientation="vertical" sx={{ height: 15 }} />
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>Holders: </span>
          <span style={{ marginLeft: 3 }}>{walletsTitle}</span>
        </Box>
        <Divider orientation="vertical" sx={{ height: 15 }} />
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>For Sale: </span>
          <span style={{ marginLeft: 3 }}>{listingsTitle}</span>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>24h: </span>
          <span style={{ marginLeft: 3 }}>{nFormatter(volume_d, 2)} ADA</span>
        </Box>
        <Divider orientation="vertical" sx={{ height: 15 }} />
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>7d: </span>
          <span style={{ marginLeft: 3 }}>{nFormatter(volume_w, 2)} ADA</span>
        </Box>
        <Divider orientation="vertical" sx={{ height: 15 }} />
        <Box sx={{ display: 'flex' }}>
          <span style={{ color: 'var(--rankGrey' }}>31d: </span>
          <span style={{ marginLeft: 3 }}>{nFormatter(volume_m, 2)} ADA</span>
        </Box>
      </Box>
    </Box>
  );
};

export default CollectionStats;
