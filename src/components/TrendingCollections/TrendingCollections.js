import { Avatar, Box, CircularProgress, ListItemAvatar } from '@mui/material';
import { getSnipes, getTrending } from 'apiProvider';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { nFormatter } from 'utils/formatCurrency';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { middlen } from 'utils/shorten';
import styles from './styles.module.scss';
import orca from 'assets/jungleorca.png';
import { useAuth } from 'hooks/useAuth';
import BowIcon from 'assets/bow.svg';
import Slash from 'assets/icons/slsh.svg';
import useWindowSize from 'hooks/useWindowSize';
import { useAppContext } from 'context/AppContext';

const TrendingCollections = ({ name, policyId, collectionId }) => {
  const { width } = useWindowSize();
  const { user } = useAuth();
  const {
    state: { walletInfo },
  } = useAppContext();
  const router = useRouter();
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingSnipes, setLoadingSnipes] = useState(false);
  const [trending, setTrending] = useState([]);
  const [snipes, setSnipes] = useState({
    my: '-',
    running: '-',
    successful: '-',
  });

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    fetchSnipes();
  }, [policyId, user]);

  const fetchTrending = async () => {
    setLoadingTrending(true);
    try {
      await getTrending({ page: 1, perPage: 50, type: 'floor' }).then((res) => {
        setTrending(res?.trending);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchSnipes = async () => {
    console.log(user);
    setLoadingSnipes(true);
    try {
      await getSnipes(policyId, user._id).then((res) => {
        setSnipes(res?.snipes);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSnipes(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        gap: 2,
        flexDirection: width < 1400 ? 'column' : 'row',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          border: '2px solid var(--logoColor)',
          borderRadius: 2,
          p: 1,
          rowGap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              columnGap: 1,
              fontSize: 16,
              alignItems: 'center',
            }}
          >
            <img src={orca.src} alt="orca" width={50} />
            Predator Sniping
          </Box>
          <Box
            sx={{
              fontSize: 14,
              mr: 2,
              width: 'fit-content',
              borderBottom: '2px solid var(--logoColor)',
              fontFamily: 'newgilroysemibold',
              cursor: 'pointer',
              '&:hover': {
                color: 'var(--logoColor)',
              },
            }}
            onClick={() =>
              router.push(
                user.snipeTier
                  ? `/manage-extension?tab=new&policyId=${policyId}&name=${name}&collectionId=${collectionId}`
                  : '/sniping'
              )
            }
          >
            {user.snipeTier ? 'Create Hunt' : 'Snipe Now'}
          </Box>
        </Box>
        {loadingSnipes || walletInfo.loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={18} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: width < 1400 ? 16 : 14,
              columnGap: 2,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--rankGrey' }}>My Alerts: </span>
              <span style={{ marginLeft: 3 }}> {snipes?.my}</span>
              <BowIcon
                width={11}
                style={{ paddingBottom: 3, paddingLeft: 3 }}
              />
            </span>
            <Slash width={10} height={10} />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--rankGrey' }}>Active: </span>
              <span style={{ marginLeft: 3 }}> {snipes?.running}</span>
              <BowIcon
                width={11}
                style={{ paddingBottom: 3, paddingLeft: 3 }}
              />
            </span>
            <Slash width={10} height={10} />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--rankGrey' }}>Last 7d: </span>
              <span style={{ marginLeft: 3 }}> {snipes?.successful}</span>
              <BowIcon
                width={11}
                style={{ paddingBottom: 3, paddingLeft: 3 }}
              />
            </span>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          flex: 3,
          border: '2px solid var(--lightGrey)',
          borderRadius: 2,
          p: 0.5,
        }}
      >
        {loadingTrending ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box className={styles.textScroll}>
            {trending.map((item) => {
              const positiveChange =
                item.today_value - item.yesterday_value > 0;
              const percentageChange = item.difference * 100;

              return (
                <Box
                  sx={{
                    width: 'max-content',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    columnGap: 0.5,
                    alignItems: 'center',
                    fontSize: 12,
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'var(--lightGrey)',
                    },
                    borderRadius: 2,
                    p: 1,
                  }}
                  onClick={() =>
                    router.push(
                      `/collections/${item.policies}?tab=trading`,
                      undefined,
                      { shallow: false }
                    )
                  }
                >
                  <ListItemAvatar>
                    {!item.image ? (
                      <Avatar
                        src={item.image}
                        alt={item.label || item.name}
                        sx={avatarStyle}
                      >
                        <ImageWithErrorHandler
                          src="../../assets/catunsupported.webp"
                          alt="unsupported"
                          style={{
                            borderRadius: '8px',
                            width: 45,
                            height: 45,
                            objectFit: 'var(--objectFit)',
                          }}
                        />
                      </Avatar>
                    ) : (
                      <Avatar alt={item.label || item.name} sx={avatarStyle}>
                        <ImageWithErrorHandler
                          src={imgLinkReplace(item.image)}
                          style={{
                            borderRadius: '8px',
                            width: 45,
                            height: 45,
                            objectFit: 'var(--objectFit)',
                          }}
                        />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <Box
                    sx={{
                      width: 'fit-content',
                      fontFamily: 'newgilroysemibold',
                      mx: 'auto',
                      flexDirection: 'column',
                      display: 'flex',
                      fontSize: 14,
                    }}
                  >
                    <span>
                      {middlen(item.collection_name || item.policies, 15)}{' '}
                      <span
                        style={{
                          fontWeight: 500,
                          wordBreak: 'break',
                          color: positiveChange
                            ? 'var(--undervaluedColor)'
                            : '#E74C3C',
                          fontWeight: 'bold',
                          fontFamily: 'newgilroymedium',
                        }}
                      >
                        {!positiveChange && '-'}
                        {nFormatter(percentageChange, 1)}%
                      </span>
                    </span>
                    <span>
                      <span style={{ color: 'var(--rankGrey' }}>Floor: </span>
                      <span style={{ marginLeft: 3 }}>{item.floor} ADA</span>
                    </span>
                    <span>
                      <span style={{ color: 'var(--rankGrey' }}>
                        Volume 24h:
                      </span>
                      <span style={{ marginLeft: 3 }}>
                        {nFormatter(item.volume_d, 2)} ADA
                      </span>
                    </span>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TrendingCollections;
