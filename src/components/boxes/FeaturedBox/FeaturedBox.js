import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { getFeatured } from 'apiProvider';
import IconBack from 'assets/icons/ic-home-featured-back.svg';
import IconNext from 'assets/icons/ic-home-featured-next.svg';
import CollectionSocials from 'components/CollectionRating/CollectionSocials';
import CustomTooltip from 'components/common/CustomTooltip';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect, useMemo, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import styles from './FeaturedBox.module.scss';

const FeaturedBox = ({ isMobile }) => {
  const { width } = useWindowSize();

  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([{}]);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    setLoading(true);
    try {
      const data = await getFeatured();

      setFeatured(data.collections);
    } catch (err) {
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(
    () =>
      featured.sort(() => 0.5 - Math.random()).slice(0, width > 1300 ? 2 : 1),
    [featured.length]
  );

  const Item = ({ value, index }) => {
    const {
      image,
      collection_name,
      socials = {},
      addedAt,
      description,
    } = value;
    return (
      <Box
        key={index}
        sx={{
          height: 220,
          width: 600,
          borderRadius: '10px',
          backgroundColor: '#171718',
          display: 'flex',
          alignItems: 'center',
          columnGap: 3,
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1,
          }}
        >
          <ImageWithErrorHandler
            src={imgLinkReplace(image)}
            alt="collection"
            nextImg={false}
            style={{
              height: 200,
              maxWidth: 200,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              objectFit: 'var(--objectFit)',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <span className={styles.featured}>Promoted</span>
          <span className={styles.title}>{collection_name}</span>
          <span className={styles.description}>{description}</span>
          {(socials.price || socials.supply) && (
            <Box sx={{ display: 'flex', columnGap: 1 }}>
              {socials.price && (
                <span className={styles.stat}>
                  {socials.price.replace('ADA', '')} ADA
                </span>
              )}
              {socials.supply && (
                <span className={styles.stat}>{socials.supply} NFTs</span>
              )}
            </Box>
          )}
          <Box sx={{ display: 'flex', marginLeft: -2.5 }}>
            <CollectionSocials
              socials={socials || []}
              isUpcoming
              collection={{
                image,
                name,
                featured: true,
              }}
            />
            <CustomTooltip style={{ paddingTop: 0 }} title="Add to Calendar">
              <IconButton
                onClick={() => {
                  window.open(
                    `https://www.google.com/calendar/render?action=TEMPLATE&text=${collection_name}+Mint&dates=${moment(
                      addedAt
                    )
                      .utc()
                      .format('YYYYMMDD[T]HHmm[000Z]')}/${moment(addedAt)
                      .utc()
                      .add(1, 'hour')
                      .format(
                        'YYYYMMDD[T]HHmm[000Z]'
                      )}&details=${collection_name}+Mint&sf=true&output=xml`
                  );
                }}
              >
                <NotificationAddIcon
                  sx={{
                    width: 22,
                    color: featured && 'white',
                  }}
                />
              </IconButton>
            </CustomTooltip>
          </Box>
        </Box>
      </Box>
    );
  };

  const CustomDot = ({ onMove, index, onClick, active }) => {
    return (
      <div className={active ? styles.activeDot : styles.inactiveDot}></div>
    );
  };

  const CustomRight = ({ onClick }) => (
    <div onClick={onClick} className={styles.arrowRight}>
      <IconNext width={50} height={50} />
    </div>
  );

  const CustomLeft = ({ onClick }) => (
    <div onClick={onClick} className={styles.arrowLeft}>
      <IconBack width={50} height={50} />
    </div>
  );

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 220,
        }}
      >
        <CircularProgress sx={{ fontSize: 24 }} />
      </Box>
    );
  }

  return (
    <Carousel
      responsive={{
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5,
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
      }}
      containerClass={styles.carousel}
      itemClass={styles.carouselItem}
      dotListClass={styles.carouselDot}
      customDot={<CustomDot />}
      customRightArrow={<CustomRight />}
      customLeftArrow={<CustomLeft />}
      showDots
      infinite
      renderDotsOutside
    >
      {data.map((value, index) => (
        <Item value={value} index={index} />
      ))}
    </Carousel>
  );
};

export default FeaturedBox;
