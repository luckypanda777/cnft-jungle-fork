import ManageExtension from './ManageExtension';
import { Box } from '@mui/material';
import { NextSeo } from 'next-seo';
import Footer from 'components/layout/Footer';

const SEO = {
  title: 'CNFT Jungle - Advanced CNFT Sniping ',
  description: 'Get a huge edge with our advanced sniping tools',
};

const index = () => {
  return (
    <>
      <NextSeo {...SEO} />
      <Box
        sx={{
          minHeight: 'calc(100vh - 125px)',
          width: '100%',
          flex: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ maxWidth: 1600, py: 2, mx: 'auto', width: '100%' }}>
          <ManageExtension />
        </Box>
      </Box>
      <Footer elements={['footer']} />
    </>
  );
};

export default index;
