import { Box } from '@mui/material';
import styles from '../../styles/Markets.module.scss';
import { NextSeo } from 'next-seo';
import WhaleWatching from 'components/WhaleWatching';

const SEO = {
  title: 'CNFT Jungle - Whale Watching',
  description: 'Cardano NFT (CNFT) whales and market movements.',
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/predator-maya-images/Group%202961.png',
        width: 1500,
        height: 500,
        alt: 'img',
      },
    ],
    title: `Whale Watching | CNFT Jungle`,
    description: 'Cardano NFT (CNFT) whales and market movements.',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: `cnft,rarity,market,volume,nft,cardano,jungle,trends,statistics,analytics,index`,
    },
  ],
};

function MarketsPage() {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer}>
          <WhaleWatching />
        </Box>
      </Box>
    </>
  );
}

export default MarketsPage;
