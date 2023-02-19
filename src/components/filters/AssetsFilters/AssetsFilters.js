import Select from 'components/common/Select';
import styles from './AssetsFilters.module.scss';
import FilterButton from 'components/buttons/FilterButton';
import { MobileView, BrowserView } from 'react-device-detect';
import { Box } from '@mui/system';
import FilterInput from 'components/common/Input';
import { capitalize, CircularProgress, IconButton } from '@mui/material';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppContext } from 'context/AppContext';
import { setLocalStorage } from 'utils/isEmptyObject';
import Cookies from 'js-cookie';
import { advancedSortOpts, sortOpts } from 'components/Assets/filterOptions';
import ToggleView from 'components/common/AssetToggle';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from 'components/common/CustomTooltip';

const AssetsFilters = ({
  sort,
  query,
  setQuery,
  loading,
  filters,
  handleSort,
  handleFilterChange,
  handleFilterReset,
  handleListingsRefresh,
  totalAssets,
  advanced,
  setAdvanced,
}) => {
  const { state, setLocalFilters } = useAppContext();
  const { width } = useWindowSize();
  const { isMobile, localFilters } = state;
  const { showRanks, showValuation, display } = localFilters;

  const handleShowRanksToggle = () => {
    setLocalStorage('showRanks', !showRanks ? 'yes' : 'no');
    setLocalFilters({ showRanks: !showRanks });
  };

  const handleShowValuationToggle = () => {
    setLocalStorage('showValuation', !showValuation ? 'yes' : 'no');
    setLocalFilters({ showValuation: !showValuation });
  };

  const handleDisplay = (newValue) => {
    if (newValue !== null) {
      Cookies.set('asset_card_variant', newValue, { expires: 365 * 5 });
      setLocalFilters({ display: newValue });
    }
  };

  // hack for now but actually would be nice to refactor filters
  // to separate main component & children.
  // without extra re-renders and unneeded dependencies
  const handleInput = (e) => {
    if (filters.onSale) {
      handleFilterChange('onSale', false);
    }
    setQuery(e.target.value);
  };

  return (
    <>
      <MobileView className={styles.mobileContainer}>
        <Box className={styles.filterContainer} sx={{ width: '100%' }}>
          <FilterInput
            placeholder="Search Asset"
            name="filterAssetQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Box className={styles.filterContainer}>
            <Select
              style={{ width: '100%', flexGrow: 1 }}
              options={[...sortOpts, ...(advanced ? advancedSortOpts : [])]}
              name="sort"
              onChange={handleSort}
              value={sort.sort + capitalize(sort.sortDirection)}
            />
            <FilterButton
              name="onSale"
              value={filters.onSale}
              onChange={handleFilterChange}
              style={{ minWidth: 80 }}
            >
              On sale
            </FilterButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            mb: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '8px',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            <CustomTooltip title="Reset filters" style={{ paddingTop: 0 }}>
              <IconButton
                className={styles.iconStyle}
                onClick={handleFilterReset}
              >
                <FilterListOffIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title="Refresh listings" style={{ paddingTop: 0 }}>
              <IconButton
                className={styles.iconStyle}
                onClick={handleListingsRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </CustomTooltip>
            <ToggleView handleDisplay={handleDisplay} display={display} />
          </Box>
        </Box>
      </MobileView>
      <BrowserView className={styles.galleryFilters}>
        <Box className={styles.mainFilters}>
          <Box className={styles.assetFilter}>
            <Box className={styles.filterContainer} sx={{ width: '100%' }}>
              <FilterInput
                placeholder={
                  width > 1400 ? 'Search Asset' : `Search ${totalAssets} Assets`
                }
                name="filterAssetQuery"
                value={query}
                onChange={handleInput}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box className={styles.filterContainer}>
              <Select
                options={[...sortOpts, ...(advanced ? advancedSortOpts : [])]}
                name="sort"
                onChange={handleSort}
                value={sort.sort + capitalize(sort.sortDirection)}
              />
            </Box>
            <Box className={styles.priceFilter}>
              <Box className={styles.filterContainer}>
                <FilterButton
                  name="onSale"
                  value={filters.onSale}
                  onChange={handleFilterChange}
                  style={{ marginLeft: 10, width: 80 }}
                >
                  On sale
                </FilterButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '8px',
            }}
          >
            <CustomTooltip title="Reset filters" style={{ paddingTop: 0 }}>
              <IconButton
                className={styles.iconStyle}
                onClick={handleFilterReset}
              >
                <FilterListOffIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title="Refresh listings" style={{ paddingTop: 0 }}>
              <IconButton
                className={styles.iconStyle}
                onClick={handleListingsRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </CustomTooltip>
            <ToggleView handleDisplay={handleDisplay} display={display} />
          </Box>
        </Box>
        {width > 1400 && (
          <Box className={styles.secondaryFilters}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 200,
                justifyContent: 'flex-end',
                pr: 1,
              }}
            >
              {!isMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'newgilroysemibold',
                  }}
                >
                  <span className={styles.assetCount}>
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress
                          size={15}
                          sx={{ color: 'var(--logoColor)', mr: 1 }}
                        />
                      </Box>
                    ) : (
                      <span
                        style={{
                          marginRight: 6,
                          fontWeight: 'bold',
                          color: 'var(--logoColor)',
                        }}
                      >
                        {totalAssets}
                      </span>
                    )}{' '}
                    Assets
                  </span>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </BrowserView>
    </>
  );
};

export default AssetsFilters;
