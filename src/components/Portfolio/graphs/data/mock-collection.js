import moment from 'moment';

const listings = [
  {
    rank: 2000,
    asset: 1001,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1002,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1003,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1004,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1005,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1006,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1007,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1008,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1009,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1010,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1011,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1012,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1013,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1014,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1015,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1016,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1017,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1018,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1019,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1020,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1021,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
  {
    rank: 2000,
    asset: 1022,
    price: 15,
    timestamp: moment(),
    link: 'www.example.com',
  },
];

const trades = [
  {
    rank: 2000,
    asset: 1001,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1002,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1003,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1004,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1005,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1006,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1007,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1008,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1009,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1010,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1011,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1012,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1013,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1014,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1015,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1016,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1017,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1018,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1019,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1020,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1021,
    price: 15,
    timestamp: moment(),
  },
  {
    rank: 2000,
    asset: 1022,
    price: 15,
    timestamp: moment(),
  },
];

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateListings = () => {
  return new Array(50).fill(0).map(() => ({
    x: randomIntFromInterval(1, 10000),
    y: randomIntFromInterval(1, 1000),
    rank: randomIntFromInterval(1, 10000),
    price: randomIntFromInterval(1, 1000),
    image: 'https://cnft.tools/static/assets/projectthumbs/spacebudz/3827.png',
  }));
};

const getDateIntervalTime = (timeRange) => {
  return timeRange === '15m'
    ? moment().subtract(15, 'minutes')
    : timeRange === '1h'
    ? moment().subtract(1, 'hours')
    : timeRange === '4h'
    ? moment().subtract(4, 'hours')
    : timeRange === '1d'
    ? moment().subtract(1, 'day')
    : moment().subtract(1, 'week');
};

const getDateCategories = (interval) => {
  let timeType =
    interval === '1h'
      ? 'hours'
      : interval === '1d'
      ? 'days'
      : interval === '1w'
      ? 'weeks'
      : 'months';

  let fromDate = getDateIntervalTime(interval);
  let tickAmount =
    interval === '1h'
      ? 12
      : interval === '1d'
      ? 24
      : interval === '1w'
      ? 7
      : 30;
  let timeInterval =
    interval === '1h' ? 1 : interval === '1d' ? 1 : interval === '1w' ? 1 : 1;

  let categories = [];
  for (let i = 0; i < tickAmount; i++) {
    categories.push(fromDate.add(timeInterval, timeType));
  }
  return { categories, tickAmount };
};

const getDateIntervalTimeLineGraph = (timeRange, pointsLength, tickAmount) => {
  if (pointsLength < tickAmount) {
    return timeRange === '1d'
      ? moment().subtract(pointsLength, 'hours')
      : timeRange === '1w'
      ? moment().subtract(pointsLength, 'days')
      : timeRange === '30d'
      ? moment().subtract(pointsLength, 'days')
      : timeRange === '3m'
      ? moment().subtract(pointsLength, 'weeks')
      : moment().subtract(pointsLength, 'months');
  }

  return timeRange === '1d'
    ? moment().subtract(1, 'day')
    : timeRange === '1w'
    ? moment().subtract(1, 'week')
    : timeRange === '30d'
    ? moment().subtract(1, 'month')
    : timeRange === '3m'
    ? moment().subtract(3, 'months')
    : moment().subtract(1, 'year');
};

const getDateCategoriesLineGraph = (interval, pointsLength) => {
  let timeType =
    interval === '1d'
      ? 'hours'
      : interval === '1w'
      ? 'days'
      : interval === '30d'
      ? 'days'
      : interval === '3m'
      ? 'weeks'
      : 'months';

  let tickAmount =
    interval === '1d'
      ? 24
      : interval === '1w'
      ? 7
      : interval === '30d'
      ? 30
      : interval === '3m'
      ? 14
      : 12;

  let fromDate = getDateIntervalTimeLineGraph(
    interval,
    pointsLength + 1,
    tickAmount
  );
  let timeInterval =
    interval === '1h' ? 1 : interval === '1d' ? 1 : interval === '1w' ? 1 : 1;

  let categories = [];
  for (let i = 0; i < tickAmount; i++) {
    let date = moment(fromDate.add(timeInterval, timeType));
    categories.push(
      date
        .add(timeInterval, timeType)
        .format(interval === '1d' ? 'H:00' : 'MMM DD')
    );
  }

  return { categories, tickAmount };
};

export {
  listings,
  trades,
  generateListings,
  randomIntFromInterval,
  getDateCategories,
  getDateIntervalTime,
  getDateCategoriesLineGraph,
};
