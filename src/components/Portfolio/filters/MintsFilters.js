import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import FilterInput from 'components/common/Input';
import PortfolioToggle from 'components/common/PortfolioToggle';
import Select from 'components/common/Select';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import styles from './Filters.module.scss';
import { portfolioSortOpts } from './sortOpts';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import moment from 'moment';
import FilterAssetSearch from './FilterAssetSearch';

const MintFilters = ({ display, handleDisplay, handleFilters, filters }) => {
  const { width } = useWindowSize();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dateRange, setDateRange] = useState('');

  const handleChange = (event) => {
    handleFilters([event.target.name], event.target.value);
  };

  useEffect(() => {
    handleFilters({});
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        width: '100%',
      }}
    >
      <Box className={styles.mainFilters}>
        <Box className={styles.assetFilter}>
          <Box className={styles.filterContainer} sx={{ width: '100%' }}>
            <FilterAssetSearch handleFilters={handleFilters} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box className={styles.filterContainer}>
            <Select
              options={portfolioSortOpts}
              name="sort"
              onChange={handleChange}
              value={filters.sort || 'valueDesc'}
            />
          </Box>
          <Box className={styles.priceFilter}>
            <Box className={styles.filterContainer}>
              <FilterButton
                value={filters.onlyProfit || false}
                onChange={() =>
                  handleChange({
                    target: { name: 'onlyProfit', value: !filters.onlyProfit },
                  })
                }
                style={{ marginLeft: 10, width: 100, marginRight: 10 }}
              >
                Only profit
              </FilterButton>
            </Box>
          </Box>
          <Box
            className="flex direction-row f-1"
            sx={{ columnGap: '8px', alignItems: 'center' }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                style={{ width: 200 }}
                open={fromOpen}
                label="From"
                disablePast
                value={moment()}
                onChange={handleChange}
                onClose={() => setFromOpen(false)}
                renderInput={(params) => (
                  <FilterInput onClick={() => setFromOpen(true)} {...params} />
                )}
                closeOnSelect
                ampm={false}
              />
              <span>-</span>
              <DatePicker
                style={{ width: 200 }}
                open={toOpen}
                label="To"
                disablePast
                value={moment()}
                onChange={handleChange}
                onClose={() => setToOpen(false)}
                renderInput={(params) => (
                  <FilterInput onClick={() => setToOpen(true)} {...params} />
                )}
                closeOnSelect
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
      <PortfolioToggle
        display={display}
        handleDisplay={handleDisplay}
        availableViews={['asset', 'collection']}
      />
    </Box>
  );
};

export default MintFilters;
