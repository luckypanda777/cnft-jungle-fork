import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import FilterInput from 'components/common/Input';
import PortfolioToggle from 'components/common/PortfolioToggle';
import Select from 'components/common/Select';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import FilterAssetSearch from './FilterAssetSearch';
import styles from './Filters.module.scss';
import { listingsSortOpts } from './sortOpts';

const ListingsFilters = ({
  display,
  handleDisplay,
  handleFilters,
  filters,
}) => {
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
              options={listingsSortOpts}
              name="sort"
              onChange={handleChange}
              value={filters.sort || 'dateDesc'}
            />
          </Box>
          <Box className={styles.priceFilter}>
            <Box className={styles.filterContainer}>
              <FilterButton
                name="onlyRecent"
                value={filters.onlyRecent}
                onChange={() =>
                  handleChange({
                    target: { name: 'onlyRecent', value: !filters.onlyRecent },
                  })
                }
                style={{ marginLeft: 10, width: 120, marginRight: 10 }}
              >
                Only Recent
              </FilterButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <PortfolioToggle display={display} handleDisplay={handleDisplay} />
    </Box>
  );
};

export default ListingsFilters;
