import Select from '../../common/Select';
import styles from './styles.module.scss';
import FilterButton from '../../buttons/FilterButton';
import { MobileView, BrowserView } from 'react-device-detect';
import { Box } from '@mui/system';
import FilterInput from '../../common/Input';
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
import Timer10Icon from '@mui/icons-material/Timer10';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ToggleView from '../../common/AssetToggle';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from 'components/common/CustomTooltip';
import { salesSortOpts } from 'components/Assets/filterOptions';

const SalesFilters = ({
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
}) => {
  const { state, setLocalFilters } = useAppContext();
  const { width } = useWindowSize();
  const { isMobile, localFilters } = state;
  const { showRanks, showValuation, dateFormat, display } = localFilters;

  const handleShowRanksToggle = () => {
    setLocalStorage('showRanks', !showRanks ? 'yes' : 'no');
    setLocalFilters({ showRanks: !showRanks });
  };

  const handleShowValuationToggle = () => {
    setLocalStorage('showValuation', !showValuation ? 'yes' : 'no');
    setLocalFilters({ showValuation: !showValuation });
  };

  const handleChangeDateFormat = () => {
    setLocalStorage(
      'dateFormat',
      dateFormat === 'simplified' ? 'exact' : 'simplified'
    );
    setLocalFilters({
      dateFormat: dateFormat === 'simplified' ? 'exact' : 'simplified',
    });
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
            placeholder="Search name or number"
            name="filterAssetQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Box className={styles.filterContainer}>
            <Select
              style={{ width: '100%', flexGrow: 1 }}
              options={[...salesSortOpts]}
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
            justifyContent: 'space-between',
            mb: 1,
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
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title={
                dateFormat === 'simplified'
                  ? 'Show exact dates'
                  : 'Show simplified dates'
              }
            >
              <IconButton
                className={styles.iconStyle}
                onClick={handleChangeDateFormat}
              >
                {dateFormat === 'simplified' ? (
                  <Timer10Icon />
                ) : (
                  <EventAvailableIcon />
                )}
              </IconButton>
            </CustomTooltip>
            <CustomTooltip style={{ paddingTop: 0 }} title="Reset filters">
              <IconButton
                className={styles.iconStyle}
                onClick={handleFilterReset}
              >
                <FilterListOffIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip style={{ paddingTop: 0 }} title="Refresh listings">
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
                  width > 1400 ? 'Search sales' : `Search ${totalAssets} sales`
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
                options={[...salesSortOpts]}
                name="sort"
                onChange={handleSort}
                value={sort.sort + capitalize(sort.sortDirection)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '8px',
            }}
          >
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title={
                dateFormat === 'simplified'
                  ? 'Show exact dates'
                  : 'Show simplified dates'
              }
            >
              <IconButton
                className={styles.iconStyle}
                onClick={handleChangeDateFormat}
              >
                {dateFormat === 'simplified' ? (
                  <Timer10Icon />
                ) : (
                  <EventAvailableIcon />
                )}
              </IconButton>
            </CustomTooltip>
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title={showValuation ? 'Hide valuations' : 'Show valuations'}
            >
              <IconButton
                className={styles.iconStyle}
                onClick={handleShowValuationToggle}
              >
                {showValuation ? <MoneyOffIcon /> : <AttachMoneyIcon />}
              </IconButton>
            </CustomTooltip>
            <CustomTooltip style={{ paddingTop: 0 }} title="Reset filters">
              <IconButton
                className={styles.iconStyle}
                onClick={handleFilterReset}
              >
                <FilterListOffIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip style={{ paddingTop: 0 }} title="Refresh listings">
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
              }}
            >
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    Sales
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

export default SalesFilters;
