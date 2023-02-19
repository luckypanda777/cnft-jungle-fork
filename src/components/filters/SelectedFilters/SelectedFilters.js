import { Box } from '@mui/system';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { shorten } from 'utils/shorten';

const filterNameMapping = {
  rarityMin: 'Rarity',
  rarityMax: 'Rarity',
  rewardMin: 'Reward',
  rewardMax: 'Reward',
  priceMin: 'Price',
  priceMax: 'Price',
};

const SelectedFilters = ({
  filters,
  selectedTraits,
  handleFilterRemove,
  minMaxFilters,
  marketplacesFilters,
}) => {
  const { state, setLocalFilters } = useAppContext();
  const { width } = useWindowSize();
  const { isMobile, localFilters } = state;

  const MinMaxSelectedFilters = () => {
    return Object.entries(minMaxFilters).map(([filterType, filterValue]) => {
      const filterName = filterNameMapping[filterType];

      if (!filterName || !filterValue) return null;

      const sign = filterType.includes('Min') ? '>=' : '<=';

      return (
        <Box
          sx={{
            display: 'flex',
            border: '1px solid var(--primaryColor)',
            p: '2.5px 5px',
            borderRadius: 2,
            fontFamily: 'newgilroymedium',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--rankGrey)' }}>
              {filterNameMapping[filterType]}
            </span>
            <span style={{ fontSize: 12 }}>
              {sign} {filterValue}
            </span>
          </Box>
          <IconButton
            size="small"
            onClick={() => handleFilterRemove('minMax', filterType)}
          >
            <ClearIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      );
    });
  };

  const MarketplaceSelectedFilters = () => {
    return Object.entries(marketplacesFilters).map(
      ([filterType, filterValue]) => {
        return filterValue.map((value) => (
          <Box
            sx={{
              display: 'flex',
              border: '1px solid var(--primaryColor)',
              p: '2.5px 5px',
              borderRadius: 2,
              fontFamily: 'newgilroymedium',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--rankGrey)' }}>
                {filterType === 'marketplaces' ? 'Market' : 'Type'}
              </span>
              <span style={{ fontSize: 12 }}>{value}</span>
            </Box>
            <IconButton
              size="small"
              onClick={() => handleFilterRemove(filterType, value)}
            >
              <ClearIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ));
      }
    );
  };

  const TraitsSelectedFilters = () => {
    return Object.entries(selectedTraits).map(([traitKey, traitValue]) => {
      const name = traitKey.replace('attributes /', '');

      return traitValue.map((value) => (
        <Box
          sx={{
            display: 'flex',
            border: '1px solid var(--primaryColor)',
            p: '2.5px 5px',
            borderRadius: 2,
            fontFamily: 'newgilroymedium',
          }}
          key={value}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--rankGrey)' }}>
              {shorten(name, 15)}
            </span>
            <span style={{ fontSize: 12 }}>{value}</span>
          </Box>
          <IconButton
            size="small"
            onClick={() => handleFilterRemove('traits', traitKey, value)}
          >
            <ClearIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      ));
    });
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <MarketplaceSelectedFilters />
        <MinMaxSelectedFilters />
        <TraitsSelectedFilters />
        {/* {[selectedTraits,
minMaxFilters,
marketplacesFilters]}<span style={{ fontSize: 14, color: 'var(--primaryColor)' }}>
          Clear All
        </span> */}
      </Box>
    </Box>
  );
};

export default SelectedFilters;
