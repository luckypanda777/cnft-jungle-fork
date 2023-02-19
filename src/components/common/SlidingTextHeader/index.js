import ReactTextTransition from 'react-text-transition';
import styles from './styles.module.scss';
import TextHeader from 'components/common/TextHeader';
import { useEffect, useState } from 'react';
import { useAppContext } from 'context/AppContext';
import Frame from 'assets/homepage-frame.png';
import Slash from 'assets/icons/slsh.svg';
import { Box } from '@mui/material';

const texts = ['Claw'];

const SlidingTextHeader = ({ noTopMargin = false }) => {
  const { state } = useAppContext();
  const { isMobile } = state;

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
    <TextHeader
      noTopMargin={noTopMargin}
      center
      title={
        <Box>
          <Box
            sx={{
              textTransform: 'uppercase',
              fontSize: isMobile ? '36px' : '72px',
            }}
          >
            Claw your way to the top
          </Box>
        </Box>
      }
      subtitle={
        <Box
          style={{
            fontSize: isMobile ? 18 : 22,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              alignItems: 'center',
              textTransform: 'uppercase',
            }}
          >
            <span>NFT Sniping</span>
            <Slash width={20} height={20} />
            <span>Realtime analytics</span>
            <Slash width={20} height={20} />
            <span>Trading advantage </span>
          </Box>
        </Box>
      }
      socialText="To verify your project or submit official ranks please contact us on"
      hideSocialOnMobile
    >
      <img
        src={Frame.src}
        crossOrigin="anonymous"
        className={styles.frameImage}
        alt="title frame"
      />
    </TextHeader>
  );
};

export default SlidingTextHeader;
