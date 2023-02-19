import { useContext, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';
import TextHeader from 'components/common/TextHeader';
import styles from 'components/Collections/Collections.module.scss';
import { Context as FeedbackContext } from 'context/FeedbackContext';

const SEO = {
  title: 'CNFT Jungle - CIP 25 Metadata validator',
  description: "Validate your project's metadata to follow latest Cardano NFT",
};

const Iframe = ({ src, height, width, containerStyle, frameStyle }) => {
  return (
    <div style={containerStyle}>
      <iframe src={src} height={height} width={width} style={frameStyle} />
    </div>
  );
};

async function copy(text) {
  if ('clipboard' in window.navigator) {
    return await window.navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

const Metadata = () => {
  const { theme } = useTheme();
  const { showFeedback } = useContext(FeedbackContext);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopy = () => {
    copy(
      "<iframe src='https://metadata.cnftjungle.io' style='border: none; height: 400px; width: 500px;' title='CIP 25 metadata validator by CNFT Jungle'></iframe>"
    )
      .then(() => {
        showFeedback({
          open: true,
          message: 'Iframe copied to clipboard',
          duration: 2000,
          kind: 'success',
        });
        inputRef.current.select();
      })
      .catch((e) => console.error(e));
  };

  if (!mounted) return null;
  return (
    <>
      <NextSeo {...SEO} />
      <Box className={styles.main}>
        <Box className={styles.collectionsContainer}>
          <TextHeader
            title="Jungle CIP 25 Metadata validator"
            titleStyle={{ marginTop: 0 }}
            subtitle="Check your metadata before minting the project to make sure it follows the latest standards"
            subtitleStyle={{ fontSize: 20, marginTop: 0 }}
            socialText="Suggest any improvement to validation here"
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleCopy}
              sx={{ mt: 1, mb: 2 }}
            >
              Embed to your page
            </Button>
          </Box>
          <Iframe
            src="https://metadata.cnftjungle.io"
            title="Cardano NFT CIP 25 Metadata validator by CNFT Jungle"
            containerStyle={{
              margin: 'auto',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: 10,
              overflow: 'hidden',
            }}
            frameStyle={{
              borderRadius: 10,
              height: 800,
              width: '100%',
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Metadata;
