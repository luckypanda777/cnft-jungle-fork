import ButtonBase from '@mui/material/ButtonBase';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const WatchlistButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Your Watchlist">
      <ButtonBase
        onClick={() => router.push('/watchlist')}
        variant="outline"
        sx={{
          flexDirection: 'column',
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          fontFamily: 'newgilroybold',
          fontSize: '12px',
          display: {
            xs: hideOnMobile && 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'inline-flex',
          },
          minWidth: hideOnMobile ? 'fit-content' : 'auto',
        }}
      >
        <RadarOutlinedIcon
          sx={{ color: 'var(--fontColor)', fontSize: 32, paddingBottom: 0.25 }}
        />
        <span>Watchlist</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default WatchlistButton;
