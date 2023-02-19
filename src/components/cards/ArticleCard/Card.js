import React from 'react';
import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import styles from './Card.module.scss';
import Skeleton from '@mui/material/Skeleton';
import { List, ListItem, ListItemText } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';
import VerifiedBadge from 'components/badges/VerifiedBadge';

const Card = ({
  articleName,
  bulletPoints,
  description,
  verified,
  featured,
  loved,
  supply = 0,
  onClick,
  loading,
  style,
}) => {
  const { state } = useAppContext();
  const { isMobile } = state;

  const cardStyles = {
    width: '100%',
    height: {
      xs: 200,
      md: 210,
      lg: 220,
      xl: 235,
    },
    borderRadius: '10px',
    boxShadow: 'unset',
    margin: '10px',
    ...style,
    textAlign: 'center',
  };

  const skeletonStles = isMobile
    ? 120
    : {
        xs: 120,
        xl: 150,
      };

  return (
    <MuiCard sx={cardStyles}>
      <CardActionArea
        onClick={loading ? undefined : onClick}
        sx={{ height: { xs: '100%' } }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: {
              xs: '8px',
              md: '12px',
            },
          }}
          className={
            loved && !loading
              ? styles.loved
              : featured && !loading
              ? styles.featured
              : null
          }
        >
          {loved && !loading && (
            <CustomTooltip title="Most liked on CNFT Jungle">
              <div className={styles.lovedBadge}>Loved</div>
            </CustomTooltip>
          )}
          {featured && !loading && (
            <CustomTooltip title="Promoted by CNFT Jungle. To buy a promotion go to cnftjungle.io/promotions">
              <div className={styles.featuredBadge}>Promoted</div>
            </CustomTooltip>
          )}
          {verified && !loading && (
            <CustomTooltip
              title="Collection is linked to a correct policy"
              placement="top"
            >
              <VerifiedBadge verified className={styles.verifiedBadge} />
            </CustomTooltip>
          )}
          {loading ? (
            <Skeleton
              sx={{
                minHeight: skeletonStles,
                minWidth: skeletonStles,
              }}
              animation="wave"
              // width={160}
              variant="rectangular"
            />
          ) : (
            <Box />
          )}
          <CardContent
            sx={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:last-child': {
                paddingBottom: '8px',
              },
              py: { xs: '0 !important' },
              wordBreak: 'break-word',
              minWidth: { xs: 140, md: 180 },
            }}
          >
            {loading ? (
              <Box sx={{ width: '100%' }}>
                <Skeleton
                  animation="wave"
                  height={40}
                  width="100%"
                  style={{ marginBottom: 6 }}
                />
                <Skeleton
                  animation="wave"
                  height={20}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
                <Skeleton animation="wave" height={10} width="100%" />
                <Skeleton animation="wave" height={10} width="100%" />
                <Skeleton animation="wave" height={10} width="100%" />
                <Skeleton animation="wave" height={10} width="50%" />
              </Box>
            ) : (
              <div className={styles.description}>
                <div className={styles.name}>{articleName}</div>
                <List dense>
                  {bulletPoints.map((point) => (
                    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiberManualRecordIcon sx={{ fontSize: 12, mr: 1 }} />
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
          </CardContent>
        </Box>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
