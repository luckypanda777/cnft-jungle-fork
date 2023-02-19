import { Box } from '@mui/material';
import TextHeader from 'components/common/TextHeader';
import useWindowSize from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactTextTransition from 'react-text-transition';
import Slash from 'assets/icons/slsh.svg';

const texts = ['Art of', 'Price', 'Rarity', 'Trait'];

const Hero = () => {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);
  const { width } = useWindowSize();

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
    <Box sx={{ mt: 5 }}>
      <TextHeader
        title={
          <span style={{ padding: 12 }}>
            <span style={{ color: 'var(--logoColor)' }}>
              <ReactTextTransition
                delay={100}
                text={texts[textIndex]}
                springConfig={{ stiffness: 50, damping: 20 }}
                inline
              />{' '}
            </span>
            Cardano NFT Sniping
          </span>
        }
        subtitle={
          <Box
            sx={{ display: 'flex', columnGap: 1, alignItems: 'center', mb: 2 }}
          >
            <span>Custom alerts</span>
            <Slash width={20} height={20} />
            <span>Best deals</span>
            <Slash width={20} height={20} />
            <span>Real time</span>
          </Box>
        }
        actionButtons={[
          {
            title: 'Start here',
            variant: 'contained',
            size: 'large',
            sx: {
              borderRadius: 2,
              boxShadow: 'none',
              fontFamily: 'newgilroysemibold',
              border: '2px solid var(--logoColor)',
              backgroundColor: 'var(--logoColor)',
              color: 'var(--fontColor)',
              '&:disabled': {
                border: '2px solid var(--logoColor)',
              },
              '&:hover': {
                backgroundColor: 'var(--logoColor)',
                color: 'var(--fontColor)',
              },
              minWidth: width < 600 ? 100 : 200,
              lineHeight: 5,
            },

            onClick: () =>
              window.scrollTo({
                top: 3000,
                behavior: 'smooth',
              }),
          },
          {
            title: 'Download',
            variant: 'contained',
            size: 'large',
            sx: {
              borderRadius: 2,
              boxShadow: 'none',
              fontFamily: 'newgilroysemibold',
              border: '2px solid var(--logoColor)',
              backgroundColor: 'transparent',
              color: 'var(--fontColor)',
              '&:hover': {
                backgroundColor: 'var(--logoColor)',
                color: 'var(--fontColor)',
              },
              minWidth: width < 600 ? 100 : 200,
              lineHeight: 5,
            },
            onClick: () =>
              window.open(
                'https://chrome.google.com/webstore/detail/cnft-predator/jlajkhhjgghiidlfgpkhhjbgbfkmklio',
                '_blank'
              ),
          },
        ]}
        center
      />
    </Box>
  );
};

export default Hero;
