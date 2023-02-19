export async function subscribeOnStream(
	symbolInfo,
	resolution,
	onRealtimeCallback,
	subscribeUID,
	onResetCacheNeededCallback,
) {
    const token = JSON.parse(localStorage.getItem('TVToken'));
    let rtl = await getKlines(token.policyId, resolution, 2);
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

    onRealtimeCallback(bars)

}
