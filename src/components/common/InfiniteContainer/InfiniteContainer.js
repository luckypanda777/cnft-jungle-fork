import styles from './InfiniteContainer.module.scss';
import { CircularProgress, Paper, Button } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/system';
import { BrowserView, MobileView } from 'react-device-detect';

const DefaultComponent = (props) => (
  <Paper variant="outlined" elevation={0} {...props} />
);

function InfiniteContainer({
  component = DefaultComponent,
  load,
  initialLoad = false,
  renderItem = () => undefined,
  perPage = 5,
  loadingItems = 5,
  threshold = 300,
  containerStyle = {},
  headerStyle = {},
  headerTitle = 'Default Title',
  headerTitleStyle = {},
  filterButtons = [],
  shouldRerender = false,
}) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const Component = component;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    filterButtons.find((f) => f.default)
  );

  const scrollHandle = () => {
    const diff =
      containerRef.current.scrollHeight - containerRef.current.scrollTop;

    if (diff <= threshold) {
      setShouldLoad(true);
    }
  };

  useEffect(() => {
    if (shouldRerender && !loading) {
      setPage(1);
      setShouldLoad(true);
      setData([]);
    }
  }, [shouldRerender]);

  useEffect(() => {
    if (shouldLoad && !loading) {
      setLoading(true);
      load({ page, perPage, [selectedFilter?.param]: selectedFilter?.label })
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
    <Box style={containerStyle}>
      <Box style={headerStyle} className={styles.defaultHeaderStyle}>
        <Box
          style={headerTitleStyle}
          className={styles.defaultHeaderTitleStyle}
        >
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
                    <Button
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
                        width: 20,
                        fontSize: 12,
                        padding: 0.25,
                      }}
                      onClick={() => handleFilterChange(item)}
                    >
                      {item.label}
                    </Button>
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
      <Component>
        <div ref={containerRef} className={styles.scrollEl}>
          {(data.length ? data : Array.from(new Array(loadingItems))).map(
            renderItem
          )}
        </div>
      </Component>
    </Box>
  );
}

export default InfiniteContainer;
