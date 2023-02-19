import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styles from '../../styles/Sniping.module.scss';
import { NextSeo } from 'next-seo';
import Welcome from 'components/Sniping/Welcome';

const SEO = {
  title: 'CNFT Jungle - Advanced CNFT Sniping',
  description: 'Get a huge edge with our advanced sniping tools',
};

const Sniping = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.marketsContainer} sx={{ maxWidth: 1600 }}>
          <Welcome />
        </Box>
      </Box>
    </>
  );
};

export default Sniping;
