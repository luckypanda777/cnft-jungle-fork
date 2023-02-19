import { utf8ToHex } from 'utils/cardanoUtils';
import { bech32 } from 'bech32';

export const shorten = (str, n) => {
  if (!str) return '';

  const short = str.length > n ? str.substr(0, n - 1) + '..' : str;

  return short.toString().replace(' ..', '..');
};

export const middlen = (str, n) => {
  if (!str) return '';

  const short =
    str.length > n * 2
      ? str.substr(0, n - 1) +
        '..' +
        str.substr(str.length - (n - 1), str.length)
      : str;

  return short.toString().replace(' ..', '..');
};

export const hexifyAssetId = (assetId) => {
  const [policyId, assetName] = assetId?.split('.') || ['', ''];

  const hexifiedAssetId = `${policyId}${utf8ToHex(assetName)}`;

  return hexifiedAssetId;
};

export const fetchStakeAddress = (userAddress) => {
  try {
    if (!userAddress) return;
    const decoded = bech32.decode(userAddress, 130);

    const addrBuf = bech32.fromWords(decoded.words);

    if (addrBuf.length !== 57) return;

    const isMainnet = addrBuf[0] == 1;

    // 29-57 is the stake part
    const stakePartWords = bech32.toWords([
      isMainnet ? 0xe1 : 0xe0,
      ...addrBuf.slice(29),
    ]);
    const stakeBech32 = bech32.encode(
      isMainnet ? 'stake' : 'stake_test',
      stakePartWords,
      130
    );
    return stakeBech32;
  } catch (error) {
    return;
  }
};

const delay = (ms, value) => {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
};

export const tryNTimes = async (toCall, MAX_ATTEMPTS, RETRY_DELAY_IN_MS) => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; ++attempt) {
    console.log(`Attempt ${attempt + 1} of ${MAX_ATTEMPTS}`);
    if (attempt > 0) {
      // Last attempt failed, wait a moment
      await delay(RETRY_DELAY_IN_MS);
    }
    try {
      await toCall();
      return; // It worked
    } catch {}
  }
  // Out of retries
  return new Error('Snipe failed');
};
