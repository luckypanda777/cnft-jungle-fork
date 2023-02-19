import React, { useCallback, useContext, useRef } from 'react';
import styles from 'components/badges/BookmarkedBadge/BookmarkedBadge.module.scss';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useState } from 'react';
import { useEffect } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CustomTooltip from 'components/common/CustomTooltip';
import HuntPopover from './HuntPopover';
import { Context as AuthContext } from 'context/AuthContext';
import { Context as SearchContext } from 'context/SearchContext';
import { updateHunt } from 'apiProvider';

const HuntlistBadge = ({
  hunt,
  width = 22,
  showText,
  color = 'var(--logoColor)',
}) => {
  const {
    state: { huntList },
    setSearches,
  } = useContext(SearchContext);
  const anchorEl = useRef(null);
  const {
    state: { walletInfo },
  } = useAppContext();
  const { showFeedback } = useContext(FeedbackContext);
  const [loading, setLoading] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  useEffect(() => {
    if (!walletInfo.address) return setLoading(false);
  }, [walletInfo.huntlist, walletInfo.address]);

  const handleClick = useCallback(
    async (payload) => {
      if (!walletInfo.address) {
        return showFeedback({
          message: 'Please connect to a wallet first.',
          kind: 'error',
        });
      }

      console.log(payload);

      try {
        setLoading(true);
        updateHunt(hunt._id, {
          ...hunt,
          huntlistName: payload?.huntlistName,
        }).then(({ hunt }) =>
          setSearches(huntList.map((h) => (h._id === hunt._id ? hunt : h)))
        );

        return showFeedback({
          message: `Moved hunt to huntlist.`,
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
    [huntList, walletInfo.address, hunt]
  );

  if (!walletInfo.address) {
    return (
      <div
        className={styles.bookmarkIconContainer}
        style={{ width: showText ? '100%' : width, height: width }}
      >
        <CustomTooltip
          title={`Connect wallet to save to huntlist!`}
          placement="top"
        >
          <FormatListBulletedIcon
            fontSize="medium"
            sx={{ color: 'var(--rankGrey)' }}
          />
        </CustomTooltip>
      </div>
    );
  }

  return (
    <>
      <Box
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        ref={anchorEl}
      >
        <IconButton
          aria-label="move"
          sx={{
            color: 'var(--fontColor)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          {walletInfo.loading || loading ? (
            <CircularProgress sx={{ color, p: 0.5 }} size={14} />
          ) : (
            <FormatListBulletedIcon fontSize="medium" />
          )}
        </IconButton>
      </Box>
      <HuntPopover
        anchor={anchorEl}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={handlePopoverOpen}
        handleClick={handleClick}
        hunt={hunt}
      />
      {/* <CustomTooltip title={`Add ${kind} to huntlist`} placement="top">
        <img src={outlinedstar.src} style={{ width, height: width }} />
      </CustomTooltip> */}
    </>
  );
};

export default HuntlistBadge;
