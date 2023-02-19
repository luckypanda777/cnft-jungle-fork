import React, { useCallback, useContext, useRef } from 'react';
import styles from './BookmarkedBadge.module.scss';
import { Box, CircularProgress } from '@mui/material';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as AuthContext } from 'context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { manageBookmark, registerWallet, getBookmarkAmount } from 'apiProvider';
import { eventTrack } from 'config/analytics';
import fullstar from 'assets/icons/full.png';
import outlinedstar from 'assets/icons/outlinedpink.png';
import outlinedgrey from 'assets/icons/outlined.png';
import CustomTooltip from 'components/common/CustomTooltip';
import BookmarkPopover from './BookmarkPopover';

// deploy

const BookmarkedBadge = ({
  kind,
  identifier,
  width = 22,
  showText,
  additionalInfo = {},
  color = 'var(--logoColor)',
  bookmarkIconType = 'v1',
  showAmount = false,
}) => {
  const anchorEl = useRef(null);
  const {
    state: { user },
    setAuth,
  } = useContext(AuthContext);
  const { showFeedback } = useContext(FeedbackContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedAmount, setBookmarkedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  useEffect(() => {
    if (!user || !identifier) return setLoading(false);

    setIsBookmarked(
      user.watchlist?.find((bookmarked) => {
        return kind === bookmarked.kind && identifier === bookmarked.identifier;
      })
    );

    if (showAmount) {
      getBoomarkedAmount();
    }
  }, [user, identifier, showAmount]);

  const getBoomarkedAmount = async () => {
    const { amount } = await getBookmarkAmount({ kind, identifier });

    setBookmarkedAmount(amount);
  };

  const handleClick = useCallback(
    async (payload) => {
      if (!user) {
        return showFeedback({
          message: 'Please connect to a wallet first.',
          kind: 'error',
        });
      }

      try {
        eventTrack('Watchlist', kind, identifier);
      } catch (err) {}

      const walletToken = localStorage.getItem('walletToken');
      if (!walletToken || walletToken === 'undefined') {
        try {
          const walletRegister = await registerWallet({
            address: decodedAddress,
          });
          localStorage.setItem('walletToken', walletRegister.token);
          localStorage.setItem('wallet', decodedAddress);
        } catch (err) {
          console.log('ERROR DOUBLE-CHECKING REGISTER ON BOOKMARK', err);
        }
      }

      try {
        setLoading(true);
        const user = await manageBookmark({
          kind,
          identifier,
          name:
            additionalInfo.name ||
            additionalInfo.label ||
            additionalInfo.asset_name ||
            additionalInfo.collection_name ||
            identifier,
          image: additionalInfo.optimized_image || additionalInfo.image,
          watchlistName: payload?.watchlistName || 'Watchlist 1',
        }).then((res) => res.user);

        setAuth({ user });

        if (isBookmarked) {
          setIsBookmarked(
            user.watchlist?.find((bookmarked) => {
              return (
                kind === bookmarked.kind && identifier === bookmarked.identifier
              );
            })
          );
          return showFeedback({
            message: `Removed ${kind} from watchlist.`,
            kind: 'success',
          });
        }

        setIsBookmarked(true);
        return showFeedback({
          message: `Added ${kind} to watchlist.`,
          kind: 'success',
        });
      } catch (err) {
        console.log(err);
        return showFeedback({
          message: 'Unexpected error.',
          kind: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [user, isBookmarked, kind]
  );

  if (!user) {
    return (
      <CustomTooltip
        title="Connect wallet to save to whitelist!"
        placement="top"
        style={{ marginLeft: 0, paddingTop: 0 }}
      >
        <div
          className={styles.bookmarkIconContainer}
          style={{
            width: showText ? '100%' : width,
            height: width,
            cursor: 'not-allowed',
          }}
        >
          <img src={outlinedgrey.src} style={{ width, height: width }} />
        </div>
      </CustomTooltip>
    );
  }

  return (
    <div
      className={styles.bookmarkIconContainer}
      style={{ width: showText || loading ? '100%' : width, height: width }}
    >
      {showText && (
        <div style={{ height: width + 1 }}>
          {isBookmarked ? 'Remove' : 'Add'} Watchlist
        </div>
      )}

      <Box
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        ref={anchorEl}
        sx={{ width: width, height: width }}
      >
        {loading ? (
          <CircularProgress sx={{ color, p: 0.5 }} size={14} />
        ) : isBookmarked ? (
          <img src={fullstar.src} style={{ width, height: width }} />
        ) : (
          <img src={outlinedstar.src} style={{ width, height: width }} />
        )}
      </Box>
      {showAmount && !!bookmarkedAmount && (
        <Box className={styles.bookmarkedAmount}>{bookmarkedAmount}</Box>
      )}
      <BookmarkPopover
        anchor={anchorEl}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={handlePopoverOpen}
        handleClick={handleClick}
        target={{ kind, identifier }}
      />
      {/* <CustomTooltip title={`Add ${kind} to watchlist`} placement="top">
        <img src={outlinedstar.src} style={{ width, height: width }} />
      </CustomTooltip> */}
    </div>
  );
};

export default BookmarkedBadge;
