import ButtonBase from '@mui/material/ButtonBase';
import CustomTooltip from 'components/common/CustomTooltip';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from 'context/AppContext';
import AdvertiseIcon from 'assets/icons/gromofon.svg';

const AdvertiseButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();

  return (
    <CustomTooltip title="Advertise with Jungle">
      <ButtonBase
        disableRipple
        onClick={() => router.push('/promotions')}
        variant="outline"
        sx={{
          flexDirection: 'column',
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
          color: 'var(--fontColor)',
        }}
      >
        <AdvertiseIcon width={35} height={35} />
        <span>Advertise</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default AdvertiseButton;
