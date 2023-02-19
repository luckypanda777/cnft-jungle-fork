import { Box } from '@mui/material';
import styles from '../../styles/Markets.module.scss';
import { NextSeo } from 'next-seo';
import MarketAnalysis from 'components/MarketAnalysis';
import Footer from 'components/layout/Footer';

const SEO = {
  title: 'CNFT Jungle - Markets and Statistics',
  description:
    'Cardano NFT marketplaces and collection trends, statistics and CNFT analytics.',
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/predator-maya-images/Group%202961.png',
        width: 1500,
        height: 500,
        alt: 'img',
      },
    ],
    title: `Markets and Statistics | CNFT Jungle`,
    description:
      'Cardano NFT marketplaces and collection trends, statistics and CNFT analytics.',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: `cnft,rarity,market,volume,nft,cardano,jungle,trends,statistics,analytics`,
    },
  ],
};

function MarketsPage() {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <MarketAnalysis />
        </Box>
      </Box>
      <Footer elements={['data', 'footer']} />
    </>
  );
}

export default MarketsPage;
