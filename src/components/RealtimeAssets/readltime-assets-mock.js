import moment from 'moment';

const assetsMock = [
  ...Array.from(new Array(100)).map((_, i) => ({
    from: 'addr123901273981203782193721983721983721893721398',
    to: 'addr123901273981203782193721983721983721893721398',
    assetId: 'Asset id #2',
    assetName: '123213213123',
    assetNum: i,
    onchainData: {
      body: 'Diamond',
      skin: 'var(--severeOvervaluedColor)',
      head: 'Hat',
    },
    collectionName: 'Test Collection',
    image: 'https://source.unsplash.com/random/400x400',
    timestamp: moment()
      .subtract(i % 20, 'seconds')
      .format('x'),
  })),
  ...Array.from(new Array(100)).map((_, i) => ({
    from: 'addr123901273981203782193721983721983721893721398',
    to: 'addr123901273981203782193721983721983721893721398',
    assetId: 'Asset id #2',
    assetName: '123213213123',
    assetNum: i,
    onchainData: {
      body: 'Diamond',
      skin: 'var(--severeOvervaluedColor)',
      head: 'Hat',
    },
    collectionName: 'Test Collection',
    image: 'https://source.unsplash.com/random/400x400',
    timestamp: moment()
      .subtract(i % 20, 'seconds')
      .format('x'),
    minted: true,
  })),
];

export { assetsMock };
