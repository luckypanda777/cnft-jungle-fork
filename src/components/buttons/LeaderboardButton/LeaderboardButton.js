import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const Button = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  fontFamily: 'newgilroybold',
  fontSize: '12px',
  minWidth: '80px',
  color: theme.palette.mode === 'light' ? '#000' : 'var(--fontColor)',
  cursor: 'pointer',
}));

const LeaderboardButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Whale Watching">
      <Button
        onClick={() => router.push('/leaderboards')}
        variant="outline"
        sx={{
          display: {
            xs: hideOnMobile && 'none',
            sm: 'inline-flex',
          },
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          marginTop: isMobile && '2px',
          marginLeft: isMobile && '5px',
          minWidth: hideOnMobile ? '80px' : 'auto',
        }}
      >
        <EmojiEventsIcon fontSize="large" />
        <span>Leaderboard</span>
      </Button>
    </CustomTooltip>
  );
};

export default LeaderboardButton;
