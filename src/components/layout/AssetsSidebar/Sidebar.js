import { useContext } from 'react';
import styles from './Sidebar.module.scss';
import Accordion from 'components/common/Accordion';
import Select from 'components/common/Select';
import FilterInput from 'components/common/Input';
import AcceptButton from 'components/buttons/AcceptButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import JungleLogo from 'assets/icons/logovertical.svg';
import { useAppContext } from 'context/AppContext';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TraitFilters from 'components/filters/TraitFilters';
import AccordionActiveLabel from 'components/common/AccordionActiveLabel';
import { Box, Link, Divider } from '@mui/material';
import { reportCollection } from 'apiProvider';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/system';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { getFromLocalStorage } from 'utils/isEmptyObject';
import ListingTypeIcon from 'components/common/ListingTypeIcon';
import { useEffect } from 'react';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import dynamic from 'next/dynamic';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import classNames from 'classnames';
import styled from '@emotion/styled';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SellIcon from '@mui/icons-material/Sell';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  advancedRarityOpts,
  currencyOpts,
  marketplaceOpts,
  rarityOpts,
  rewardOpts,
  listingTypeOpts,
} from 'components/Assets/filterOptions';
import TrendingTraits from 'components/TrendingTraits';
import walleticon from 'assets/icons/holder-d.png';
import traitflooricon from 'assets/icons/trait-floors.png';
import priceicon from 'assets/icons/price.png';
import marketplaceicon from 'assets/icons/marketplace.png';
import rarityicon from 'assets/icons/rarity-rank.png';
import rewardsicon from 'assets/icons/rewards.png';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from 'components/common/CustomTooltip';

const HoldersChart = dynamic(() => import('./HoldersChart'), { ssr: false });
const RarityChart = dynamic(() => import('./RarityChart'), { ssr: false });

const ButtonRoot = styled('button')(() => ({
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '1.5',
  letterSpacing: '0.00938em',
  padding: '12px 24px',
  width: '100%',
  textAlign: 'left',
  backgroundColor: 'var(--accordionBg)',
  border: 'none',
  borderTop: '1px solid var(--assetsBg)',
  backgroundColor: 'var(--bgColor)',
}));

const AccordionIconLabel = ({ icon = null, label }) => (
  <div className={styles.filterBtnContainer}>
    <span
      className={classNames(styles.filterBtnIcon, styles.filterBtnIconStart)}
    >
      {icon}
    </span>
    {label}
  </div>
);

function ToggleFilterButton(props) {
  return (
    <ButtonUnstyled {...props} component={ButtonRoot}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 20 }}>Filter</span>
        <IconButton
          disableRipple
          sx={{
            color: 'var(--fontColor)',
            borderRadius: '6px',
            backgroundColor: 'var(--lightGrey)',
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ArrowBackOutlinedIcon />
        </IconButton>
      </Box>
    </ButtonUnstyled>
  );
}

const Sidebar = ({
  open,
  handleMenu,
  onFilter,
  onMinMaxFilter,
  onTraitsFilter,
  onFilterReset,
  onTraitsReset,
  onMarketplacesFilter,
  onTraitsFilterLogic,
  refresh,
  style = {},
  traitFilterLogic,
  selectedTraits,
  showTraitCount,
  advanced,
  filters,
  minMaxFilters,
  marketplacesFilters,
}) => {
  const { showFeedback } = useContext(FeedbackContext);
  const theme = useTheme();
  const { state } = useAppContext();
  const [prices, setPrices] = useState({
    priceType: 'ada',
    priceMin: null,
    priceMax: null,
  });
  const [rarities, setRarities] = useState({
    rarityType: 'score',
    rarityMin: null,
    rarityMax: null,
  });
  const [rewards, setRewards] = useState({
    rewardType: 'staking',
    rewardMin: null,
    rewardMax: null,
  });
  const [traits, setTraits] = useState({});
  const [listingTypes, setListingTypes] = useState(
    getFromLocalStorage('listingTypes', 'array', [])
  );
  const [marketplaces, setMarketplaces] = useState(
    getFromLocalStorage('marketplaces', 'array', [])
  );

  const handleMinMaxFilter = () => {
    onMinMaxFilter({ ...rarities, ...prices, ...rewards });
  };

  const handleRarityTypeChange = (newType) => {
    setRarities({ ...rarities, rarityType: newType });
  };

  const handleRewardTypeChange = (newType) => {
    setRewards({ ...rewards, rewardType: newType });
  };

  const handlePriceTypeChange = (newType) => {
    setPrices({ ...prices, priceType: newType });
  };

  const handleMinMax = (event, type) => {
    event.preventDefault();

    const {
      target: { name, value },
    } = event;

    if (type === 'prices') {
      setPrices((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (type === 'rarities') {
      setRarities((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (type === 'rewards') {
      setRewards((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleTraitOptionFilter = (traitKey, traitOptionKey, selected) => {
    const currentOptionsForTraitKey = traits[traitKey] || [];
    const newTraitOptionsForTraitKey = selected
      ? [...currentOptionsForTraitKey, traitOptionKey]
      : [...currentOptionsForTraitKey.filter((opt) => opt !== traitOptionKey)];

    const newTraitsState = {
      ...traits,
      [traitKey]: newTraitOptionsForTraitKey,
    };

    if (
      traitFilterLogic === 'intersection' &&
      [].concat.apply([], Object.values(newTraitsState)).length > 15
    ) {
      return showFeedback({
        message: 'You can only select up to 15 traits for intersection mode.',
        kind: 'error',
      });
    }

    setTraits((prevState) => ({
      ...prevState,
      ...newTraitsState,
    }));

    onTraitsFilter(newTraitsState);
  };

  const handleTraitSliderFilter = ({ traitKey, minMax }) => {
    // const currentOptionsForTraitKey = traits[traitKey] || [];
    // const newTraitOptionsForTraitKey = selected
    //   ? [...currentOptionsForTraitKey, traitOptionKey]
    //   : [...currentOptionsForTraitKey.filter((opt) => opt !== traitOptionKey)];

    const newTraitOptionsForTraitKey = new Array(minMax[1] - minMax[0])
      .fill()
      .map((d, i) => i + minMax[0])
      .map((d) => d.toString());

    const newTraitsState = {
      ...traits,
      [traitKey]: newTraitOptionsForTraitKey,
    };

    if (
      traitFilterLogic === 'intersection' &&
      [].concat.apply([], Object.values(newTraitsState)).length > 15
    ) {
      return showFeedback({
        message: 'You can only select up to 15 traits for intersection mode.',
        kind: 'error',
      });
    }

    setTraits((prevState) => ({
      ...prevState,
      ...newTraitsState,
    }));

    onTraitsFilter(newTraitsState);
  };

  const handleTraitFilterLogic = () => {
    if (
      traitFilterLogic === 'union' &&
      [].concat.apply([], Object.values(traits)).length > 15
    ) {
      return showFeedback({
        message: 'You can only select up to 15 traits for intersection mode.',
        kind: 'error',
      });
    }

    onTraitsFilterLogic();
  };

  const toggleSelectAllTraits = ({ traitKey, traitOptions, allSelected }) => {
    const newTraitOptions = traitOptions.map(([k, _]) => k);
    if (traitFilterLogic && newTraitOptions.length > 200) {
      return showFeedback({
        message: 'You can only select up to 200 traits for all selection mode.',
        kind: 'error',
      });
    }

    const newTraitsState = {
      ...traits,
      [traitKey]: allSelected ? [] : newTraitOptions,
    };

    setTraits(newTraitsState);

    onTraitsFilter(newTraitsState);
  };

  const handleMarketplaceFilter = (marketplace, checked) => {
    let newMarketplaceState = [];

    if (checked) {
      newMarketplaceState = [...marketplaces, marketplace];
    }

    if (!checked) {
      newMarketplaceState = marketplaces.filter((m) => m !== marketplace);
    }

    setMarketplaces(newMarketplaceState);
    onMarketplacesFilter({ marketplaces: newMarketplaceState, listingTypes });
  };

  const handleListingTypeFilter = (listingType, checked) => {
    let newListingTypeState = [];

    if (checked) {
      newListingTypeState = [...listingTypes, listingType];
    }

    if (!checked) {
      newListingTypeState = listingTypes.filter((m) => m !== listingType);
    }

    setListingTypes(newListingTypeState);
    onMarketplacesFilter({ marketplaces, listingTypes: newListingTypeState });
  };

  const handleReset = () => {
    setPrices({
      priceType: 'ada',
      priceMin: null,
      priceMax: null,
    });

    setRarities({
      rarityType: 'rarityscore',
      rarityMin: null,
      rarityMax: null,
    });

    setRewards({
      rewardType: 'staking',
      rewardMin: null,
      rewardMax: null,
    });
    setTraits({});
    setMarketplaces([]);
    setListingTypes([]);
    onFilterReset();
    localStorage.removeItem('marketplaces');
    localStorage.removeItem('listingTypes');
    localStorage.removeItem('sort');
  };

  const handleTraitReset = () => {
    setTraits({});
    onTraitsReset();
  };

  const handleReportNsfw = () => {
    reportCollection(state.collection.id, { kind: 'nsfw' }).then(() => {
      showFeedback({
        message: 'Thanks for reporting this collection!',
        variant: 'success',
      });
    });
  };

  useEffect(() => {
    setPrices({
      priceType: 'ada',
      priceMin: null,
      priceMax: null,
    });
    setRarities({
      rarityType: 'score',
      rarityMin: null,
      rarityMax: null,
    });
    setRewards({
      rewardType: 'staking',
      rewardMin: null,
      rewardMax: null,
    });
  }, [refresh]);

  useEffect(() => {
    setMarketplaces(marketplacesFilters.marketplaces);
    setListingTypes(marketplacesFilters.marketplaces);
    setPrices({
      priceType: minMaxFilters.priceType || 'ada',
      priceMin: minMaxFilters.priceMin || null,
      priceMax: minMaxFilters.priceMax || null,
    });
    setRarities({
      rarityType: minMaxFilters.rarityType || 'score',
      rarityMin: minMaxFilters.rarityMin || null,
      rarityMax: minMaxFilters.rarityMax || null,
    });
    setRewards({
      rewardType: minMaxFilters.rewardType || 'staking',
      rewardMin: minMaxFilters.rewardMin || null,
      rewardMax: minMaxFilters.rewardMax || null,
    });

    if (selectedTraits) {
      setTraits(selectedTraits);
    }
  }, [selectedTraits, filters, minMaxFilters, marketplacesFilters]);

  return (
    <aside
      className={classNames(
        styles.sidebar,
        !open ? styles.sidebarClosed : null
      )}
      style={{ ...style }}
    >
      {open ? (
        <>
          <ToggleFilterButton onClick={handleMenu} />
          <Box className={styles.sidebarWrapper}>
            <Box className={styles.accordionFilters}>
              {/* <Accordion
                label={
                  <AccordionIconLabel
                    icon={<AssessmentIcon />}
                    label={
                      <>
                        <span>Ranking Method Preset</span>
                        <Chip
                          label="New!"
                          size="small"
                          sx={{ ml: 1, borderRadius: 2 }}
                          color="primary"
                        />
                      </>
                    }
                  />
                }
              >
                <Box className={styles.filterPrice}>
                  <RankingMethod onRankingFilter={onRankingFilter} />
                </Box>
              </Accordion> */}
              <div
                style={{
                  marginBottom: 15,
                  marginTop: 15,
                  paddingLeft: 15,
                  fontSize: 18,
                }}
              >
                Listing Info
              </div>
              <Accordion
                sidebar
                label={
                  <AccordionActiveLabel
                    label="Price"
                    condition={prices.priceMin || prices.priceMax}
                    chip={`Min: ${prices.priceMin || 0}, Max: ${
                      prices.priceMax || '∞'
                    }`}
                    error={
                      parseInt(prices.priceMin) > parseInt(prices.priceMax)
                    }
                    variant="filled"
                    icon={
                      <img
                        src={priceicon.src}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                        className={styles.inversePng}
                      />
                    }
                  />
                }
              >
                <Box className={styles.filterPrice}>
                  <span>Currency select</span>
                  <Select
                    options={currencyOpts}
                    name="currency"
                    value={prices.priceType}
                    onChange={(e) => handlePriceTypeChange(e.target.value)}
                  />
                  <span>Price range</span>
                  <Box className={styles.priceInputs}>
                    <FilterInput
                      value={prices.priceMin}
                      placeholder="Min"
                      name="priceMin"
                      onChange={(e) => handleMinMax(e, 'prices')}
                      type="number"
                    />
                    <FilterInput
                      value={prices.priceMax}
                      placeholder="Max"
                      name="priceMax"
                      onChange={(e) => handleMinMax(e, 'prices')}
                      type="number"
                    />
                  </Box>
                  <Box className={styles.acceptBtn}>
                    <AcceptButton
                      onClick={handleMinMaxFilter}
                      sx={{ width: '100%' }}
                    >
                      Apply
                    </AcceptButton>
                  </Box>
                </Box>
              </Accordion>
              <Box sx={{ py: 0.1 }} />
              {!state.collection?.no_rank && (
                <Accordion
                  sidebar
                  label={
                    <AccordionActiveLabel
                      label="Rarity Rank"
                      condition={rarities.rarityMin || rarities.rarityMax}
                      chip={`Min: ${rarities.rarityMin || 0}, Max: ${
                        rarities.rarityMax || '∞'
                      }`}
                      error={
                        parseInt(rarities.rarityMin) >
                        parseInt(rarities.rarityMax)
                      }
                      variant="filled"
                      icon={
                        <img
                          src={rarityicon.src}
                          width={20}
                          height={20}
                          style={{ marginRight: 8 }}
                          className={styles.inversePng}
                        />
                      }
                    />
                  }
                >
                  <Box className={styles.filterPrice}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Rarity type{' '}
                      <CustomTooltip
                        title="Click to find out more about different rarity formulas"
                        placement="right"
                        onClick={() =>
                          window.open(
                            'https://medium.com/@cnftpredator/nft-ranks-rarity-calculations-explained-by-cnft-jungle-7641f863b7c3',
                            '_blank'
                          )
                        }
                      />
                    </span>
                    <Select
                      options={[
                        ...rarityOpts,
                        ...(advanced ? advancedRarityOpts : []),
                      ]}
                      name="rarity"
                      value={rarities.rarityType}
                      onChange={(e) => handleRarityTypeChange(e.target.value)}
                    />
                    <span>Rarity range</span>
                    <Box className={styles.priceInputs}>
                      <FilterInput
                        value={rarities.rarityMin}
                        placeholder="Min"
                        name="rarityMin"
                        onChange={(e) => handleMinMax(e, 'rarities')}
                        type="number"
                      />
                      <FilterInput
                        value={rarities.rarityMax}
                        placeholder="Max"
                        name="rarityMax"
                        onChange={(e) => handleMinMax(e, 'rarities')}
                        type="number"
                      />
                    </Box>
                    <Box className={styles.acceptBtn}>
                      <AcceptButton
                        onClick={handleMinMaxFilter}
                        sx={{ width: '100%' }}
                      >
                        Apply
                      </AcceptButton>
                    </Box>
                  </Box>
                </Accordion>
              )}
              <Box sx={{ py: 0.1 }} />

              <Accordion
                sidebar
                label={
                  <AccordionActiveLabel
                    label="Marketplace"
                    condition={marketplaces.length > 0}
                    chip={marketplaces.length}
                    variant="filled"
                    icon={
                      <img
                        src={marketplaceicon.src}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                        className={styles.inversePng}
                      />
                    }
                  />
                }
              >
                <span>Marketplace name</span>
                <FormGroup>
                  {marketplaceOpts.map((marketplace) => {
                    return (
                      <FormControlLabel
                        key={marketplace.value}
                        control={
                          <Checkbox
                            checked={marketplaces.includes(marketplace.value)}
                            onChange={(e) =>
                              handleMarketplaceFilter(
                                marketplace.value,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={marketplace.label}
                        disabled={marketplace.disabled}
                      />
                    );
                  })}
                </FormGroup>
              </Accordion>
              <Box sx={{ py: 0.1 }} />
              {/* <Accordion
                sidebar
                label={
                  <AccordionActiveLabel
                    label="Listing Type"
                    condition={listingTypes.length > 0}
                    chip={listingTypes.length}
                    variant="filled"
                    icon={<SellIcon sx={{ mr: 1, fontSize: 20 }} />}
                  />
                }
              >
                <span>Listing type</span>
                <FormGroup>
                  {listingTypeOpts.map((listingType) => {
                    return (
                      <FormControlLabel
                        key={listingType.value}
                        control={
                          <Checkbox
                            checked={listingTypes.includes(listingType.value)}
                            onChange={(e) =>
                              handleListingTypeFilter(
                                listingType.value,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={
                          <CustomTooltip
                            title={listingType.title}
                            placement="right"
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <span
                                style={{
                                  fontFamily: 'newgilroymedium',
                                }}
                              >
                                {listingType.label}
                              </span>
                              <ListingTypeIcon
                                listing_type={listingType.value}
                                styles={{ ml: 0.5 }}
                              />
                            </Box>
                          </CustomTooltip>
                        }
                        disabled={listingType.disabled}
                      />
                    );
                  })}
                </FormGroup>
              </Accordion> */}
              <Box sx={{ py: 0.1 }} />
              <Accordion
                sidebar
                label={
                  <AccordionActiveLabel
                    label="Rewards"
                    icon={
                      <img
                        src={rewardsicon.src}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                        className={styles.inversePng}
                      />
                    }
                    condition={rewards.rewardMin || rewards.rewardMax}
                    chip={`Min: ${rewards.rewardMin || 0}, Max: ${
                      rewards.rewardMax || 0
                    }`}
                    error={
                      parseInt(rewards.rewardMin) > parseInt(rewards.rewardMax)
                    }
                    variant="filled"
                  />
                }
              >
                <Box className={styles.filterPrice}>
                  <span>Reward type</span>
                  <Select
                    options={[...rewardOpts]}
                    name="reward"
                    value={rewards.rewardType}
                    onChange={(e) => handleRewardTypeChange(e.target.value)}
                  />
                  <span>Reward range</span>
                  <Box className={styles.priceInputs}>
                    <FilterInput
                      value={rewards.rewardMin}
                      placeholder="Min"
                      name="rewardMin"
                      onChange={(e) => handleMinMax(e, 'rewards')}
                      type="number"
                    />
                    <FilterInput
                      value={rewards.rewardMax}
                      placeholder="Max"
                      name="rewardMax"
                      onChange={(e) => handleMinMax(e, 'rewards')}
                      type="number"
                    />
                  </Box>
                  <Box className={styles.acceptBtn}>
                    <AcceptButton
                      onClick={handleMinMaxFilter}
                      sx={{ width: '100%' }}
                    >
                      Apply
                    </AcceptButton>
                  </Box>
                </Box>
              </Accordion>
              <div
                style={{
                  marginBottom: 15,
                  marginTop: 15,
                  paddingLeft: 15,
                  fontSize: 18,
                }}
              >
                Trends
              </div>
              <Accordion
                sidebar
                label={
                  <AccordionActiveLabel
                    label="Popular Traits"
                    icon={<WorkspacePremiumIcon sx={{ mr: '4px' }} />}
                    condition={rewards.rewardMin || rewards.rewardMax}
                    chip={`Min: ${rewards.rewardMin || 0}, Max: ${
                      rewards.rewardMax || 0
                    }`}
                    error={
                      parseInt(rewards.rewardMin) > parseInt(rewards.rewardMax)
                    }
                    variant="filled"
                  />
                }
              >
                <TrendingTraits
                  collection={state?.collection}
                  onTraitOptionFilter={handleTraitOptionFilter}
                  traitFilterLogic={traitFilterLogic}
                  showTraitCount={showTraitCount}
                  toggleSelectAllTraits={toggleSelectAllTraits}
                  selectedTraits={traits}
                />
              </Accordion>

              <TraitFilters
                collection={state?.collection}
                selectedTraits={traits}
                onTraitSliderFilter={handleTraitSliderFilter}
                onTraitOptionFilter={handleTraitOptionFilter}
                handleTraitReset={handleTraitReset}
                traitFilterLogic={traitFilterLogic}
                handleTraitFilterLogic={handleTraitFilterLogic}
                showTraitCount={showTraitCount}
                toggleSelectAllTraits={toggleSelectAllTraits}
              />
            </Box>
            <Box className={styles.traitFilters}>
              <span className={styles.reset} onClick={handleReset}>
                Clear all filters
              </span>
              <span className={styles.report} onClick={handleReportNsfw}>
                Report nsfw
              </span>
            </Box>
            <Box className={styles.footer}>
              <span className={styles.powered}>
                Want to change collection data or submit official rarity?
                Contact us!
              </span>
              <Box>
                <IconButton
                  onClick={() => window.open('https://discord.gg/T9Ktk9j5vN')}
                >
                  <Icon
                    icon={'simple-icons:discord'}
                    style={{
                      fontSize: 25,
                      color:
                        theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.54)'
                          : '#fff',
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() =>
                    window.open('https://www.twitter.com/CNFTJungle')
                  }
                >
                  <Icon
                    icon={'akar-icons:twitter-fill'}
                    style={{
                      fontSize: 25,
                      color:
                        theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.54)'
                          : '#fff',
                    }}
                  />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  my: 1,
                }}
              >
                <Link
                  className={styles.link}
                  href="https://medium.com/@cnftpredator/nft-ranks-rarity-calculations-explained-by-cnft-jungle-7641f863b7c3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ranks and Rarity explained
                </Link>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  my: 1,
                }}
              >
                <Link
                  sx={{ mr: 1 }}
                  className={styles.link}
                  href="https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  T&C
                </Link>
                <Link
                  className={styles.link}
                  href="https://storage.googleapis.com/predator-maya-images/CNFT_Jungle_Privacy_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </Box>
              <JungleLogo width={150} height={125} />
            </Box>
          </Box>
        </>
      ) : (
        <IconButton
          onClick={handleMenu}
          disableRipple
          sx={{
            position: 'absolute',
            color: 'var(--fontColor)',
            top: 0,
            zIndex: 1,
            right: '50%',
            transform: 'translateX(50%)',
            width: 45,
            height: 45,
            borderRadius: '10px',
            backgroundColor: 'var(--lightGrey)',
            mt: 1,
          }}
        >
          <FilterListOutlinedIcon />
        </IconButton>
      )}
    </aside>
  );
};

const SidebarComponent = (props) => {
  const {
    state: { isMobile },
  } = useAppContext();
  const { width } = useWindowSize();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    localStorage.setItem('sidebarOpen', !menuOpen === true ? 'yes' : 'no');
  };

  useEffect(() => {
    setMenuOpen(width > 1600);
  }, [width]);

  if (isMobile) {
    return (
      <>
        <Drawer
          anchor="left"
          open={menuOpen}
          onClose={handleMenu}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Sidebar open={menuOpen} handleMenu={handleMenu} {...props} />
        </Drawer>
        <IconButton onClick={handleMenu} className={styles.menuIcon}>
          <FilterListOutlinedIcon />
        </IconButton>
      </>
    );
  }

  return <Sidebar open={menuOpen} handleMenu={handleMenu} {...props} />;
};

export default SidebarComponent;
