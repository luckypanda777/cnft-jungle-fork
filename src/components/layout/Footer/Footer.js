import { Box } from '@mui/material';
import styles from './Footer.module.scss';
import JungleLogo from 'assets/icons/jungle.svg';
import mobileLogo from 'assets/junglelogoplain.png';
import useWindowSize from 'hooks/useWindowSize';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import Events from 'components/ApiSubscription/welcome/Events';
import TwitterQuotes from 'components/layout/TwitterQuotes';

const Footer = () => {
  const { width } = useWindowSize();
  const router = useRouter();

  return (
    <Box className={styles.footer}>
      <Box className={styles.about}>
        {/* logo */}
        <Box className={styles.logo}>
          {width < 1650 ? (
            <img src={mobileLogo.src} height={50} width={50} />
          ) : (
            <JungleLogo width={150} height={50} />
          )}
          <span className={styles.slogan}>Claw your way to the top</span>
        </Box>
        <Box>
          <Box className={styles.socials}>
            <Icon
              icon="akar-icons:twitter-fill"
              width={17}
              className={styles.socialsIcon}
              onClick={() => {
                window.open('https://twitter.com/CNFTJungle', '_blank');
              }}
            />
            <Icon
              icon="simple-icons:discord"
              width={17}
              className={styles.socialsIcon}
              onClick={() => {
                window.open('https://discord.gg/T9Ktk9j5vN', '_blank');
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className={styles.links}>
        <Box className={styles.linksContainer}>
          <Box className={styles.linksCategory}>NFT Sniping</Box>
          <Box className={styles.linksList}>
            <Box
              className={styles.link}
              onClick={() => router.push('/sniping')}
            >
              Sniping Platform
            </Box>
            <Box
              className={styles.link}
              onClick={() => router.push('/manage-extension')}
            >
              Sniping Dashboard
            </Box>
          </Box>
        </Box>
        <Box className={styles.linksContainer}>
          <Box className={styles.linksCategory}>Explore</Box>
          <Box className={styles.linksList}>
            <Box
              className={styles.link}
              onClick={() => router.push('/calendar')}
            >
              Upcoming Collections
            </Box>
            <Box
              className={styles.link}
              onClick={() => router.push('/minting')}
            >
              Minting Now
            </Box>
          </Box>
        </Box>
        <Box className={styles.linksContainer}>
          <Box className={styles.linksCategory}>Personal Jungle</Box>
          <Box className={styles.linksList}>
            <Box
              className={styles.link}
              onClick={() => router.push('/promotions')}
            >
              Advertise on Jungle
            </Box>
            <Box
              className={styles.link}
              onClick={() => window.open('https://cuda.io/nftjungle', '_blank')}
            >
              Jungle Mobile App
            </Box>
            <Box
              className={styles.link}
              onClick={() => router.push('/watchlist')}
            >
              My Watchlist
            </Box>
            <Box
              className={styles.link}
              onClick={() =>
                window.open('https://roadmap.cnftjungle.io', '_blank')
              }
            >
              Request a Feature
            </Box>
          </Box>
        </Box>
        <Box className={styles.linksContainer}>
          <Box className={styles.linksCategory}>Markets</Box>
          <Box className={styles.linksList}>
            <Box
              className={styles.link}
              onClick={() => router.push('/statistics')}
            >
              Statistics
            </Box>
            <Box
              className={styles.link}
              onClick={() => router.push('/indexes')}
            >
              Indexes
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const JoinedFooter = ({ elements = ['data', 'twitter', 'footer'] }) => {
  return (
    <>
      {elements.includes('data') && (
        <Box sx={{ mt: 10 }}>
          <Events />
        </Box>
      )}
      {elements.includes('twitter') && (
        <Box sx={{ mt: 10 }}>
          <TwitterQuotes />
        </Box>
      )}
      {elements.includes('footer') && (
        <Box sx={{ mt: 10 }}>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default JoinedFooter;
