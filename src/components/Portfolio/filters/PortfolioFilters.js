import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import FilterInput from 'components/common/Input';
import MultiSelect from 'components/common/MultiSelect';
import PortfolioToggle from 'components/common/PortfolioToggle';
import Select from 'components/common/Select';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import FilterAssetSearch from './FilterAssetSearch';
import styles from './Filters.module.scss';
import { portfolioSortOpts } from './sortOpts';

const PortfolioFilters = ({
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
    handleFilters(event);
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
            <MultiSelect
              options={[
                { label: 'Owned', value: 'Owned' },
                { label: 'Listed', value: 'Listed' },
                { label: 'Staked', value: 'Staked' },
              ]}
              defaultValue={['Owned', 'Listed', 'Staked']}
              name="sort"
              onChange={handleChange}
              sx={{ mr: 1 }}
            />
          </Box>
          <Box className={styles.filterContainer}>
            <Select
              options={portfolioSortOpts}
              name="sort"
              onChange={handleChange}
              value={filters.sort || 'valueDesc'}
            />
          </Box>
        </Box>
      </Box>
      <PortfolioToggle
        display={display}
        handleDisplay={handleDisplay}
        style={{ ml: 1 }}
        availableViews={['asset', 'collection']}
      />
    </Box>
  );
};

export default PortfolioFilters;
