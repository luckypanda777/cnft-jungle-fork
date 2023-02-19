import { Box, Link } from '@mui/material';
import styles from '../../styles/Wenno.module.scss';
import wennobanner from 'assets/wenno/banner.png';
import wenno from 'assets/wenno/preview7.png';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

const SEO = {
  title: 'CNFT Jungle - WennoCat',
};

function WennoPage() {
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.project}>
          <Box className={styles.projectBox}>The Wenno Cat by Jungle</Box>
          <Box className={styles.projectBox}>
            {/* <ImageWithErrorHandler
            src={wennobanner}
            style={{ width: 200, borderRadius: 12 }}
          /> */}
            {/*<img src={wennobanner} alt="wenno banner" className={styles.banner} />*/}
            <Image
              src={wennobanner}
              alt="wenno banner"
              className={styles.banner}
            />
          </Box>
          <Box className={styles.projectBox}>What's it about?</Box>
          <Box className={styles.projectDescription}>
            <Box className={styles.projectTextBox}>
              <Box className={styles.projectText}>
                This cat does seem familiar doesn't it? Anyone who had spent
                some time in the jungle saw him once or twice. His name is
                actually Wennonium Databasis, or just Wenno. He usually let's
                you know that something is missing, or broken, but never seems
                responsible, just stares at you like it's your fault. Typical
                cat. Well, now you can see why we call him Wenno. That's what
                people usually ask us when they see him. If you always wanted to
                have your own unique Wenno, you can now do it.
              </Box>
            </Box>
          </Box>
          <Box className={styles.projectBox}>But... why?</Box>
          <Box className={styles.projectText}>
            1. Incredible custom art pieces of the famous Wenno Cat
          </Box>
          <Box className={styles.projectText}>
            2. Access to private jungle analytics
          </Box>
          <Box className={styles.projectText}>
            3. Exclusive sniping extension permisisons (to be announced)
          </Box>
          <Box className={styles.projectText}>
            4. Digital art collab airdrops in partnership with{' '}
            <Link
              className={styles.link}
              href="https://twitter.com/CardanoThor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cardano Thor
            </Link>
          </Box>
          <Box className={styles.projectText}>
            5. Wenno Cat is also very unpredictable
          </Box>
          <Box className={styles.projectBox}>How to mint?</Box>
          <Box className={styles.projectDescription}>
            <Box sx={{ width: 300, borderRadius: 2, overflow: 'hidden' }}>
              <Image src={wenno} style={{ width: 300 }} />
            </Box>
            <Box className={styles.mintInfo}>
              <Box className={styles.projectText}>
                One Wenno costs 30 ADA to mint. You can send multiples of 30 ADA
                to the address below, no tx limit, no wallet limit, 5 per tx.
              </Box>
              <Box className={styles.projectText}>
                {/* addr1qy0cqs09v6ffegzc3za5nk52w45jaqynna66a3pew0h3z5t8v69l6wuc2k45mnmj7hclx92cxr480uf5zw56cfa9mgms06lh0z{' '} */}
                SOLD OUT
              </Box>
              <Box className={styles.projectText}>
                There are 6 1/1 Wennos in the collection. Special Wenno utility
                will be revealed later.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default WennoPage;
