import { Box } from '@mui/material';
import TextHeader from 'components/common/TextHeader';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactTextTransition from 'react-text-transition';

const texts = ['Dynamic', 'Assets', 'Sales', 'Listings', 'Trends'];

const Hero = () => {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prevState) =>
        prevState >= texts.length - 1 ? 0 : prevState + 1
      );
    }, 2000);

    return () => {
      clearInterval(textInterval);
    };
  }, []);

  return (
    <Box sx={{ mt: 10, mb: 4 }}>
      <TextHeader
        title={
          <span>
            <span style={{ color: 'var(--logoColor)' }}>
              <ReactTextTransition
                delay={100}
                text={texts[textIndex]}
                springConfig={{ stiffness: 50, damping: 20 }}
                inline
              />{' '}
            </span>
            Cardano Data API
          </span>
        }
        subtitle="Discover market trends, asset valuations, historical trading data, and more with our simple API"
        actionButtons={[
          {
            title: 'Start here',
            variant: 'contained',
            size: 'large',
            sx: {
              borderRadius: 2,
              boxShadow: 'none',
              backgroundColor: 'var(--logoColor)',
              fontFamily: 'newgilroymedium',
              '&:hover': {
                backgroundColor: 'var(--logoColor)',
                opacity: 0.9,
              },
            },
            onClick: () =>
              window.scrollTo({
                top: 1500,
                behavior: 'smooth',
              }),
          },
          {
            title: 'See docs',
            variant: 'contained',
            size: 'large',
            sx: {
              borderRadius: 2,
              boxShadow: 'none',
              backgroundColor: 'var(--blackColor)',
              fontFamily: 'newgilroymedium',
              '&:hover': {
                backgroundColor: 'var(--blackColor)',
                opacity: 0.9,
              },
            },
            onClick: () => router.push('/data/dashboard?tab=docs'),
          },
        ]}
        center
      />
    </Box>
  );
};

export default Hero;
