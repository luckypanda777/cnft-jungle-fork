import { Buffer } from 'buffer';
import Loader from '../../cardano/loader';

export const fromHex = (hex) => Buffer.from(hex, 'hex');
export const toHex = (bytes) => Buffer.from(bytes).toString('hex');

export const utf8ToHex = (str) => {
  if (!str) return '';

  return Array.from(str)
    .map((c) =>
      c.charCodeAt(0) < 128
        ? c.charCodeAt(0).toString(16)
        : encodeURIComponent(c).replace(/%/g, '').toLowerCase()
    )
    .join('');
};
export const assetIdToHex = (assetId) => {
  const [policyId, assetName] = assetId.split('.');

  return `${policyId}${utf8ToHex(assetName)}`;
};
export const toBytesNum = (num) =>
  num
    .toString()
    .split('')
    .map((d) => '3' + d)
    .join('');
export const fromAscii = (hex) => Buffer.from(hex).toString('hex');

export const assetsToValue = (assets) => {
  const multiAsset = Loader.Cardano.MultiAsset.new();
  const lovelace = assets.find((asset) => asset.unit === 'lovelace');
  const policies = [
    ...new Set(
      assets
        .filter((asset) => asset.unit !== 'lovelace')
        .map((asset) => asset.unit.slice(0, 56))
    ),
  ];
  policies.forEach((policy) => {
    const policyAssets = assets.filter(
      (asset) => asset.unit.slice(0, 56) === policy
    );
    const assetsValue = Loader.Cardano.Assets.new();
    policyAssets.forEach((asset) => {
      assetsValue.insert(
        Loader.Cardano.AssetName.new(Buffer.from(asset.unit.slice(56), 'hex')),
        Loader.Cardano.BigNum.from_str(asset.quantity)
      );
    });
    multiAsset.insert(
      Loader.Cardano.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
      assetsValue
    );
  });
  const value = Loader.Cardano.Value.new(
    Loader.Cardano.BigNum.from_str(lovelace ? lovelace.quantity : '0')
  );
  if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
  return value;
};

export const valueToAssets = (value) => {
  const assets = [];
  assets.push({ unit: 'lovelace', quantity: value.coin().to_str() });
  if (value.multiasset()) {
    const multiAssets = value.multiasset().keys();
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j);
      const policyAssets = value.multiasset().get(policy);
      const assetNames = policyAssets.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets.get(policyAsset);
        const asset =
          Buffer.from(policy.to_bytes(), 'hex').toString('hex') +
          Buffer.from(policyAsset.name(), 'hex').toString('hex');
        assets.push({
          unit: asset,
          quantity: quantity.to_str(),
        });
      }
    }
  }
  return assets;
};

/**
 *
 * @param {PlutusData} datum
 */
export const getTradeDetails = (datum) => {
  const tradeDetails = datum
    .as_constr_plutus_data()
    .data()
    .get(0)
    .as_constr_plutus_data()
    .data();
  return {
    tradeOwner: Loader.Cardano.Ed25519KeyHash.from_bytes(
      tradeDetails.get(0).as_bytes()
    ),
    budId: toHex(tradeDetails.get(1).as_bytes()),
    requestedAmount: tradeDetails.get(2).as_integer().as_u64(),
  };
};

/**
 *
 * @param {BigNum} amount
 * @param {BigNum} p
 */
export const lovelacePercentage = (amount, p) => {
  return amount
    .checked_mul(Loader.Cardano.BigNum.from_str('10'))
    .checked_div(p);
};

/**
 *
 * @param {string} s
 */
export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 *
 * @param {string} s
 */
export const isJsonString = (s) => {
  try {
    JSON.parse(s);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 *
 * @param {string} s
 */
export const hexToAsci = (s) => {
  var hex = s.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

/**
 * Fetches the corresponding stake address for a given user address
 *
 * @param userAddress - User address
 */
// export const fetchStakeAddress = async (userAddress) => {
//   try {
//     await loader.load();
//     if (!userAddress) return;

//     const address = loader.Cardano.Address.from_bech32(userAddress);
//     const base = loader.Cardano.BaseAddress.from_address(address);
//     if (!base) return;

//     const stake = loader.Cardano.RewardAddress.new(
//       address.network_id(),
//       base.stake_cred()
//     )
//       .to_address()
//       .to_bech32();

//     return stake;
//   } catch (error) {
//     return;
//   }
// };

// Returns a CID if one is found in the string, otherwise returns null
export function parseCID(string) {
  if (Array.isArray(string)) {
    return null;
  }

  if (typeof string !== 'string') {
    return null;
  }

  const match = string.match(
    'Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}'
  );

  if (match !== null) {
    return string.substr(string.indexOf(match[0]));
  }

  return null;
}
