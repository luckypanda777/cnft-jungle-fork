import { Box, Button, CircularProgress, Divider } from '@mui/material';
import styles from './ListPeriodFilters.module.scss';
import { useAppContext } from 'context/AppContext';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarRateIcon from '@mui/icons-material/StarRate';
import useDebounce from 'hooks/useDebounce';
import FilterInput from 'components/common/Input';
import useWindowSize from 'hooks/useWindowSize';
import Select from 'components/common/Select';
import CustomTooltip from 'components/common/CustomTooltip';

const PRIMARY_PERIODS = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '12h', value: '12h' },
];

const SECONDARY_PERIODS = [
  { label: '1d', value: '1d' },
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '31d', value: '31d' },
  { label: 'All', value: 'all' },
];

const ListPeriodFilters = ({
  loading,
  handleFilterChange,
  style,
  hideSearchBar = false,
}) => {
  const theme = useTheme();
  const { state, setLocalFilters } = useAppContext();
  const {
    localFilters: { chartType },
  } = state;
  const [period, setPeriod] = useState('1d');
  const [chartOrder, setChartOrder] = useState('hl');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { width } = useWindowSize();

  const handleSwitch = (field, value) => {
    if (field === 'chartType') {
      return setLocalFilters({ chartType: value });
    }

    let setState;

    switch (field) {
      case 'period':
        setState = setPeriod;
        break;
      case 'chartOrder':
        setState = setChartOrder;
        break;
    }

    setState(value);
    handleFilterChange(field, value);
  };

  const btnStyle = (currValue, value) => ({
    color: currValue === value ? 'var(--whiteColor)' : 'var(--fontColor)',
    backgroundColor: currValue === value && 'var(--logoColor)',
    '&:hover': {
      backgroundColor:
        currValue === value
          ? 'var(--logoColor)'
          : theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
    },
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  useEffect(() => {
    handleFilterChange('query', debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Box className={styles.listPeriod} style={style}>
      <Box className={styles.listPeriodContainer}>
        <Box className={styles.containerPeriod}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {width <= 900 && (
              <Select
                options={[...PRIMARY_PERIODS, ...SECONDARY_PERIODS]}
                onChange={(e) => handleSwitch('period', e.target.value)}
                value={period}
                disabled={loading}
              />
            )}
            {width && width >= 1200 && (
              <CustomTooltip title="Trending collection are updated realtime">
                <LocalFireDepartmentIcon fontSize="small" sx={{ mr: 0.5 }} />
              </CustomTooltip>
            )}
            {width > 900 &&
              PRIMARY_PERIODS.map(({ label, value }, index) => {
                return (
                  <Button
                    key={index}
                    dense
                    disabled={loading}
                    disableElevation
                    disableRipple
                    size="small"
                    variant="text"
                    className={styles.periodBtn}
                    sx={() => btnStyle(period, value)}
                    onClick={() => handleSwitch('period', value)}
                  >
                    {label}
                  </Button>
                );
              })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {width && width >= 1200 && (
              <CustomTooltip title="Top collection are updated realtime">
                <StarRateIcon fontSize="small" sx={{ mr: 0.5 }} />
              </CustomTooltip>
            )}
            {width > 900 &&
              SECONDARY_PERIODS.map(({ label, value }, index) => {
                return (
                  <Button
                    key={index}
                    dense
                    disabled={loading}
                    disableElevation
                    size="small"
                    variant="text"
                    className={styles.periodBtn}
                    sx={() => btnStyle(period, value)}
                    onClick={() => handleSwitch('period', value)}
                  >
                    {label}
                  </Button>
                );
              })}
            {!hideSearchBar && (
              <>
                <Divider orientation="vertical" sx={{ ml: 2, mr: 2 }} />
                <FilterInput
                  placeholder="Search by name or policy id"
                  onChange={handleChange}
                  className={styles.searchInput}
                  sx={{ mr: '8px' }}
                />
              </>
            )}
            <Divider
              className={styles.filtersText}
              orientation="vertical"
              sx={{ ml: 1, mr: 2 }}
            />
            <span className={styles.filtersText}>
              Realtime data with 1m cache
            </span>
          </div>
        </Box>
        <Box className={styles.secondaryFilters}>
          <Box className={styles.loadingPeriod}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={18} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {width && width >= 1200 && (
                <CustomTooltip title="Sort by: H/L - by change amount. % Change - by change percentage.">
                  <CompareArrowsIcon
                    fontSize="small"
                    sx={{ transform: 'rotate(90deg)', mr: 0.5 }}
                  />
                </CustomTooltip>
              )}
              <Button
                dense
                disableElevation
                disabled={loading}
                disableRipple
                size="small"
                variant="text"
                className={styles.periodBtn}
                sx={() => btnStyle(chartOrder, 'hl')}
                onClick={() => handleSwitch('chartOrder', 'hl')}
              >
                H/L
              </Button>
              <Button
                dense
                disableElevation
                disabled={loading}
                disableRipple
                size="small"
                variant="text"
                className={styles.periodBtn}
                sx={() => btnStyle(chartOrder, 'change')}
                onClick={() => handleSwitch('chartOrder', 'change')}
              >
                % Change
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListPeriodFilters;
