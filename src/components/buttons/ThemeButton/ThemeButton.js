import { useState, useEffect } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import SunIcon from 'assets/sun.svg';
import MoonIcon from 'assets/moon.svg';
import { useTheme } from 'next-themes';
import CustomTooltip from 'components/common/CustomTooltip';
import Cookies from 'js-cookie';
import { useAppContext } from 'context/AppContext';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { state } = useAppContext();
  const { isMobile } = state;

  const toggleThemeMode = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    Cookies.set('theme', newTheme, { expires: 365 * 5 });
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const iconStyle = isMobile
    ? {
        paddingTop: 2,
        paddingBottom: 9,
      }
    : {};

  return (
    <CustomTooltip
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      <ButtonBase
        sx={{
          flexDirection: 'column',
          color: theme === 'light' ? '#000' : 'var(--fontColor)',
          fontFamily: 'newgilroybold',
          fontSize: '12px',
          minWidth: !isMobile && '80px',
          display: 'flex',
          justifyContent: !isMobile && 'end',
        }}
        disableRipple
        onClick={toggleThemeMode}
        variant="outline"
      >
        {theme === 'light' ? (
          <MoonIcon style={iconStyle} />
        ) : (
          <SunIcon style={iconStyle} />
        )}
        <span>{`${theme === 'light' ? 'Dark' : 'Light'} Mode`}</span>
      </ButtonBase>
    </CustomTooltip>
  );
};

export default ThemeButton;
