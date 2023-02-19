import ButtonBase from '@mui/material/ButtonBase';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

const CalendarButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Collection Calendar">
      <ButtonBase
        onClick={() => router.push('/calendar')}
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
        <DateRangeIcon
          sx={{ color: 'var(--fontColor)', fontSize: 32, paddingBottom: 0.25 }}
        />
        <span>Calendar</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default CalendarButton;
