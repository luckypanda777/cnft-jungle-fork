import Watchlist from 'components/Watchlist/Watchlist';
import styles from '../../styles/Markets.module.scss';
import { NextSeo } from 'next-seo';
import { Box } from '@mui/material';
import Footer from 'components/layout/Footer';

const SEO = {
  title: 'CNFT Jungle - Your NFT Watchlist ',
  description:
    'Get realtime updates on your NFT collection and asset watchlist',
};

function WatchlistPage({ watchlist }) {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <Watchlist />
        </Box>
      </Box>
      <Footer elements={['data', 'footer']} />
    </>
  );
}

export default WatchlistPage;
