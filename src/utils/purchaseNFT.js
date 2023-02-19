/* global chrome */
import { fromHex, toHex, hexToAsci, assetIdToHex } from 'utils/cardanoUtils';
import loader from '../../cardano/loader';
import { eventTrack } from 'config/analytics';
import { sendAda, buyNFT, walletSubmit } from 'apiProvider';
import axios from 'axios';

export const handleBuyAsset = async ({
  assetId,
  price,
  tier,
  isHex,
  wallet,
  accessKey,
  onError,
  onSuccess,
  onLoading,
  onFallback = () => {},
  registerDelay = 10 * 60 * 1000,
}) => {
  wallet = wallet === 'typhon' ? 'typhoncip30' : wallet;

  console.log(wallet);

  const isEnabled =
    window.cardano[wallet]?.isEnabled &&
    (await window.cardano[wallet]?.isEnabled());
  if (!isEnabled) {
    try {
      await window.cardano[wallet]?.enable();
    } catch (err) {
      console.error(err);
      onError('NO_WALLET_CONNECTED');
      return onLoading(false);
    }
  }

  let api;
  if (window.cardano[wallet]) {
    try {
      api = await window.cardano[wallet].enable();
    } catch (err) {
      console.log(err);
      onError('NO_WALLET_CONNECTED');
      return onLoading(false);
    }
  }

  if (!api) {
    onError('NO_WALLET_CONNECTED');
    return onLoading(false);
  }

  const { Address } = await import('@emurgo/cardano-serialization-lib-browser');

  api.getCollateral = api.experimental?.getCollateral || api.getCollateral;

  let selectedAddress;
  const [usedAddress] = await api.getUsedAddresses();
  const collateral = await api.getCollateral();

  if (!usedAddress) {
    // eternl might not have a used address
    const [unusedAddress] = await api.getUnusedAddresses();
    selectedAddress = unusedAddress;
  } else {
    selectedAddress = usedAddress;
  }

  let decodedAddress;

  try {
    decodedAddress = Address.from_bytes(
      Buffer.from(selectedAddress, 'hex')
    ).to_bech32();
  } catch (err) {
    onError('ERROR_BUILDING_TX');
    return onLoading(false);
  }

  let signedTx;
  let rawTxCbor;
  let oldBuilder;
  let jpgInfo = {};

  const hexifiedAssetId = isHex === 'false' ? assetIdToHex(assetId) : assetId;

  let data;

  try {
    const utxos = await api.getUtxos();

    if (tier === 'JPG') {
      const { data: token } = await axios.get(
        `https://server.jpgstoreapis.com/token/${hexifiedAssetId}`
      );
      jpgInfo.listingId = token?.listings[0]?.id;
      jpgInfo.assetId = hexifiedAssetId;

      data = await axios
        .post('https://server.jpgstoreapis.com/transaction/build', {
          collateral,
          utxos,
          address: decodedAddress,
          action: 'BUY',
          ...jpgInfo,
        })
        .then((res) => res.data);

      rawTxCbor = data.cbor ? data.cbor : data;
      oldBuilder = data.oldBuilder;
    } else {
      data = await buyNFT({
        address: decodedAddress,
        asset: hexifiedAssetId,
        tier,
        mobile: !!localStorage.getItem('DApp'),
        collateral,
        utxos,
      });
    }

    rawTxCbor = data.cbor ? data.cbor : data;
    oldBuilder = data.oldBuilder;
  } catch (err) {
    // eslint-disable-next-line no-console
    if (err?.response?.data?.detail === 'ALREADY_SNIPED') {
      onError('ALREADY_SNIPED');
      return onLoading(false);
    }

    if (err?.response?.data?.message === 'INSUFFICIENT_FUNDS') {
      onError('NOT_ENOUGH_FUNDS');
      return onLoading(false);
    }

    onError('ERROR_BUILDING_TX');
    onFallback();
    return onLoading(false);
  }

  try {
    await loader.load(oldBuilder);
  } catch (err) {
    onError('ERROR_BUILDING_TX');
    return onLoading(false);
  }

  const C = loader.Cardano;

  if (tier === 'JPG') {
    try {
      // Transaction signature
      const rawTx = C.Transaction.from_bytes(fromHex(rawTxCbor));

      const witnessSet = rawTx.witness_set();

      let txVkeyWitnesses = await api.signTx(rawTxCbor, true);
      txVkeyWitnesses = C.TransactionWitnessSet.from_bytes(
        fromHex(txVkeyWitnesses)
      );
      witnessSet.set_vkeys(txVkeyWitnesses.vkeys());
      signedTx = toHex(
        C.Transaction.new(
          rawTx.body(),
          witnessSet,
          rawTx.auxiliary_data()
        ).to_bytes()
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      let txVkeyWitnesses = await api.signTx(rawTxCbor, true);
      signedTx = await walletSubmit({
        witness: txVkeyWitnesses,
        cbor: rawTxCbor,
      });
    } catch (err) {
      // signature errs
      onError('ERROR_SIGNING_TX');
      return onLoading(false);
    }
  }

  if (!signedTx) {
    onError('ERROR_BUILDING_TX');
    return onLoading(false);
  }

  console.log(signedTx);

  let txHash;

  try {
    txHash = await api.submitTx(signedTx);
  } catch (err) {
    console.log(err);
    onError('ERROR_BUILDING_TX');
    return onLoading(false);
  }

  console.log(txHash);

  if (tier === 'JPG') {
    try {
      await axios.post('https://server.jpgstoreapis.com/transaction/register', {
        txHash: data.txHash,
        ...jpgInfo,
        signedTx, // !IMPORTANT: Relies on Server PR
      });
    } catch (err) {}
  }

  try {
    if (accessKey) {
      eventTrack(
        'snipe',
        `${assetId}-${decodedAddress}-${txHash}-${accessKey.replace('==', '')}`,
        price
      );
    }
  } catch (err) {
    console.error(err);
  }

  onSuccess(txHash, signedTx);
  return onLoading(false);
};

export const handleSellAsset = async ({
  assetId,
  price,
  tier,
  isHex,
  wallet,
  accessKey,
  onError,
  onSuccess,
  onLoading,
  onFallback = () => {},
}) => {
  if (!window.cardano) return;

  const isEnabled =
    window.cardano[wallet]?.isEnabled &&
    (await window.cardano[wallet]?.isEnabled());
  if (!isEnabled) {
    try {
      await window.cardano[wallet]?.enable();
    } catch (err) {
      onError('No wallet connected.');
      return onLoading(false);
    }
  }

  let api;
  if (window.cardano[wallet]) {
    try {
      api = await window.cardano[wallet].enable();
    } catch (err) {
      onError('No wallet connected.');
      return onLoading(false);
    }
  }

  if (!api) {
    onError('No wallet connected.');
    return onLoading(false);
  }

  const { Address } = await import('@emurgo/cardano-serialization-lib-browser');

  if (api.experimental?.getCollateral) {
    api.getCollateral = api.experimental.getCollateral;
  }
  let selectedAddress;
  const [usedAddress] = await api.getUsedAddresses();
  const collateral = await api.getCollateral();

  if (!usedAddress) {
    // eternl might not have a used address
    const [unusedAddress] = await api.getUnusedAddresses();
    selectedAddress = unusedAddress;
  } else {
    selectedAddress = usedAddress;
  }

  let decodedAddress;

  try {
    decodedAddress = Address.from_bytes(
      Buffer.from(selectedAddress, 'hex')
    ).to_bech32();
  } catch (err) {
    onError('Something went wrong.');
    return onLoading(false);
  }

  let signedTx;
  let rawTxCbor;
  let oldBuilder;
  let jpgInfo = {};

  const hexifiedAssetId = isHex === 'false' ? assetIdToHex(assetId) : assetId;

  let data;

  try {
    const utxos = await api.getUtxos();

    if (tier === 'JPG') {
      data = await axios
        .post('https://server.jpgstoreapis.com/transaction/build', {
          collateral,
          utxos,
          address: decodedAddress,
          action: 'SELL',
          priceLovelace: price.toString(),
          assetId: hexifiedAssetId,
        })
        .then((res) => res.data);

      rawTxCbor = data.cbor ? data.cbor : data;
      oldBuilder = data.oldBuilder;
    } else {
      data = await buyNFT({
        address: decodedAddress,
        asset: hexifiedAssetId,
        tier,
        mobile: !!localStorage.getItem('DApp'),
        collateral,
        utxos,
      });
    }

    rawTxCbor = data.cbor ? data.cbor : data;
    oldBuilder = data.oldBuilder;
  } catch (err) {
    // eslint-disable-next-line no-console
    if (err?.response?.data?.detail === 'ALREADY_SNIPED') {
      onError('Already sniped.');
      return onLoading(false);
    }

    if (err?.response?.data?.message === 'INSUFFICIENT_FUNDS') {
      onError('Not enough funds');
      return onLoading(false);
    }

    onError('Error building tx.');
    onFallback();
    return onLoading(false);
  }

  try {
    await loader.load(oldBuilder);
  } catch (err) {
    onError('Error building tx.');
    return onLoading(false);
  }

  const C = loader.Cardano;

  if (tier === 'JPG') {
    try {
      // Transaction signature
      const rawTx = C.Transaction.from_bytes(fromHex(rawTxCbor));

      const witnessSet = rawTx.witness_set();

      let txVkeyWitnesses = await api.signTx(rawTxCbor, true);
      txVkeyWitnesses = C.TransactionWitnessSet.from_bytes(
        fromHex(txVkeyWitnesses)
      );
      witnessSet.set_vkeys(txVkeyWitnesses.vkeys());
      signedTx = toHex(
        C.Transaction.new(
          rawTx.body(),
          witnessSet,
          rawTx.auxiliary_data()
        ).to_bytes()
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      // Transaction signature
      const rawTx = C.Transaction.from_bytes(fromHex(rawTxCbor));

      const witnessSet = rawTx.witness_set();

      let txVkeyWitnesses = await api.signTx(rawTxCbor, true);
      txVkeyWitnesses = C.TransactionWitnessSet.from_bytes(
        fromHex(txVkeyWitnesses)
      );
      witnessSet.set_vkeys(txVkeyWitnesses.vkeys());
      signedTx = toHex(
        C.Transaction.new(
          rawTx.body(),
          witnessSet,
          rawTx.auxiliary_data()
        ).to_bytes()
      );
    } catch (err) {
      // signature errs
      console.error(err);
      onError('Error signing tx.');
      return onLoading(false);
    }
  }

  if (!signedTx) {
    onError('Something went wrong.');
    return onLoading(false);
  }

  let txHash;

  console.log(signedTx);

  try {
    txHash = await api.submitTx(signedTx);
  } catch (err) {
    console.log(err);
    onError('Error submitting tx.');
    return onLoading(false);
  }

  console.log(txHash);

  if (tier === 'JPG') {
    try {
      await axios.post('https://server.jpgstoreapis.com/transaction/register', {
        txHash: data.txHash,
        assetId: hexifiedAssetId,
        signedTx, // !IMPORTANT: Relies on Server PR
      });
    } catch (err) {}
  }

  try {
    // const payload = {
    //   utxos,
    //   address: decodedAddress,
    //   action: 'BUY',
    //   assetId: hexifiedAssetId,
    //   cborHex: rawTxCbor,
    //   priceLovelace: price,
    //   registerDelay,
    // };
    // console.log('PAYLOAD', payload);
    // // Register after 1 minute timeout
    // await axios
    //   .post(
    //     // 'https://7b0b1acd3dcf.ngrok.io/transaction/register',
    //     'https://cnft-predator.herokuapp.com/register-tx',
    //     payload
    //   )
    //   .then(console.log)
    //   .catch(console.log);
  } catch (err) {
    console.log('ERROR REGISTERING TX', err);
  }

  try {
    if (accessKey) {
      eventTrack(
        'sell',
        `${assetId}-${decodedAddress}-${txHash}-${accessKey.replace('==', '')}`,
        price
      );
    }
  } catch (err) {
    console.error(err);
  }

  onSuccess(txHash);
  return onLoading(false);
};

export const handleSendAda = async ({ amount }) => {
  console.log('IS DAPP', !!localStorage.getItem('DApp'));
  const wallet = localStorage.getItem('walletName');
  if (!window.cardano) return;

  const isEnabled =
    window.cardano[wallet]?.isEnabled &&
    (await window.cardano[wallet]?.isEnabled());
  if (!isEnabled) {
    try {
      await window.cardano[wallet]?.enable();
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  let api;
  if (window.cardano[wallet]) {
    try {
      api = await window.cardano[wallet].enable();
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  if (!api) {
    return false;
  }

  const { Address } = await import('@emurgo/cardano-serialization-lib-browser');

  if (true) {
    api.getCollateral = api.experimental.getCollateral;
  }

  let selectedAddress;
  const [usedAddress] = await api.getUsedAddresses();
  console.log(usedAddress);

  if (!usedAddress) {
    // eternl might not have a used address
    const [unusedAddress] = await api.getUnusedAddresses();
    selectedAddress = unusedAddress;
  } else {
    selectedAddress = usedAddress;
  }
  console.log(usedAddress);

  let decodedAddress;

  try {
    decodedAddress = Address.from_bytes(
      Buffer.from(selectedAddress, 'hex')
    ).to_bech32();
  } catch (err) {
    return false;
  }

  let signedTx;
  let rawTxCbor;
  let oldBuilder;

  try {
    const utxos = await api.getUtxos();
    const response = await sendAda({
      address: decodedAddress,
      amount: amount * 1000000,
      utxos,
    });
    rawTxCbor = response.cbor;
    oldBuilder = false;
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-console
    if (err?.response?.data?.message === 'INSUFFICIENT_FUNDS') {
      return false;
    }

    return false;
  }

  try {
    await loader.load(oldBuilder);
  } catch (err) {
    return false;
  }

  const C = loader.Cardano;

  try {
    // Transaction signature
    const rawTx = C.Transaction.from_bytes(fromHex(rawTxCbor));

    const witnessSet = rawTx.witness_set();

    let txVkeyWitnesses = await api.signTx(rawTxCbor, true);
    txVkeyWitnesses = C.TransactionWitnessSet.from_bytes(
      fromHex(txVkeyWitnesses)
    );
    witnessSet.set_vkeys(txVkeyWitnesses.vkeys());
    signedTx = toHex(
      C.Transaction.new(
        rawTx.body(),
        witnessSet,
        rawTx.auxiliary_data()
      ).to_bytes()
    );
  } catch (err) {
    // signature errs
    console.error(err);
    return false;
  }

  if (!signedTx) {
    return false;
  }

  let txHash;

  try {
    txHash = await api.submitTx(signedTx);
  } catch (err) {
    console.error(err);
  }

  try {
    if (txHash) {
      eventTrack('purchase', 'promotion', amount);
    }
  } catch (err) {
    console.error(err);
  }

  console.log('SUCCESS TXHASH', txHash);

  return txHash;
};
