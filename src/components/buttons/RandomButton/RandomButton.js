import ButtonBase from '@mui/material/ButtonBase';
import DiceIcon from 'assets/dice.svg';
import DiceLightIcon from 'assets/dicelight.svg';
import CustomTooltip from 'components/common/CustomTooltip';
import { useAppContext } from '../../../context/AppContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const RandomButton = ({ hideOnMobile = true }) => {
  const { theme } = useTheme();
  const { state } = useAppContext();
  const { isMobile } = state;

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true));

  if (!mounted) return null;

  const getToRandomCollection = () => {
    const randomNumber = Math.floor(Math.random() * state.totalCollections) + 1;
    return (window.location.href = `/collections/${randomNumber}`);
  };

  const iconStyle = isMobile
    ? {
        paddingTop: 3,
        paddingBottom: 2,
      }
    : {
        paddingTop: 3,
        paddingBottom: 2,
      };

  return (
    <CustomTooltip title="Random collection">
      <ButtonBase
        disableRipple
        onClick={getToRandomCollection}
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
          justifyContent: 'end',
        }}
      >
        {theme === 'light' ? (
          <DiceIcon style={iconStyle} />
        ) : (
          <DiceLightIcon style={iconStyle} />
        )}
        <span>Random</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default RandomButton;
