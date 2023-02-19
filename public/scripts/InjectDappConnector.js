console.log('Test: init bridge', window.cardano);

async function checkAPI(fullApi, method) {
  const args = [...arguments];

  args.shift();
  args.shift();

  console.log('DApp: ' + method + ': send', args);

  let res;

  if (args.length > 0) {
    res = await fullApi[method](...args);
  } else {
    res = await fullApi[method]();
  }

  console.log('DApp: ' + method + ': response:', res);

  return res;
}

async function checkExpAPI(fullApi, method) {
  const args = [...arguments];

  args.shift();
  args.shift();

  console.log('DApp: ' + method + ': send', args);

  let res;

  if (args.length > 0) {
    res = await fullApi.experimental[method](...args);
  } else {
    res = await fullApi.experimental[method]();
  }

  console.log('DApp: ' + method + ': response:', res);
}

window.initCardanoDAppConnectorBridge(async () => {
  // Bridge was esteblished by the wallet.

  const DAppInitiated = localStorage.getItem('DApp');

  if (DAppInitiated) {
    return;
  }

  localStorage.setItem('DApp', '1');

  console.log('DApp: init done:', window.cardano);

  if (window.hasOwnProperty('cardano') && window.cardano.eternl) {
    console.log('DApp: connected');
    console.log('DApp: enable: send');

    const fullApi = await window.cardano.eternl.enable();

    console.log('DApp: enable: response:', fullApi);

    if (fullApi) {
      await checkAPI(fullApi, 'getNetworkId');
      await checkAPI(fullApi, 'getBalance');
      await checkAPI(fullApi, 'getUsedAddresses');
      await checkAPI(fullApi, 'getUnusedAddresses');
      await checkAPI(fullApi, 'getRewardAddresses');
      await checkAPI(fullApi, 'getChangeAddress');
      await checkAPI(fullApi, 'getUtxos');
      await checkExpAPI(fullApi, 'getCollateral');
      await checkExpAPI(fullApi, 'getLockedUtxos');

      // const debugTx = await checkAPI(fullApi, 'signTx', '', false, true)
      //
      // await checkAPI(fullApi, 'signTx', debugTx, false)
    }
  }
});
