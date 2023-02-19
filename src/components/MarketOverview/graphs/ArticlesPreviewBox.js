// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';
import { Rerousel } from 'rerousel';

// assets
import CropOriginalOutlinedIcon from '@mui/icons-material/CropOriginalOutlined';
import MainCard from './MainCard';
import SkeletonTotalMarketVolumeCard from './Skeleton/SkeletonTotalMarketVolumeCard';
import { useRef } from 'react';
import articleIcon from 'assets/article.png';
import bowIcon from 'assets/bow.png';
import styles from '../../../../styles/TotalDatabaseListings.module.scss';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  borderRadius: 10,
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  height: 105,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const ArticlesPreviewBox = ({ isLoading }) => {
  const customerLogo = useRef(null);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalMarketVolumeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Rerousel itemRef={customerLogo} interval={7500}>
            {[
              {
                type: 'Article',
                description:
                  window.innerWidth < 1600
                    ? 'Ranks & Rarity'
                    : 'Ranks & Rarity explained by CNFT Jungle',
                time: innerWidth < 1600 ? '6 min' : '6 min read',
                link: 'https://medium.com/@cnftpredator/nft-ranks-rarity-calculations-explained-by-cnft-jungle-7641f863b7c3',
                image: articleIcon,
              },
              {
                type: 'Guide',
                description:
                  window.innerWidth < 1600
                    ? 'Sniping'
                    : 'Predator Sniping Platform Guide',
                time: innerWidth < 1600 ? '4 min' : '4 min read',
                link: 'https://medium.com/@cnftpredator/cnft-predator-extension-guide-914c1832ce0b',
                image: bowIcon,
              },
            ].map(({ type, description, time, link, image }, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  color: 'white',
                  height: '100%',
                  width: '100%',
                  rowGap: 2,
                  // px: 3,
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                ref={customerLogo}
                onClick={() => {
                  window.open(link, '_blank');
                }}
              >
                <span className={styles.title}>
                  {type} ({time})
                </span>
                <span className={styles.description}>{description}</span>
                <Box className={styles.imageContainer}>
                  <img src={image.src} alt="logo" className={styles.image} />
                </Box>
              </Box>
            ))}
          </Rerousel>
        </CardWrapper>
      )}
    </>
  );
};

export default ArticlesPreviewBox;
