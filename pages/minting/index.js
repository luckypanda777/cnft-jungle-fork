import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

const Collections = dynamic(() => import('components/Collections'), {
  ssr: false,
});

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
      <Collections minting />
    </>
  );
}

export default Minting;
