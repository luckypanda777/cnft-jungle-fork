import styles from './InfinitePortfolio.module.scss';
import { CircularProgress, Paper, Button, Divider } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/system';
import { BrowserView, MobileView } from 'react-device-detect';
import FilterButton from 'components/buttons/FilterButton';
import useWindowSize from 'hooks/useWindowSize';

const DefaultComponent = (props) => (
  <Paper variant="outlined" elevation={0} {...props} />
);

function InfinitePortfolio({
  component = DefaultComponent,
  load,
  perPage = 5,
  loadingItems = 5,
  threshold = 750,
  containerStyle = {},
  headerStyle = {},
  headerTitle,
  headerTitleStyle = {},
  filterButtons = [],
  shouldRerender = false,
  height = 800,
  initialFilters = {},
  address,
  forceLoad,
  startFromPage = 1,
}) {
  const { width } = useWindowSize();
  const theme = useTheme();
  const containerRef = useRef(null);
  const Component = component;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(startFromPage);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(
    filterButtons.find((f) => f.default)
  );

  const scrollHandle = () => {
    const diff =
      containerRef.current.scrollHeight - containerRef.current.scrollTop;

    if (diff <= height + 5) {
      setShouldLoad(true);
    }
  };

  useEffect(() => {
    containerRef.current.scrollTo(0, 0);
    setPage(1);
    setShouldLoad(true);
    setInitialLoad(true);
    setData([]);
  }, [address, forceLoad]);

  useEffect(() => {
    if (shouldRerender && !loading) {
      containerRef.current.scrollTo(0, 0);
      setPage(1);
      setShouldLoad(true);
      setData([]);
    }
  }, [shouldRerender]);

  useEffect(() => {
    if (shouldLoad && !loading) {
      setLoading(true);
      load({
        page,
        perPage,
        [selectedFilter?.param]: selectedFilter?.label,
        ...initialFilters,
      })
        .then((response) => {
          if (response && response.data) {
            setData((prevData) =>
              data.length ? [...prevData, ...response.data] : [...response.data]
            );
            setPage(page + 1);
          }
        })
        .finally(() => {
          setLoading(false);
          setShouldLoad(false);
          setInitialLoad(false);
        });
    }
  }, [shouldLoad, page, selectedFilter]);

  // Initial loading & scroll listeners
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', scrollHandle);
    }

    if (initialLoad) {
      setShouldLoad(true);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', scrollHandle);
      }
    };
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShouldLoad(true);
    setPage(1);
  };

  if (!load || typeof load !== 'function') {
    throw "No 'load' function provided";
  }

  return (
    <Box sx={containerStyle}>
      {headerTitle && (
        <Box sx={headerStyle} className={styles.defaultHeaderStyle}>
          <Box sx={headerTitleStyle} className={styles.defaultHeaderTitleStyle}>
            {headerTitle}
          </Box>
          <Box className={styles.filterContainer}>
            <Box className={styles.loading}>
              {loading && (
                <CircularProgress
                  size={16}
                  sx={{ color: 'var(--logoColor)', marginTop: 0.75 }}
                />
              )}
            </Box>
            {filterButtons.length > 0 && (
              <>
                <BrowserView>
                  <Box className={styles.filterButtons}>
                    {filterButtons.map((item, index) => (
                      <FilterButton
                        key={index}
                        dense
                        disableElevation
                        variant={
                          selectedFilter?.label === item.label
                            ? 'contained'
                            : 'text'
                        }
                        size="small"
                        sx={{
                          color:
                            selectedFilter?.label === item.label
                              ? 'var(--whiteColor)'
                              : 'var(--fontColor)',
                          backgroundColor:
                            selectedFilter?.label === item.label &&
                            theme.palette.primary[600],
                          '&:hover': {
                            backgroundColor:
                              !selectedFilter?.label === item.label &&
                              theme.palette.primary[700],
                          },
                          // width: 20,
                          fontSize: 12,
                          // padding: 0.25,
                        }}
                        onClick={() => handleFilterChange(item)}
                      >
                        {item.label}
                      </FilterButton>
                    ))}
                  </Box>
                </BrowserView>
                <MobileView>
                  <Box className={styles.filterButtons}>
                    {filterButtons.map((item, index) => (
                      <Button
                        key={index}
                        dense
                        disableElevation
                        variant={
                          selectedFilter?.label === item.label
                            ? 'contained'
                            : 'text'
                        }
                        sx={{
                          color:
                            selectedFilter?.label === item.label
                              ? 'var(--whiteColor)'
                              : 'var(--fontColor)',
                          backgroundColor:
                            selectedFilter?.label === item.label &&
                            theme.palette.primary[600],
                          '&:hover': {
                            backgroundColor:
                              !selectedFilter?.label === item.label &&
                              theme.palette.primary[700],
                          },
                          fontSize: 10,
                          padding: '5px 10px',
                          minWidth: 0,
                        }}
                        onClick={() => handleFilterChange(item)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                </MobileView>
              </>
            )}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          width: '95%',
          flexDirection: 'column',
          rowGap: 1,
          height: 'fit-content',
          maxHeight: height,
          overflowY: 'scroll',
          mx: 'auto',
          px: 2,
        }}
        ref={containerRef}
      >
        <Component
          data={[
            ...(initialLoad ? new Array(24).fill(0) : data),
            ...(loading
              ? new Array(width > 1400 ? 3 : width > 1000 ? 2 : 1).fill({
                  loading: true,
                })
              : []),
          ]}
          initialLoad={initialLoad}
        />
      </Box>
    </Box>
  );
}

export default InfinitePortfolio;
