import CustomTooltip from 'components/common/CustomTooltip';
import ButtonBase from '@mui/material/ButtonBase';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import BowIcon from 'assets/bow.svg';
import { useAppContext } from 'context/AppContext';

const SnipingButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Sniping Platform">
      <ButtonBase
        disableRipple
        onClick={() => router.push('/sniping')}
        variant="outline"
        sx={{
          flexDirection: 'column',
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          fontFamily: 'newgilroybold',
          fontSize: '12px',
          minWidth: hideOnMobile ? 'fit-content' : 'auto',
          display: {
            xs: hideOnMobile && 'none',
            sm: 'none',
            md: 'none',
            lg: 'none',
            xl: 'inline-flex',
          },
        }}
      >
        <BowIcon width={25} style={{ paddingTop: 2, paddingBottom: 7 }} />
        <span>Sniping</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default SnipingButton;
