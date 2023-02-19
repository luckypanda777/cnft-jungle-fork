import { Box, Typography } from '@mui/material';
import styles from '../../styles/King.module.scss';
import wennobanner from 'assets/wennobanner.jpeg';
import ImageWithErrorHandler from 'components//helpers/ImageWithErrorHandler';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

const SEO = {
  title: 'CNFT Jungle - Jungle King',
  description: 'Become a King at CNFT Jungle',
};

function KingPage() {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.project}>
          <Box className={styles.projectBox}>Jungle King</Box>
          <Box className={styles.projectBox}>
            <Image
              src={wennobanner}
              alt="wenno banner"
              className={styles.banner}
            />
            {/*<img src={wennobanner} alt="wenno banner" className={styles.banner} />*/}
          </Box>
          <Box className={styles.projectBox}>What's included?</Box>
          <Box className={styles.projectDescription}>
            <Box className={styles.projectTextBox}>
              <Box className={styles.projectText}>
                1. Asset valuation and most undervalued asset sort to find the
                best deals using Jungle Value Index(JVI)
              </Box>
              <Box className={styles.projectText}>
                2. Asset traits ranks and percentages during the collection mint
              </Box>
              <Box className={styles.projectText}>
                3. Asset rarities recalculated during the collection mint
              </Box>
              <Box className={styles.projectText}>
                4. Realtime marketplace listings and prices
              </Box>
              <Box className={styles.projectText}>
                5. Floor change/mentions alerts for the collection (coming soon)
              </Box>
              <Box className={styles.projectText}>
                More royal features coming soon..
              </Box>
            </Box>
          </Box>
          <Box className={styles.projectBox}>How to become a King?</Box>
          <Box className={styles.projectDescription}>
            <ImageWithErrorHandler
              src="https://storage.googleapis.com/predator-maya-images/WennoCat.png"
              style={{ width: 200, borderRadius: 12 }}
            />
            <Box className={styles.mintInfo}>
              <Box className={styles.projectText}>
                Price for the crown is 15 ADA/month
              </Box>
              <Box className={styles.projectText}>
                Have to be logged in with Nami, only the Nami wallet will be
                whitelisted for now (more wallet support coming soon).
              </Box>
              <button className={styles.hyperbutton} onClick={undefined}>
                <span />
                <span />
                <span />
                <span />
                <Typography
                  sx={{
                    textTransform: 'uppercase',
                    transition: '0.5s',
                    letterSpacing: 4,
                    fontSize: 16,
                  }}
                >
                  Become King!
                </Typography>
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default KingPage;
