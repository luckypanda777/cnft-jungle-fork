import { Box } from '@mui/material';
import styles from '../../styles/Markets.module.scss';
import { NextSeo } from 'next-seo';
import WalletLeaderboards from 'components/WalletLeaderboards';

const SEO = {
  title: 'CNFT Jungle - Wallet Leaderboards',
  description: 'Cardano NFT (CNFT) top wallet and their trades.',
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/predator-maya-images/Group%202961.png',
        width: 1500,
        height: 500,
        alt: 'img',
      },
    ],
    title: `Wallet Leaderboards | CNFT Jungle`,
    description: 'Cardano NFT (CNFT) top wallet and their trades.',
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
          <WalletLeaderboards />
        </Box>
      </Box>
    </>
  );
}

export default MarketsPage;
