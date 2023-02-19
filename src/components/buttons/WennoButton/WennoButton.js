import styles from './WennoButton.module.scss';
import ButtonBase from '@mui/material/ButtonBase';
import CustomTooltip from 'components/common/CustomTooltip';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import BowIcon from 'assets/bow.svg';
import { useAppContext } from '../../context/AppContext';
import unsupported from 'assets/catunsupported.webp';

const WennoButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Wenno Collection">
      <ButtonBase
        disableRipple
        onClick={() => router.push('/wenno')}
        variant="outline"
        sx={{
          flexDirection: 'column',
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          fontFamily: 'newgilroybold',
          fontSize: '12px',
          minWidth: !isMobile && '80px',
          display: {
            xs: hideOnMobile && 'none',
            sm: 'inline-flex',
          },
        }}
      >
        {/* <LocalFireDepartmentIcon fontSize="large" /> */}
        <img src={unsupported.src} style={{ width: 32 }} />
        <span>Wenno</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default WennoButton;
