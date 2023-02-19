import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CustomTooltip from 'components/common/CustomTooltip';
import CheckCircleOutlineIcon from 'assets/ic-actions-check.svg';
import { useAppContext } from 'context/AppContext';

const Button = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  fontFamily: 'newgilroybold',
  fontSize: '12px',
  minWidth: '80px',
  color: 'goldenrod',
}));

const WarningButton = () => {
  const { state: isMobile } = useAppContext();
  const maitenanceWarning =
    process.env.NEXT_PUBLIC_REACT_APP_MAINTENANCE_TEXT ||
    process.env.REACT_APP_MAINTENANCE_TEXT;

  if (!maitenanceWarning) {
    return (
      <CustomTooltip title="Jungle is in sync and all systems operational. If you notice something is off please contact us on Twitter or Discord.">
        <Button
          variant="outline"
          sx={{
            display: 'flex',
            cursor: 'default',
            flexDirection: 'row',
            gap: '6px',
            color: 'var(--undervaluedColor)',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '16.7px',
            minWidth: 'auto',
          }}
        >
          <CheckCircleOutlineIcon />
          <span>Synced</span>
        </Button>
      </CustomTooltip>
    );
  }

  return (
    <CustomTooltip title={maitenanceWarning}>
      <Button
        variant="outline"
        sx={{
          display: {
            xs: 'flex',
            sm: 'flex',
          },
          flexDirection: 'column',
          cursor: 'default',
          minWidth: isMobile ? 65 : 80,
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 30 }} />
        <span>Not synced</span>
      </Button>
    </CustomTooltip>
  );
};

export default WarningButton;
