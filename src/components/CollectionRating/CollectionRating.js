import { useState, useEffect, useContext } from 'react';
import styles from '../AssetsSidebar/Sidebar.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { feedbackCollection } from '../../apiProvider';
import { Context as FeedbackContext } from '../../context/FeedbackContext';
import CustomTooltip from 'components/common/CustomTooltip';

const CollectionRating = ({ collection }) => {
  const theme = useTheme();
  const { showFeedback } = useContext(FeedbackContext);

  const [liked, setLiked] = useState(
    collection?.user_interaction?.includes('like')
  );
  const [flagged, setFlagged] = useState(
    collection?.user_interaction?.includes('flag')
  );
  const [votes, setVotes] = useState(collection?.votes || 0);
  const [flags, setFlags] = useState(collection?.flags || 0);

  useEffect(() => {
    setLiked(collection?.user_interaction?.includes('like'));
    setFlagged(collection?.user_interaction?.includes('flag'));
  }, [collection]);

  const checkLoggedIn = () => {
    const wallet = localStorage.getItem('wallet');
    if (!wallet) {
      showFeedback({
        kind: 'error',
        message: 'You need to be logged in with the wallet to leave feedback.',
        duration: 2000,
      });
    }

    return wallet;
  };

  const handleLikePress = () => {
    const wallet = checkLoggedIn();
    if (!wallet) return;

    setLiked(!liked);

    if (!liked) {
      setVotes(votes + 1);
      showFeedback({
        kind: 'success',
        message: 'Collection liked.',
        duration: 2000,
      });
      return feedbackCollection(collection.id, { reaction: 'like' });
    }

    setVotes(votes - 1);
    showFeedback({
      kind: 'success',
      message: 'Collection unliked.',
      duration: 2000,
    });
    return feedbackCollection(collection.id, { reaction: 'unlike' });
  };

  const handleFlagPress = () => {
    const wallet = checkLoggedIn();
    if (!wallet) return;

    setFlagged(!flagged);

    if (!flagged) {
      setFlags(flags + 1);
      showFeedback({
        kind: 'success',
        message: 'Collection flagged.',
        duration: 2000,
      });
      return feedbackCollection(collection.id, { reaction: 'flag' });
    }

    setFlags(flags - 1);
    showFeedback({
      kind: 'success',
      message: 'Collection unflagged.',
      duration: 2000,
    });
    return feedbackCollection(collection.id, { reaction: 'unflag' });
  };

  const renderLike = () => {
    return liked ? <FavoriteIcon /> : <FavoriteBorderIcon />;
  };

  const renderFrag = () => {
    return flagged ? <FlagIcon /> : <FlagOutlinedIcon />;
  };

  return (
    <Box className={styles.feedbackContainer}>
      <Box className={liked ? styles.liked : styles.like}>
        <CustomTooltip title="Like collection" placement="top">
          <IconButton color="primary" onClick={handleLikePress}>
            {renderLike()}
          </IconButton>
        </CustomTooltip>
        <Typography
          sx={{
            fontSize: 14,
            fontFamily: 'newgilroybold',
            lineHeight: 1,
            fontWeight: 'bold',
            color: liked ? 'primary.main' : 'text.primary',
          }}
        >
          {Math.abs(votes || 0)}
        </Typography>
      </Box>
      <Box className={flagged ? styles.flagged : styles.flag}>
        <CustomTooltip
          title="Flag collection for being either scam or fake"
          placement="top"
        >
          <IconButton color="warning" onClick={handleFlagPress}>
            {renderFrag()}
          </IconButton>
        </CustomTooltip>
        <Typography
          sx={{
            fontSize: 14,
            fontFamily: 'newgilroybold',
            lineHeight: 1,
            fontWeight: 'bold',
            color: flagged ? 'warning.main' : 'text.primary',
          }}
        >
          {flags}
        </Typography>
      </Box>
    </Box>
  );
};

export default CollectionRating;
