import { NextSeo } from 'next-seo';
import RealtimeAssets from 'components/RealtimeAssets';

function Minting() {
  const SEO = {
    title: 'CNFT Jungle - Currently minting CNFTs',
    description: 'Currently minting CNFTs',
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'minting now cnft rarity database score nft cardano jungle',
      },
    ],
  };

  return (
    <>
      <NextSeo {...SEO} />
      <RealtimeAssets />
    </>
  );
}

export default Minting;
