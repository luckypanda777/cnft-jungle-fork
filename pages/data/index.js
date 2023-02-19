import { Box } from '@mui/material';
import styles from '../../styles/Markets.module.scss';
import { NextSeo } from 'next-seo';
import TextHeader from 'components/common/TextHeader';
import dynamic from 'next/dynamic';
import leafright from 'assets/api/leafright.webp';
import leafleft from 'assets/api/leafleft.webp';
import useWindowSize from 'hooks/useWindowSize';

const ManageApiSubscription = dynamic(
  () => import('components/ApiSubscription/welcome/ApiInfo'),
  {
    ssr: false,
  }
);

const SEO = {
  title: 'CNFT Jungle - Cardano Data API',
  description: 'Cardano data, transactions, addresses and tokens API',
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/predator-maya-images/Group%202961.png',
        width: 1500,
        height: 500,
        alt: 'img',
      },
    ],
    title: `Cardano Data API | CNFT Jungle`,
    description:
      'Powerful Cardano data, transactions, addresses and tokens API.',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: `cnft,rarity,market,volume,nft,cardano,jungle,trends,statistics,analytics`,
    },
  ],
};

function ApiData() {
  const { width } = useWindowSize();
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <img
            src={leafright.src}
            alt="right leaf"
            width={width > 1600 ? 600 : width > 1000 ? 400 : 250}
            height={width > 1600 ? 600 : width > 1000 ? 400 : 250}
            style={{
              position: 'absolute',
              top: -50,
              right: -100,
              transform: 'rotate(-30deg)',
            }}
          />
          <img
            src={leafleft.src}
            alt="left leaf"
            width={width > 1600 ? 600 : width > 1000 ? 400 : 250}
            height={width > 1600 ? 600 : width > 1000 ? 400 : 250}
            style={{
              position: 'absolute',
              top: -50,
              left: -100,
              transform: 'rotate(0deg)',
            }}
          />
          <ManageApiSubscription />
        </Box>
      </Box>
    </>
  );
}

export default ApiData;
