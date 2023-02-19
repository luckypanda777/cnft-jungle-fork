export const sortOpts = [
  { label: 'Newly Listed', value: 'listedDesc' },
  { label: 'Recently Minted', value: 'recentDesc' },
  { label: 'Best Reward Ratio', value: 'rewardsDesc' },
  { label: 'Asset Number: Low to High', value: 'assetNumberAsc' },
  { label: 'Asset Number: High to Low', value: 'assetNumberDesc' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Rarity Score: Most Rare', value: 'scoreAsc' },
  { label: 'Statistical Rarity: Most Rare', value: 'statisticalAsc' },
  { label: 'Staking Rewards: High to Low', value: 'stakingRewardsDesc' },
  {
    label: 'Most undervalued (Wenno holders only)',
    value: 'valueAsc',
  },
];

export const salesSortOpts = [
  { label: 'Most Recent', value: 'recentDesc' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Rarity Score: Most Rare', value: 'scoreAsc' },
  { label: 'Asset Number: Low to High', value: 'assetNumberAsc' },
  { label: 'Asset Number: High to Low', value: 'assetNumberDesc' },
  { label: 'Statistical Rarity: Most Rare', value: 'statisticalAsc' },
  { label: 'Staking Rewards: High to Low', value: 'stakingRewardsDesc' },
  { label: 'Oldest Sales', value: 'recentAsc' },
  { label: 'Best Reward Ratio', value: 'rewardsDesc' },
  {
    label: 'Most undervalued (Wenno holders only)',
    value: 'valueAsc',
  },
];

export const advancedSortOpts = [
  {
    label: 'Rarity Score with Trait Count: Most Rare',
    value: 'scoreWithTraitCountAsc',
  },
  { label: 'Combined Rarity: Most Rare', value: 'combinedAsc' },
  { label: 'Statistical Rarity: Most Rare', value: 'statisticalAsc' },
];

// Sidebar
export const currencyOpts = [
  { label: 'ADA', value: 'ada' },
  { label: 'USD (United States Dollar)', value: 'usd' },
  { label: 'EUR (Euro) ', value: 'eur' },
  { label: 'GBP (British Pound)', value: 'gbp' },
  { label: 'CHF (Swiss Franc)', value: 'chf' },
  { label: 'CAD (Canadian Dollar)', value: 'cad' },
  { label: 'NZD (New Zealand Dollar)', value: 'nzd' },
];

export const rarityOpts = [
  { label: 'Rarity Score Rank', value: 'score' },
  { label: 'Statistical Rarity Rank', value: 'statistical' },
];

export const rewardOpts = [{ label: 'Staking Rewards', value: 'staking' }];

export const advancedRarityOpts = [
  { label: 'Statistical Rarity Rank', value: 'statistical' },
];

export const marketplaceOpts = [
  { label: 'jpg.store', value: 'jpgstore' },
  { label: 'Genesis House', value: 'genesishouse' },
  { label: 'Tokhun.io', value: 'tokhun' },
  { label: 'NFTJam.io', value: 'nftjam' },
  { label: 'epoch.art', value: 'epochart' },
  { label: 'cardahub.io', value: 'cardahub' },
  { label: 'CNFT.IO', value: 'cnftio' },
  { label: 'Spacebudz', value: 'spacebudz' },
  { label: 'DEADPXLZ', value: 'deadpxlz' },
  { label: 'Artifct', value: 'artifct' },
];

export const listingTypeOpts = [
  {
    label: 'Buy Now',
    value: 'listing',
    title: 'Listings that can be purchased right away.',
  },
  {
    label: 'On Auction',
    value: 'auction',
    title: 'Listings that are currently on an auction.',
  },
];
