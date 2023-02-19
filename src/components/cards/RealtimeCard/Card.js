import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import classNames from 'classnames';
import styles from './Card.module.scss';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import Modal from 'components/modals/RealtimeModal/Modal';
import { useState, memo } from 'react';

const Card = ({ asset = {}, loading, realtime }) => {
  const {
    from,
    to,
    assetId,
    name,
    image,
    optimized_image,
    timestamp,
    asset_num,
    minted,
  } = asset;

  const cardStyles = {
    width: 'var(--assetCardWidth)',
    borderRadius: '10px',
    backgroundColor: 'var(--collectionCardBg)',
    color: 'var(--collectionCardColor)',
    m: 1,
  };

  // const valueCoefficientStyle = styles.valueCoefficientSevereUndervalued;
  // const valueCoefficientStyle = styles.valueCoefficient;

  const [modalOpen, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);

    // router.push(
    //   {
    //     pathname: collectionRoute,
    //     query: { assetId: encodeURIComponent(asset?.asset_id) },
    //   },
    //   undefined,
    //   { shallow: true }
    // );
  };

  return (
    <>
      <MuiCard sx={cardStyles}>
        <CardActionArea>
          <CardContent style={{ padding: '10px' }}>
            {loading ? (
              <Skeleton
                sx={{
                  height: 160,
                  minHeight: 160,
                  borderTopRightRadius: '12px',
                  borderTopLeftRadius: '12px',
                }}
                animation="wave"
                width="100%"
                variant="rectangular"
              />
            ) : (
              <Box
                onClick={handleOpenModal}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: 160,
                }}
              >
                <ImageWithErrorHandler
                  src={optimized_image || image}
                  alt="collection"
                  className={styles.image}
                  style={{
                    borderTopRightRadius: '12px',
                    borderTopLeftRadius: '12px',
                    maxHeight: 160,
                    maxWidth: 160,
                    height: 160,
                    width: 160,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
            <Box className={styles.description}>
              {loading ? (
                <Box sx={{ marginTop: '10px' }}>
                  <Skeleton animation="wave" height={14} width={'100%'} />
                  <Skeleton animation="wave" height={14} width={'100%'} />
                </Box>
              ) : (
                <Box className={styles.primaryInfo} onClick={handleOpenModal}>
                  <Box className={styles.circulation}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                      }}
                    >
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {name}
                      </Box>
                    </span>
                  </Box>
                </Box>
              )}

              <Box
                className={classNames(styles.priceInfo)}
                // onClick={() => link && window.open(link, '_blank')}
              >
                <Box className={styles.priceContainer}>
                  {loading ? (
                    <Box sx={{ width: '100%' }}>
                      <Skeleton animation="wave" height={14} width={'100%'} />
                      <Skeleton animation="wave" height={22} width={'100%'} />
                    </Box>
                  ) : (
                    <>
                      <Box className={styles.title}>Mint</Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </MuiCard>
      <Modal
        assetId={asset.asset_id}
        policyId={asset.policy_id}
        open={modalOpen}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default memo(Card);
