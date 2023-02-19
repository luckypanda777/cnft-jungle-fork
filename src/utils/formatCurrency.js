const formatPrice = (price, currency) => {
  return `${
    currency.toLowerCase() === 'ada'
      ? price >= 1000000
        ? nFormatter(price, 2)
        : price
      : price.toFixed(2)
  } ${currency.toUpperCase()}`;
};

function nFormatter(num, digits) {
  num = num < 0 ? -num : num;
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
}

export { formatPrice, nFormatter };
