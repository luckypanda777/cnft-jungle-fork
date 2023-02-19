import { getKlines } from './historyProvider';
import { data, findOne } from './pairs';

export const intervals = {
  1: '1m',
  5: '5m',
  10: '10m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  720: '12h',
  1440: '1D',
};

export const checkInterval = (interval) => !!intervals[interval];

const lastBarsCache = new Map();

const configurationData = {
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  // supported_resolutions: Object.keys(intervals),
  supported_resolutions: [
    '1',
    '5',
    '10',
    '15',
    '30',
    '60',
    '120',
    '240',
    '720',
    '1D',
  ],
};

export default {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('[searchSymbols]: Method call');
    var temp = [];
    if (userInput !== '' || userInput !== undefined || userInput !== null) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase().includes(userInput.toLowerCase())) {
          temp = [...temp, data[i]];
        }
      }
    }
    if (typeof temp.s == 'undefined' || temp.s != 'error') {
      onResultReadyCallback(temp);
    } else {
      onResultReadyCallback(data);
    }
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName);
    const token = findOne(symbolName);
    console.log(token);

    if (token) {
      const symbolInfo = {
        name: token.name,
        ticker: token.ticker,
        description: token.description,
        type: token.type,
        session: '24x7',
        timezone: 'Etc/UTC',
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_no_volume: false,
        has_daily: true,
        has_weekly_and_monthly: true,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 1,
        data_status: 'streaming',
      };

      setTimeout(() => onSymbolResolvedCallback(symbolInfo));
    } else {
      setTimeout(() => onResolveErrorCallback());
    }
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    clearInterval(window.interval);
    let { from, to, firstDataRequest, countBack } = periodParams;
    // console.log('[getBars] Method call', symbolInfo, periodParams, resolution)
    // console.log('[getBars] First request', firstDataRequest, onHistoryCallback)
    // if (!checkInterval(resolution)) {
    // 	return onErrorCallback('[getBars] Invalid interval')
    // }
    try {
      let rtl = await getKlines({
        policyId: symbolInfo.ticker,
        from,
        to,
        resolution,
        minimumAmountOfCandles: countBack,
      });

      // [NOTE] temp fix until candles fixes on backend
      if (rtl.length < countBack) {
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }

      let bars = [];
      for (let i = 0; i < rtl.length; i++) {
        bars = [
          ...bars,
          {
            time: parseInt(rtl[i].time),
            open: rtl[i].open,
            close: rtl[i].close,
            high: rtl[i].high,
            low: rtl[i].low,
            volume: rtl[i].intervalVolume,
          },
        ];
      }

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }

      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (err) {
      console.log('[getBars]: Get error', err);
      onErrorCallback(err);
    }
  },
  // subscription to real-time updates
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      '[subscribeBars]: Method call with subscribeUID:',
      subscribeUID
    );

    const token = JSON.parse(localStorage.getItem('TVToken'));

    window.interval = setInterval(async () => {
      const bars = await getKlines({
        policyId: token.policyId,
        resolution,
        minimumAmountOfCandles: 1,
      });

      const lastBar = bars[bars.length - 1];
      console.log('[lastBar]:', lastBar);
      onRealtimeCallback(lastBar);
    }, 1000 * 60); // 60s update interval
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID
    );

    clearInterval(window.interval);
    console.log('[unsubscribeBars]: cleared');
  },
};
