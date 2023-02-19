import octopus from 'assets/octopus.png';
import orca from 'assets/jungleorca.png';
import whale from 'assets/junglewhale.png';
import pond from 'assets/api/apipond.webp';
import lake from 'assets/api/apilake.webp';
import ocean from 'assets/api/apiocean.webp';

export const codeExamples = [
  {
    name: 'Trending Collections',
    label: 'trending-collections',
    sampleResponse: {
      trending: [
        {
          collection_name: 'Mutant Crocs',
          policies: 'd517f38dd2c5acc3347c8e933e2c0185fafe3ba838f8830000a3c95f',
          floor: 290,
          today_value: 290,
          yesterday_value: 215,
          difference: 0.3488,
          volume: 240,
          volume_d: 240,
          volume_w: 6212,
          volume_m: 26895,
          image: 'QmP7GPp5pvZz3a7fm3s4BtG7XmCg8xwiKSduVGPV5khFRp',
          optimized_image: 'QmP7GPp5pvZz3a7fm3s4BtG7XmCg8xwiKSduVGPV5khFRp',
          supply: 6003,
        },
        '...',
      ],
    },
  },
  {
    name: 'Asset Info',
    label: 'asset-info',
    sampleResponse: {
      asset: {
        asset_id:
          'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c350494e303034',
        collection_name: 'AdaDigies',
        collection_traitslist: '...',
        policy_id: 'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c3',
        asset_name: 'PIN004',
        image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
        optimized_image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
        traits: '...',
        collection_id: 29973,
        rarity_rank: 19,
        floor: 80,
        traitfloors: '...',
      },
    },
  },
  {
    name: 'Wallet Assets',
    label: 'wallet-assets',
    sampleResponse: {
      assets: [
        {
          asset_id:
            'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c350494e303034',
          collection_name: 'AdaDigies',
          policy_id: 'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c3',
          asset_name: 'PIN004',
          image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
          optimized_image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
          traits: '...',
          collection_id: 29973,
          rarity_rank: 19,
          floor: 80,
        },
        '...',
      ],
    },
  },
  {
    name: 'Top Sales',
    label: 'top-sales',
    sampleResponse: {
      topSales: [
        {
          asset_id:
            'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c350494e303034',
          collection_name: 'AdaDigies',
          policy_id: 'a397df772fe3a7ff526a9d2f471133a67024931adc272c971ac3f6c3',
          asset_name: 'PIN004',
          image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
          optimized_image: 'Qmeg9fsDaq8xuz7ejpktxgRr2qLaR7L2kA2zDqBWWPSNGy',
          sale_price: 1000,
          sale_marketplace: 'jpgstore',
          sale_date: Date.now(),
        },
        '...',
      ],
    },
  },
];

export const launchBoxes = [
  {
    icon: octopus,
    name: 'Get blockchain data',
    description:
      'It is simple to query on-chain data thanks to the Jungle API. With a few easy calls, you may retrieve collections, tokens, characteristics, wallets, and more.',
  },
  {
    wide: true,
    icon: whale,
    name: 'Realtime precision',
    description:
      'Our API have the latest information about floors, volumes, average sales prices, and more. You can also get the latest sales and the most popular collections.',
  },
  {
    wide: true,
    icon: orca,
    name: 'Reliability and uptime',
    description:
      'Our priority is to provide a reliable and stable API. We aim for a 99.9% uptime and we are constantly improving our infrastructure.',
  },
];

export const planData = [
  {
    id: 'price_1LbuBuEqrSMqc2U9cLrKfWeh',
    currency: 'eur',
    name: 'Small Pond',
    price: 0,
    description:
      'Request limit 10/s, 10 thousand requests a month, ideal for pet projects and data enthusiasts.',
    details: [
      'Up to 1m req/month',
      '50 req/min',
      'Access to 7d historical data',
      'Custom support',
      'Fully indexed ERC721',
    ],
    icon: pond,
  },
  {
    id: 'price_1LbuC3EqrSMqc2U9VedpBCXz',
    currency: 'eur',
    name: 'Medium Lake',
    description:
      'Request limit 100/s, 500 thousand requests a month, ideal for medium projects and power users.',
    price: 10,
    details: [
      'Up to 10m req/month',
      '230 req/min',
      'Access to 30d historical data',
      'Fully indexed ERC721',
      'Everything from Small Pond',
    ],
    icon: lake,
  },
  {
    id: 'price_1LbuCAEqrSMqc2U97pk0dERT',
    name: 'Big Ocean',
    currency: 'eur',
    price: 100,
    description:
      'Request limit 1000/s, 10 million a month, ideal for big projects, marketplaces and wallets.',
    details: [
      'Up to 60m req/month',
      '1500 req/min',
      'Full historical data',
      'Webhook events',
      'Everything from Medium Lake',
    ],
    icon: ocean,
  },
];
