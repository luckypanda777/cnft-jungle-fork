import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const Button = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  fontFamily: 'newgilroybold',
  fontSize: '12px',
  minWidth: '80px',
  color: theme.palette.mode === 'light' ? '#000' : 'var(--fontColor)',
  cursor: 'pointer',
}));

const StatisticsButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Statistics Overview">
      <Button
        onClick={() => router.push('/statistics')}
        variant="outline"
        sx={{
          display: {
            xs: hideOnMobile && 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'inline-flex',
          },
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          marginTop: isMobile && '2px',
          marginLeft: isMobile && '5px',
          minWidth: hideOnMobile ? 'fit-content' : 'auto',
        }}
      >
        <QueryStatsIcon
          sx={{ color: 'var(--fontColor)', fontSize: 32, paddingBottom: 0.25 }}
        />
        <span>Statistics</span>
      </Button>
    </CustomTooltip>
  );
};

export default StatisticsButton;
