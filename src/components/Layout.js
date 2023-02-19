import { useEffect, useState, cloneElement } from 'react';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { useOnesignalNotifications } from '../hooks/useOnesignalNotifications';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Maintenance from './layout/Maintenance';
import GlobalFeedback from 'components/common/GlobalFeedback';
import { useTheme } from 'next-themes';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import MainSidebar from './layout/MainSidebar';

const Header = dynamic(() => import('./layout/Header'), {
  ssr: false,
});

const defaultPalette = {
  primary: {
    main: '#D5317C',
  },
  secondary: {
    main: '#1c1c1f',
  },
  grey: {
    400: '#b6b8cd',
    300: '#f6f7fb',
    200: 'var(--assetsBg)',
  },
};

const themeMuiLight = createTheme({
  palette: {
    mode: 'light',
    ...defaultPalette,
  },
});

const themeMuiDark = createTheme({
  palette: {
    mode: 'dark',
    ...defaultPalette,
  },
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    position: 'relative',
    width: 'calc(100% - 300px)',
    padding: '15px',
    marginTop: 'var(--headerHeight)',
    marginBottom: '20px',
    borderRadius: '12px',
    backgroundColor: 'var(--assetsBg)',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // offset 20px
    //marginLeft: '20px',
    //marginRight: '20px',
    ...(!open && {
      [theme.breakpoints.down('md')]: {
        marginRight: '20px',
        padding: '16px',
      },
      [theme.breakpoints.down('sm')]: {
        marginRight: '10px',
        padding: 0,
        marginLeft: '10px',
      },
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      // marginRight: 0,
    }),
  })
);

const Layout = ({ children, mode, header }) => {
  const { theme, setTheme } = useTheme();
  const [muiTheme, setMuiTheme] = useState(
    mode === 'light' ? themeMuiLight : themeMuiDark
  );
  const [openMenu, setOpenMenu] = useState(false);

  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

  useGoogleAnalytics();
  // useOnesignalNotifications();

  useEffect(() => {
    setTheme(mode);
  }, []);

  useEffect(() => {
    setMuiTheme(theme === 'light' ? themeMuiLight : themeMuiDark);
  }, [theme]);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  if (maintenance) return <Maintenance />;

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ display: 'flex', backgroundColor: 'var(--bgColor)' }}>
        {header ? <Header handleMenu={handleMenu} /> : null}
        <Main open={openMenu}>
          {cloneElement(children, { menuOpen: openMenu })}
        </Main>
        <MainSidebar open={openMenu} handleMenu={handleMenu} />
      </Box>
      <GlobalFeedback />
    </ThemeProvider>
  );
};

export default Layout;
