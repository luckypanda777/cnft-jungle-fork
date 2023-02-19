import { getCandlesticks } from 'apiProvider';

export const getKlines = async ({
  policyId,
  from,
  to,
  resolution,
  minimumAmountOfCandles,
}) => {
  const intervalInMilliseconds = parseInt(resolution) * 60000;

  const { candlesticks } = await getCandlesticks({
    policyId,
    period: '1y',
    intervalInMilliseconds,
    minimumAmountOfCandles: 3000,
  });

  candlesticks[0].time = from;
  candlesticks[candlesticks.length - 1].time = to;

  return candlesticks;
};
