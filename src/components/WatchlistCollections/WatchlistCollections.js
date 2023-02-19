import { Avatar, Box, CircularProgress, ListItemAvatar } from '@mui/material';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { avatarStyle } from 'utils/globalStyles';
import { imgLinkReplace } from 'utils/imgOptimizerReplace';
import { middlen } from 'utils/shorten';
import styles from './styles.module.scss';
import { useAuth } from 'hooks/useAuth';
import useWindowSize from 'hooks/useWindowSize';

const WatchlistCollections = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const deduplicatedWatchlist = useMemo(
    () =>
      user?.watchlist
        ?.filter((w) => w.kind === 'collection' && w.name)
        .filter(
          (w, i, a) => a.findIndex((t) => t.identifier === w.identifier) === i
        ),
    [user.watchlist]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'fit-content',
        flexDirection: 'column',
        mt: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          border: '2px solid var(--lightGrey)',
          borderRadius: 2,
          p: 1,
          rowGap: 1,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 75,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : deduplicatedWatchlist?.length === 0 && !loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 75,
            }}
          >
            Add collections to your watchlist to see them here
          </Box>
        ) : (
          <Box className={styles.textScroll}>
            {deduplicatedWatchlist?.map((item) => {
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
                      `/collections/${item.identifier}?tab=trading`,
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
                    <span>{middlen(item.name || item.policies, 15)} </span>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Box sx={{ fontSize: 16, mt: 1, textAlign: 'left' }}>
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
          onClick={() => router.push('/watchlist')}
        >
          My Watchlist
        </Box>
      </Box>
    </Box>
  );
};

export default WatchlistCollections;
