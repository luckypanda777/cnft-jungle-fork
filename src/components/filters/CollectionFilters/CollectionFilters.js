import {
  Box,
  capitalize,
  CircularProgress,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import styles from './CollectionFilters.module.scss';
import FilterInput from 'components/common/Input';
import Select from 'components/common/Select';
import FilterButton from 'components/buttons/FilterButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';
import { MobileView, BrowserView } from 'react-device-detect';
import CustomTooltip from 'components/common/CustomTooltip';

const nonCalendarSortOpts = [
  { label: 'Most volume (24h)', value: 'volumedayDesc' },
  { label: 'Floor price: High to Low', value: 'floorDesc' },
  { label: 'Floor price: Low to High', value: 'floorAsc' },
];

const CollectionFilters = ({
  calendar,
  filters,
  sort,
  handleSort,
  handleFilterChange,
  setAddCollectionOpen,
  loading,
  totalCollections,
}) => {
  const size = useWindowSize();
  const { state, setLocalFilters } = useAppContext();
  const { isMobile, localFilters } = state;
  const { display } = localFilters;

  const sortOpts = [
    { label: 'Most Liked', value: 'popularityDesc' },
    ...(calendar ? [] : nonCalendarSortOpts),
    { label: 'Name: A-Z', value: 'nameAsc' },
    { label: 'Name: Z-A', value: 'nameDesc' },
    { label: calendar ? 'Soonest' : 'Most Recent', value: 'recentAsc' },
    { label: calendar ? 'Latest' : 'Oldest', value: 'recentDesc' },
  ];

  return (
    <>
      <MobileView>
        <Box
          sx={{
            display: 'flex',
            position: 'sticky',
            zIndex: 200,
            top: '120px',
            background: 'var(--assetsBg)',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <Box className={styles.mobileFilters}>
            <Box className={styles.filterContainer}>
              <FilterInput
                placeholder="Search Collection"
                name="collectionFilterQuery"
                //value={query}
                //onChange={(e) => setQuery(e.target.value)}
              />
            </Box>
            {calendar ? (
              <>
                <Box className={styles.filterContainer}>
                  <Box className={styles.filterHeading}>
                    Submit your collection
                  </Box>
                  <FilterButton
                    pressable
                    onClick={() => setAddCollectionOpen(true)}
                  >
                    Add collection
                  </FilterButton>
                </Box>
                <Box className={styles.filterContainer}>
                  <Box className={styles.filterHeading}>Disclaimer</Box>
                  <span
                    style={{
                      marginTop: 10,
                      color: 'var(--fontColor)',
                      fontSize: 12,
                      fontFamily: 'newgilroysemibold',
                    }}
                  >
                    This is not an advise. Please do your own research. See{' '}
                    <Link
                      className={styles.filterLink}
                      href="https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      T&C
                    </Link>
                  </span>
                </Box>
              </>
            ) : (
              <Box
                className={styles.filterContainer}
                sx={{
                  columnGap: '8px',
                  justifyContent: 'space-between',
                  margin: '0 2px',
                }}
              >
                <CustomTooltip
                  title="Collection is linked to a correct policy"
                  placement="top"
                  style={{ paddingTop: 0 }}
                >
                  <FilterButton
                    name="verified"
                    onChange={handleFilterChange}
                    value={filters.verified}
                  >
                    Verified
                  </FilterButton>
                </CustomTooltip>
                <CustomTooltip
                  style={{ paddingTop: 0 }}
                  title="Hide collections with <500 assets"
                  placement="top"
                >
                  <FilterButton
                    name="hideSmall"
                    onChange={handleFilterChange}
                    value={filters.hideSmall}
                  >
                    {size.width > 1200 ? 'Only 500+' : '500+'}
                  </FilterButton>
                </CustomTooltip>
                <CustomTooltip
                  style={{ paddingTop: 0 }}
                  title="Include NSFW collections"
                  placement="top"
                >
                  <FilterButton
                    name="nsfw"
                    onChange={handleFilterChange}
                    value={filters.nsfw}
                  >
                    {size.width > 1200 ? 'Show NSFW' : 'NSFW'}
                  </FilterButton>
                </CustomTooltip>
                <CustomTooltip
                  style={{ paddingTop: 0 }}
                  title="Collections that are creating new assets now"
                  placement="top"
                >
                  <FilterButton
                    name="mintingNow"
                    onChange={handleFilterChange}
                    value={filters.mintingNow}
                  >
                    Minting
                  </FilterButton>
                </CustomTooltip>
                {/* {!isMobile && (
                        <Box className={styles.assetFilter}>
                          <Box
                            className={styles.filterContainer}
                            sx={{ width: '100%' }}
                          >
                            <Input
                              placeholder="Search Collection"
                              name="collectionFilterQuery"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                            />
                          </Box>
                        </Box>
                      )} */}
              </Box>
            )}
            <Box
              className={styles.filterContainer}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Select
                options={sortOpts}
                name="sort"
                onChange={handleSort}
                value={sort.sort + capitalize(sort.sortDirection)}
              />
            </Box>
            {location.pathname !== '/calendar' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 0.5,
                  mb: 1,
                }}
              >
                {loading ? (
                  <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress
                      size={15}
                      sx={{ color: 'var(--logoColor)' }}
                    />
                  </Box>
                ) : (
                  totalCollections
                )}
                <span
                  className={styles.collectionCount}
                  style={{ marginLeft: 5 }}
                >
                  Collections
                </span>
              </Box>
            )}
          </Box>
        </Box>
      </MobileView>
      <BrowserView>
        <Box
          sx={{
            display: 'flex',
            position: 'sticky',
            zIndex: 200,
            top: '120px',
            background: 'var(--assetsBg)',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
          }}
        >
          <Box className={styles.filters}>
            <Box className={styles.filterContainer}>
              <Box className={styles.sortHeading}>Sort by:</Box>
              <Box className={styles.filterBody}>
                {isMobile && (
                  <Box className={styles.assetFilter}>
                    <Box
                      className={styles.filterContainer}
                      sx={{ width: '100%' }}
                    >
                      <FilterInput
                        placeholder="Search Collection"
                        name="collectionFilterQuery"
                        //value={query}
                        //onChange={(e) => setQuery(e.target.value)}
                      />
                    </Box>
                  </Box>
                )}
                <Select
                  options={sortOpts}
                  name="sort"
                  onChange={handleSort}
                  value={sort.sort + capitalize(sort.sortDirection)}
                />
              </Box>
            </Box>
            {calendar ? (
              <>
                <Box className={styles.filterContainer}>
                  <Box className={styles.filterHeading}>
                    Submit your collection
                  </Box>
                  <FilterButton
                    pressable
                    onClick={() => setAddCollectionOpen(true)}
                  >
                    Add collection
                  </FilterButton>
                </Box>

                <Box className={styles.filterContainer}>
                  <Box className={styles.filterHeading}>Disclaimer</Box>
                  <span
                    style={{
                      marginTop: 10,
                      color: 'var(--fontColor)',
                      fontSize: 12,
                      fontFamily: 'newgilroysemibold',
                    }}
                  >
                    This is not an advise. Please do your own research. See{' '}
                    <Link
                      className={styles.filterLink}
                      href="https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      T&C
                    </Link>
                  </span>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      fontSize: 20,
                      ml: 2,
                      width: 'fit-content',
                      borderBottom: '2px solid var(--logoColor)',
                      fontFamily: 'newgilroysemibold',
                      cursor: 'pointer',
                      alignSelf: 'flex-end',
                      '&:hover': {
                        color: 'var(--logoColor)',
                      },
                      mb: 1,
                    }}
                    onClick={() => router.push('/promotions')}
                  >
                    Advertise with Jungle
                  </Box>
                </Box>
              </>
            ) : (
              <Box className={styles.filterContainer}>
                <Box className={styles.filterHeading}>Filter by:</Box>
                <Box className={styles.filterBody}>
                  <CustomTooltip
                    title="Collection is linked to a correct policy"
                    placement="top"
                    style={{ paddingTop: 0 }}
                  >
                    <FilterButton
                      name="verified"
                      onChange={handleFilterChange}
                      value={filters.verified}
                    >
                      Verified
                    </FilterButton>
                  </CustomTooltip>
                  <CustomTooltip
                    style={{ paddingTop: 0 }}
                    title="Hide collections with <500 assets"
                    placement="top"
                  >
                    <FilterButton
                      name="hideSmall"
                      onChange={handleFilterChange}
                      value={filters.hideSmall}
                    >
                      {size.width > 1200 ? 'Only 500+' : '500+'}
                    </FilterButton>
                  </CustomTooltip>
                  <CustomTooltip
                    style={{ paddingTop: 0 }}
                    title="Include NSFW collections"
                    placement="top"
                  >
                    <FilterButton
                      name="nsfw"
                      onChange={handleFilterChange}
                      value={filters.nsfw}
                    >
                      {size.width > 1200 ? 'Show NSFW' : 'NSFW'}
                    </FilterButton>
                  </CustomTooltip>
                  {!isMobile && (
                    <CustomTooltip
                      style={{ paddingTop: 0 }}
                      title="My favourite collections"
                      placement="top"
                    >
                      <FilterButton
                        name="liked"
                        onChange={handleFilterChange}
                        value={filters.liked}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 14,
                            height: 14,
                          }}
                        >
                          <FavoriteIcon sx={{ fontSize: 18 }} />
                        </Box>
                      </FilterButton>
                    </CustomTooltip>
                  )}
                  <CustomTooltip
                    style={{ paddingTop: 0 }}
                    title="Collections that are creating new assets now"
                    placement="top"
                  >
                    <FilterButton
                      name="mintingNow"
                      onChange={handleFilterChange}
                      value={filters.mintingNow}
                    >
                      Minting
                    </FilterButton>
                  </CustomTooltip>
                  {/* {!isMobile && (
                        <Box className={styles.assetFilter}>
                          <Box
                            className={styles.filterContainer}
                            sx={{ width: '100%' }}
                          >
                            <Input
                              placeholder="Search Collection"
                              name="collectionFilterQuery"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                            />
                          </Box>
                        </Box>
                      )} */}
                </Box>
              </Box>
            )}
            {isMobile && location.pathname !== '/calendar' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress
                      size={15}
                      sx={{ color: 'var(--logoColor)' }}
                    />
                  </Box>
                ) : (
                  totalCollections
                )}
                <span
                  className={styles.collectionCount}
                  style={{ marginLeft: 5 }}
                >
                  Collections
                </span>
              </Box>
            )}
          </Box>
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'end',
                p: '24px 12px',
                marginBottom: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span className={styles.collectionCount}>
                  {loading ? (
                    <Box className={styles.loader}>
                      <CircularProgress
                        size={15}
                        sx={{ color: 'var(--logoColor)', mr: 1 }}
                      />
                    </Box>
                  ) : (
                    <span style={{ marginRight: 6 }}>{totalCollections}</span>
                  )}
                  Collections
                </span>
              </Box>
            </Box>
          )}
        </Box>
      </BrowserView>
    </>
  );
};

export default CollectionFilters;
