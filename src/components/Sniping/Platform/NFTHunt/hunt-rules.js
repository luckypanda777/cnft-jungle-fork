import ImageIcon from '@mui/icons-material/Image';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PercentIcon from '@mui/icons-material/Percent';
import TranslateIcon from '@mui/icons-material/Translate';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MenuIcon from '@mui/icons-material/Menu';

export const ruleLabels = {
  any: 'Any New Listing',
  actionAmount: 'Action Amount',
  priceAvg: 'Avg. Price',
  priceMin: 'Min. Price',
  priceMax: 'Max. Price',
  specificName: 'Specific Name',
  specificRegex: 'Match Regular Expression',
  specificSerial: 'Specific Asset Number',
  specificAssetId: 'Specific Asset Hex ID',
  rarityMin: 'Min. Rarity',
  rarityMax: 'Max. Rarity',
  raritySource: 'Rarity Rank Source',
  traits: 'Match Traits',
  floorPercentage: 'Dynamic Floor Percentage',
  collection: 'Collection',
  absolutePercentage: 'Use Absolute Percentage',
  useAndTraitLogic: 'Use AND Trait Logic',
  rewardMin: 'Min. Rewards',
  rewardMax: 'Max. Rewards',
  traitValueMin: 'Min. Trait Value',
  traitValueMax: 'Max. Trait Value',
  traitFloorPercentage: 'Dynamic Trait Floor Percentage',
  minTraitRarityPercentage: 'Min. Trait Rarity Percentage',
  maxTraitRarityPercentage: 'Max. Trait Rarity Percentage',
  traitCategories: 'Trait Categories',
  useExcludeTraits: 'Exclude Traits',
  zingBelowFloor: 'Zing Below Floor',
  zingAboveFloor: 'Zing Above Floor',
  zingBelowDayVolume: 'Below Day Volume',
  zingAboveDayVolume: 'Above Day Volume',
  zingBelowWeekVolume: 'Below Week Volume',
  zingAboveWeekVolume: 'Above Week Volume',
  zingBelowMonthVolume: 'Below Month Volume',
  zingAboveMonthVolume: 'Above Month Volume',
  zingBelowListings: 'Below Listing Amount',
  zingAboveListings: 'Above Listing Amount',
  zingAboveSupply: 'Above Supply Amount',
  or: 'Or',
  and: 'And',
  not: 'Not',
  instinctBelowFloor: 'Below Floor',
  instinctAboveFloor: 'Above Floor',
  instinctAboveSupply: 'Above Supply',
  instinctBelowDayVolume: 'Below Day Volume',
  instinctAboveDayVolume: 'Above Day Volume',
  instinctBelowWeekVolume: 'Below Week Volume',
  instinctAboveWeekVolume: 'Above Week Volume',
  instinctBelowMonthVolume: 'Below Month Volume',
  instinctAboveMonthVolume: 'Above Month Volume',
  instinctBelowListings: 'Below Listings',
  instinctAboveListings: 'Above Listings',
  // [NOTE] add trait value word rule
};

export const ruleIcons = {
  amount: <AttachMoneyIcon fontSize="small" />,
  priceAvg: <AttachMoneyIcon fontSize="small" />,
  priceMin: <AttachMoneyIcon fontSize="small" />,
  priceMax: <AttachMoneyIcon fontSize="small" />,
  specificName: <TranslateIcon fontSize="small" />,
  specificRegex: <TranslateIcon fontSize="small" />,
  specificSerial: <TranslateIcon fontSize="small" />,
  specificAssetId: <TranslateIcon fontSize="small" />,
  rarityMin: <StarIcon fontSize="small" />,
  rarityMax: <StarIcon fontSize="small" />,
  raritySource: <StarIcon fontSize="small" />,
  traits: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  traitCategories: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  useExcludeTraits: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  floorPercentage: <PercentIcon fontSize="small" />,
  absolutePercentage: <PercentIcon fontSize="small" />,
  rewardMin: <EmojiEventsIcon fontSize="small" />,
  rewardMax: <EmojiEventsIcon fontSize="small" />,
  useAndTraitLogic: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  traitValueMin: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  traitValueMax: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  traitFloorPercentage: <PercentIcon fontSize="small" />,
  minTraitRarityPercentage: <AutoFixHighIcon fontSize="small" />,
  maxTraitRarityPercentage: <AutoFixHighIcon fontSize="small" />,
  any: <ImageIcon fontSize="small" />,
  collection: <ImageIcon fontSize="small" />,
  zingBelowFloor: <AttachMoneyIcon fontSize="small" />,
  zingAboveFloor: <AttachMoneyIcon fontSize="small" />,
  zingBelowDayVolume: <AttachMoneyIcon fontSize="small" />,
  zingAboveDayVolume: <AttachMoneyIcon fontSize="small" />,
  zingBelowWeekVolume: <AttachMoneyIcon fontSize="small" />,
  zingAboveWeekVolume: <AttachMoneyIcon fontSize="small" />,
  zingBelowMonthVolume: <AttachMoneyIcon fontSize="small" />,
  zingAboveMonthVolume: <AttachMoneyIcon fontSize="small" />,
  zingBelowListings: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  zingAboveListings: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  zingAboveSupply: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
  instinctBelowFloor: <AttachMoneyIcon fontSize="small" />,
  instinctAboveFloor: <AttachMoneyIcon fontSize="small" />,
  instinctBelowDayVolume: <AttachMoneyIcon fontSize="small" />,
  instinctAboveDayVolume: <AttachMoneyIcon fontSize="small" />,
  instinctBelowWeekVolume: <AttachMoneyIcon fontSize="small" />,
  instinctAboveWeekVolume: <AttachMoneyIcon fontSize="small" />,
  instinctBelowMonthVolume: <AttachMoneyIcon fontSize="small" />,
  instinctAboveMonthVolume: <AttachMoneyIcon fontSize="small" />,
  instinctBelowListings: (
    <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />
  ),
  instinctAboveListings: (
    <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />
  ),
  instinctAboveSupply: <MenuIcon fontSize="small" sx={{ paddingTop: '1px' }} />,
};

export const rules = [
  // [NOTE] ZING EVENTS
  {
    name: 'Below Floor',
    label: 'zingBelowFloor',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset below or equal to specified price.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Floor',
    label: 'zingAboveFloor',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified price.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Below Day Volume',
    label: 'zingBelowDayVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset below or equal to specified daily volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Day Volume',
    label: 'zingAboveDayVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified daily volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Below Week Volume',
    label: 'zingBelowWeekVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset below or equal to specified week volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Week Volume',
    label: 'zingAboveWeekVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified week volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Below Month Volume',
    label: 'zingBelowMonthVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset below or equal to specified month volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Month Volume',
    label: 'zingAboveMonthVolume',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified month volume.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Below Listings Amount',
    label: 'zingBelowListings',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset below or equal to specified listing amount.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Listings Amount',
    label: 'zingAboveListings',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified listing amount.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  {
    name: 'Above Minted NFTs',
    label: 'zingAboveSupply',
    type: 'number',
    placeholder: '0',
    description:
      'Search for asset above or equal to specified NFT amount minted.',
    permissions: 'hunter',
    huntType: ['zing'],
  },
  // [NOTE] REGULAR RULES
  {
    name: 'Min. Price',
    label: 'priceMin',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified price.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Avg. Price',
    label: 'priceAvg',
    type: 'number',
    placeholder: '100',
    description:
      'Search for bundle whose assets average price are below or equal to specified average price.',
    permissions: 'hunter',
    huntType: ['bundle'],
  },
  {
    name: 'Max. Price',
    label: 'priceMax',
    type: 'number',
    placeholder: '100',
    description: 'Search for asset below or equal to specified price.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Specific Name',
    label: 'specificName',
    type: 'string',
    placeholder: 'Novagio',
    description:
      'Search for asset name that includes specified value. Multiple values can be separated by "," without spaces.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Match Regular Expression',
    label: 'specificRegex',
    type: 'string',
    placeholder: '[0-9]',
    description:
      'Search for asset name that matches specified JavaScript regular expression.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Specific Asset Number',
    label: 'specificSerial',
    type: 'string',
    placeholder: '1337',
    description:
      'Search for asset number that includes specified value. Multiple values can be separated by "," without spaces.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Specific Asset Hex ID',
    label: 'specificAssetId',
    type: 'string',
    placeholder: 'Hexified Asset ID',
    description:
      'Search for asset id that includes specified value. Multiple values can be separated by "," without spaces.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Min. Rarity',
    label: 'rarityMin',
    type: 'number',
    placeholder: '0',
    description:
      'Search for asset above or equal to specified rarity score rank.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  {
    name: 'Max. Rarity',
    label: 'rarityMax',
    type: 'number',
    placeholder: '100',
    description:
      'Search for asset below or equal to specified rarity score rank.',
    permissions: 'hunter',
    huntType: ['hunt'],
  },
  // {
  //   name: 'Rarity Rank Source',
  //   label: 'raritySource',
  //   type: 'select',
  //   disabled: true,
  // permissions: 'hunter'
  // huntType:[ 'hunt]'
  // },
  {
    name: 'Match Traits',
    label: 'traits',
    type: 'traits',
    description: 'Search for assets that have these traits.',
    permissions: 'hunter',
    huntType: ['hunt', 'bundle'],
  },

  {
    name: 'Dynamic Floor Percentage',
    label: 'floorPercentage',
    type: 'number',
    placeholder: '0',
    description:
      'Percentage below floor price to use as Max. Price. Adjusts dynamically in the background based on new listings.',
    permissions: 'apex',
    huntType: ['hunt', 'bundle'],
  },
  {
    name: 'Min. Rewards',
    label: 'rewardMin',
    type: 'number',
    placeholder: '0',
    description: 'Search for asset above or equal to specified reward amount.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Max. Rewards',
    label: 'rewardMax',
    type: 'number',
    placeholder: '100',
    description: 'Search for asset below or equal to specified reward amount.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Min. Trait Value',
    label: 'traitValueMin',
    type: 'number',
    placeholder: '0',
    description:
      'Search for asset above or equal to specified trait value i.e. Muesli Cow with boostfactor 70 and above.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Max. Trait Value',
    label: 'traitValueMax',
    type: 'number',
    placeholder: '100',
    description:
      'Search for asset below or equal to specified trait value i.e. Muesli Cow with boostfactor 100 and below.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Use Absolute Percentage',
    label: 'absolutePercentage',
    type: 'boolean',
    description:
      'Enable in conjunction with Dynamic Floor Percentage to search for assets both below AND above floor i.e. 10% +/- floor price.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Use Exclude Traits',
    label: 'useExcludeTraits',
    type: 'boolean',
    description:
      "Search for asset that doesn't have those traits. This will override the 'Match Traits' rule.",
    permissions: 'apex',
    huntType: ['hunt'],
  },
  {
    name: 'Min. Trait Rarity Percentage',
    label: 'minTraitRarityPercentage',
    type: 'number',
    placeholder: '0',
    description:
      'Search for assets with minimum specified rarity percentage across all traits i.e. any trait 1% or better rarity.',
    permissions: 'orca',
    huntType: ['hunt'],
  },
  {
    name: 'Max. Trait Rarity Percentage',
    label: 'maxTraitRarityPercentage',
    type: 'number',
    placeholder: '0',
    description:
      'Search for assets with maximum specified rarity percentage across all traits i.e. any trait 3% or more common.',
    permissions: 'orca',
    huntType: ['hunt'],
  },
  {
    name: 'Dynamic Trait Floor Percentage',
    label: 'traitFloorPercentage',
    type: 'number',
    placeholder: '0',
    description:
      'Check whether any of the selected traits are listed specified percentage below the trait floor price. Adjusts dynamically in the background based on new listings.',
    permissions: 'orca',
    huntType: ['hunt'],
  },
  {
    name: 'Use AND Trait Logic',
    label: 'useAndTraitLogic',
    type: 'boolean',
    description:
      'Use AND logic for traits i.e. only search for assets that have all selected traits.',
    permissions: 'orca',
    huntType: ['hunt'],
  },
  {
    name: 'Trait Categories',
    label: 'traitCategories',
    type: 'traitCategories',
    description:
      'Filter which trait categories to use for trait rarity and trait floor price searches.',
    permissions: 'apex',
    huntType: ['hunt'],
  },
  // [NOTE] INSTINCT EVENTS
  {
    name: 'Action Amount',
    label: 'actionAmount',
    type: 'number',
    placeholder: '0',
    description: 'Amount to execute in this action.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Below Floor',
    label: 'instinctBelowFloor',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is below or equal to specified price.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Floor',
    label: 'instinctAboveFloor',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified price.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Below Day Volume',
    label: 'instinctBelowDayVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is below or equal to specified daily volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Day Volume',
    label: 'instinctAboveDayVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified daily volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Below Week Volume',
    label: 'instinctBelowWeekVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is below or equal to specified week volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Week Volume',
    label: 'instinctAboveWeekVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified week volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Below Month Volume',
    label: 'instinctBelowMonthVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is below or equal to specified month volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Month Volume',
    label: 'instinctAboveMonthVolume',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified month volume.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Below Listings Amount',
    label: 'instinctBelowListings',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is below or equal to specified listing amount.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Listings Amount',
    label: 'instinctAboveListings',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified listing amount.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  {
    name: 'Above Minted NFTs',
    label: 'instinctAboveSupply',
    type: 'number',
    placeholder: '0',
    description:
      'Do action if the collection is above or equal to specified NFT amount minted.',
    permissions: 'hunter',
    huntType: ['instinct'],
  },
  // // [NOTE] LOGIC RULES
  // {
  //   name: 'And',
  //   label: 'and',
  //   permissions: 'hunter',
  //   type: 'logic',
  //   huntType: ['instinct'],
  // },
  // {
  //   name: 'Or',
  //   label: 'or',
  //   permissions: 'hunter',
  //   type: 'logic',
  //   huntType: ['instinct'],
  // },
  // {
  //   name: 'Not',
  //   label: 'not',
  //   permissions: 'hunter',
  //   type: 'logic',
  //   huntType: ['instinct'],
  // },
].sort((a, b) => a.name.localeCompare(b.name));

export const rulePresets = {
  floor: {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'zingBelowFloor'),
      rules.find((r) => r.label === 'zingAboveFloor'),
    ],
    huntType: 'zing',
  },
  'Daily Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'zingBelowDayVolume'),
      rules.find((r) => r.label === 'zingAboveDayVolume'),
    ],
    huntType: 'zing',
  },
  'Weekly Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'zingBelowWeekVolume'),
      rules.find((r) => r.label === 'zingAboveWeekVolume'),
    ],
    huntType: 'zing',
  },
  'Monthly Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'zingBelowMonthVolume'),
      rules.find((r) => r.label === 'zingAboveMonthVolume'),
    ],
    huntType: 'zing',
  },
  listings: {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'zingBelowListings'),
      rules.find((r) => r.label === 'zingAboveListings'),
    ],
    huntType: 'hunt',
  },
  price: {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'priceMin'),
      rules.find((r) => r.label === 'priceMax'),
    ],
    huntType: 'hunt',
  },
  'Average Price': {
    permissions: 'hunter',
    rules: [rules.find((r) => r.label === 'priceAvg')],
    huntType: 'bundle',
  },
  rarity: {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'rarityMin'),
      rules.find((r) => r.label === 'rarityMax'),
    ],
    huntType: 'hunt',
  },
  traits: {
    permissions: 'hunter',
    rules: [rules.find((r) => r.label === 'traits')],
    huntType: 'hunt',
  },
  harpoon: {
    permissions: 'apex',
    rules: [rules.find((r) => r.label === 'floorPercentage')],
    huntType: 'hunt',
  },
  value: {
    permissions: 'orca',
    rules: [
      rules.find((r) => r.label === 'traits'),
      rules.find((r) => r.label === 'traitValueMin'),
      rules.find((r) => r.label === 'traitValueMax'),
    ],
    huntType: 'hunt',
  },
  'Trait Rarity': {
    permissions: 'orca',
    rules: [
      rules.find((r) => r.label === 'minTraitRarityPercentage'),
      rules.find((r) => r.label === 'maxTraitRarityPercentage'),
    ],
    huntType: 'hunt',
  },
  rewards: {
    permissions: 'apex',
    rules: [
      rules.find((r) => r.label === 'rewardMin'),
      rules.find((r) => r.label === 'rewardMax'),
    ],
  },
  'Instinct Floor': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'instinctBelowFloor'),
      rules.find((r) => r.label === 'instinctAboveFloor'),
    ],
    huntType: 'hunt',
  },
  'Instinct Daily Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'instinctBelowDayVolume'),
      rules.find((r) => r.label === 'instinctAboveDayVolume'),
    ],
    huntType: 'hunt',
  },
  'Instinct Weekly Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'instinctBelowWeekVolume'),
      rules.find((r) => r.label === 'instinctAboveWeekVolume'),
    ],
    huntType: 'hunt',
  },
  'Instinct Monthly Volume': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'instinctBelowMonthVolume'),
      rules.find((r) => r.label === 'instinctAboveMonthVolume'),
    ],
    huntType: 'hunt',
  },
  'Instinct Listings': {
    permissions: 'hunter',
    rules: [
      rules.find((r) => r.label === 'instinctBelowListings'),
      rules.find((r) => r.label === 'instinctAboveListings'),
    ],
    huntType: 'hunt',
  },
};

export const ruleMapping = {
  hunter: ['orca', 'apex', 'hunter'],
  apex: ['orca', 'apex'],
  orca: ['orca'],
};
