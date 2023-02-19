// deploy

import { parseCID } from './cardanoUtils';

export default function imgOptimizerReplace(asset) {
  let ipfs;
  let source = 'https://image-optimizer-on-demand-55l7x7mqsa-uc.a.run.app/';

  if (asset.onchain_data?.image?.includes('ipfs://ipfs/', '')) {
    source = 'https://service.cnftpredator.tools/ipfs/';
  }

  if (Array.isArray(asset.onchain_data?.image)) {
    ipfs = asset.onchain_data?.image
      ?.join('')
      .replace('ipfs://ipfs/', '')
      .replace('ipfs://', '');
  } else {
    ipfs = asset.onchain_data?.image
      ?.replace('ipfs://ipfs/', '')
      .replace('ipfs://', '');
  }

  const cid = parseCID(asset.image);

  if (cid) {
    return imgLinkReplace(asset.image);
  }

  return decodeURIComponent(source + ipfs + '?width=600');
}

export const imgLinkReplace = (url) => {
  if (!url) return null;

  if (
    url.includes('https://image-optimizer-on-demand-55l7x7mqsa-uc.a.run.app') ||
    url.includes('image-optimizer.jpgstoreapis.com') ||
    url.includes('https://images.jpgstoreapis.com')
  )
    return url;

  const cid = parseCID(url);
  if (!cid) {
    return url;
  }

  // if (/\.(gif|jpe?g|tiff?|png|webp)$/i.test(url)) return url;

  let ipfs;
  let source = 'https://image-optimizer-on-demand-55l7x7mqsa-uc.a.run.app/';
  const [storage, service] = [
    'https://storage.googleapis.com/cnftpredator-ipfs-optim/',
    'https://service.cnftpredator.tools/ipfs/',
  ];

  url = url?.replace(source, '');

  if (url?.includes('ipfs://ipfs/', '')) {
    source = 'https://service.cnftpredator.tools/ipfs/';
  }

  if (Array.isArray(url)) {
    ipfs = url?.join('').replace('ipfs://ipfs/', '').replace('ipfs://', '');
  } else if (url?.includes(storage) || url?.includes(service)) {
    ipfs = url?.replace(storage, '').replace(service, '');
  } else {
    ipfs = url?.replace('ipfs://ipfs/', '').replace('ipfs://', '');
  }

  return decodeURIComponent(source + ipfs + '?width=600');
};
