import orca from 'assets/jungleorca.png';
import PinkBadge from 'assets/icons/star.svg';
import BlueBadge from 'assets/icons/verifiedblue.svg';
import GoldBadge from 'assets/icons/verifiedgold.svg';

export const snipeExamples = [
  {
    name: 'Trait Hunt',
    label: 'trait-hunt',
    description: 'Search for Mallard Order NFTs with Cybord Beak trait',
    hunt: {
      index: 0,
      search: {
        label: 'Mallard Order',
        rules: [
          {
            label: 'collection',
            value: {
              collection: 'Mallard Order',
              policies:
                '901ba6e9831b078e131a1cc403d6139af21bda255cea6c9f770f4834',
            },
          },
          {
            label: 'traits',
            value: ['attributes / Beak / cyborg'],
            type: 'traits',
          },
        ],
      },
    },
  },
  {
    name: 'Price Hunt',
    label: 'price-hunt',
    description: 'Search for Chilled Kong below 2500 ADA',
    hunt: {
      index: 0,
      search: {
        label: 'Chilled Kongs',
        rules: [
          {
            label: 'collection',
            value: {
              collection: 'Chilled Kongs',
              policies:
                'c56d4cceb8a8550534968e1bf165137ca41e908d2d780cc1402079bd',
            },
          },
          {
            label: 'priceMax',
            value: 2500,
            type: 'number',
          },
        ],
      },
    },
  },
  {
    name: 'Rarity Hunt',
    label: 'rarity-hunt',
    description: 'Search for Clay Nation between 100 and 1000 rank',
    hunt: {
      index: 0,
      search: {
        label: 'Clay Nation',
        rules: [
          {
            label: 'collection',
            value: {
              collection: 'Clay Nation',
              policies:
                '40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728',
            },
          },
          {
            label: 'rarityMin',
            value: 100,
            type: 'number',
          },
          {
            label: 'rarityMax',
            value: 1000,
            type: 'number',
          },
        ],
      },
    },
  },
  {
    name: 'Regex Hunt',
    label: 'regex-hunt',
    description: 'Search for 4 numbers Ada Handle',
    hunt: {
      index: 0,
      search: {
        label: 'Ada Handle',
        rules: [
          {
            label: 'collection',
            value: {
              collection: 'Ada Handle',
              policies:
                'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
            },
          },
          {
            label: 'specificRegex',
            value: '[0-9]|[0-9][0-9]|[0-9]',
            type: 'string',
          },
        ],
      },
    },
  },
];

export const infoBoxes = [
  {
    icon: orca,
    name: 'Realtime data',
    description:
      'The snipe feed is realtime as soon as the NFT become purchasable. We also take care of building the transaction for you, so the only thing left is to sign.',
  },
  {
    wide: true,
    icon: orca,
    name: 'Augmented info',
    description:
      'On the snipe page you will find collection floor, rarity, trait floors to make more precise trading decisions. Prices are color highlighted to make it easier to read.',
  },
  {
    wide: true,
    icon: orca,
    name: 'Reliability and uptime',
    description:
      'Our priority is to provide a reliable and stable product. We aim for a 99.9% uptime and we are constantly improving our infrastructure.',
  },
];

export const subData = [
  {
    name: 'Hunter',
    description:
      'Perfect to get acquinted with the extension or if you only check the floors of the NFTs you are interested in.',
    details: [
      '30 concurrent hunts',
      'Price Hunt',
      'Rarity Hunt',
      'Trait Hunt',
      'Burn 4 for Apex*',
    ],
    color: 'var(--tertiaryColor)',
    icon: <BlueBadge width={20} />,
    policyId: 'b6f448244e0d1dd7e16e1ab5f55c4a1d0f2b808198f69ec59be7fe75',
    link: 'https://www.jpg.store/collection/hunterpass',
    buttonText: 'Buy Now',
  },
  {
    name: 'Apex',
    description:
      'More suitable for  advanced users, who know exactly what they are looking for and want to save time.',
    details: [
      '100 concurrent hunts',
      'Floor Harpoon',
      'Reward Hunt',
      'Everything from Hunter',
      'Burn 4 for Orca*',
    ],
    color: '#FFBF23',
    icon: <GoldBadge width={20} />,
    policyId: 'd37fbbb80a08f0d238fee4af9984a10f6fca2d8a527a5729cb604862',
    link: 'https://www.jpg.store/collection/apexpass',
    buttonText: 'Buy Now',
  },
  {
    name: 'Pink Orca',
    price: 100,
    inviteOnly: true,
    description:
      'For heavy traders and power users for whom every small advantage matters. Won by auction only.',
    details: [
      'Unlimited hunts',
      'Advanced Trait Hunts',
      'Trait combination',
      'Everything from Apex',
      'Will be limited to 50 users',
    ],
    color: 'var(--logoColor)',
    icon: <PinkBadge width={20} />,
    // infinity sign
    floor: '∞',
    link: 'https://discord.gg/T9Ktk9j5vN',
    buttonText: 'Invite Only',
  },
];
