import CustomTooltip from 'components/common/CustomTooltip';
import ButtonBase from '@mui/material/ButtonBase';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from 'context/AppContext';

const MintingNowButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Minting now" style={{ marginLeft: 0, paddintTop: 0 }}>
      <ButtonBase
        disableRipple
        onClick={() => router.push('/minting')}
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
        <LocalFireDepartmentIcon
          sx={{ color: 'var(--fontColor)', fontSize: 32, paddingBottom: 0.25 }}
        />
        <span>Minting</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default MintingNowButton;
