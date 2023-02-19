import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CustomTooltip from 'components/common/CustomTooltip';
import PhishingIcon from '@mui/icons-material/Phishing';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../context/AppContext';

const Button = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  fontFamily: 'newgilroybold',
  fontSize: '12px',
  minWidth: '80px',
  color: theme.palette.mode === 'light' ? '#000' : 'var(--fontColor)',
  cursor: 'pointer',
}));

const WhaleButton = ({ hideOnMobile = true }) => {
  const router = useRouter();
  const { state } = useAppContext();
  const { isMobile } = state;
  const { theme } = useTheme();

  return (
    <CustomTooltip title="Whale Watching">
      <Button
        onClick={() => router.push('/whales')}
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
        <PhishingIcon fontSize="large" />
        <span>Whales</span>
      </Button>
    </CustomTooltip>
  );
};

export default WhaleButton;
