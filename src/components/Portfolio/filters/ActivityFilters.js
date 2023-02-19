import { Box } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import FilterInput from 'components/common/Input';
import PortfolioToggle from 'components/common/PortfolioToggle';
import Select from 'components/common/Select';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import styles from './Filters.module.scss';
import { activitySortOpts } from './sortOpts';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import MultiSelect from 'components/common/MultiSelect';
import { useContext } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { getDiff } from 'views/Promotion';
import useDebounce from 'hooks/useDebounce';
import FilterAssetSearch from './FilterAssetSearch';

const ActivityFilters = ({
  display,
  handleDisplay,
  handleFilters,
  filters,
}) => {
  const { showFeedback } = useContext(FeedbackContext);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dates, setDates] = useState({
    from: moment().subtract(1, 'month'),
    to: moment(),
  });

  const handleDateChange = (date, field) => {
    const diff =
      field === 'from' ? getDiff(dates.to, date) : getDiff(date, dates.from);

    if (diff < 0) {
      return showFeedback({
        message: `You cannot set negative date`,
        kind: 'error',
        duration: 5000,
      });
    }

    setDates((prev) => ({ ...prev, [field]: moment(date) }));
    handleFilters([field], moment(date));
  };

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
                { label: 'Sell', value: 'Sell' },
                { label: 'Buy', value: 'Buy' },
                { label: 'Mint', value: 'Mint' },
                { label: 'List', value: 'List' },
                { label: 'Delist', value: 'Delist' },
              ]}
              defaultValue={['Sell', 'Buy', 'Mint', 'List', 'Delist']}
              name="sort"
              onChange={handleChange}
              sx={{ mr: 1 }}
            />
          </Box>
          <Box className={styles.filterContainer}>
            <Select
              options={activitySortOpts}
              name="sort"
              onChange={handleChange}
              value={'dateAsc'}
            />
          </Box>
          <Box
            className="flex direction-row f-1"
            sx={{ columnGap: '8px', alignItems: 'center', ml: 1 }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                style={{ width: 200 }}
                open={fromOpen}
                label="From"
                value={dates.from}
                onChange={(val) => handleDateChange(val, 'from')}
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
                disableFuture
                value={dates.to}
                onChange={(val) => handleDateChange(val, 'to')}
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
        style={{ ml: 1 }}
        availableViews={['asset', 'collection']}
      />
    </Box>
  );
};

export default ActivityFilters;
