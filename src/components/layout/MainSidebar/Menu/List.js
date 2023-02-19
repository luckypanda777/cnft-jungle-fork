import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ThemeButton from 'components/buttons/ThemeButton';
import WarningButton from 'components/buttons/WarningButton';
import categories from './items';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import logoUrl from 'assets/junglelogoplain.png';
import WalletButton from 'components/buttons/WalletButton';
import Preferences from 'components/Preferences';
import MobileKey from 'components/MobileKey';
import JungleLogo from 'assets/icons/logovertical.svg';

const MenuList = () => {
  const { state } = useAppContext();
  const router = useRouter();

  return (
    <Box sx={{ p: 2, my: 2 }}>
      <List sx={{ rowGap: 0, overflowY: 'auto' }}>
        {state.isMobile && (
          <Box>
            <span style={{ fontSize: 18 }}>Connect Wallet</span>
            <ListItem sx={{ cursor: 'pointer' }}>
              <ListItemText
                primary="Select Wallet"
                primaryTypographyProps={{
                  fontWeight: '500',
                  fontFamily: 'newgilroymedium',
                }}
              />
              {state.isMobile && <WalletButton />}
            </ListItem>
            <Divider sx={{ mb: 3 }} />
          </Box>
        )}
        {categories.map((category, i) => {
          return (
            <Box key={i}>
              {i !== 0 && <Divider sx={{ mb: 3 }} />}
              <span
                style={{
                  fontSize: 18,
                  paddingLeft: 12,
                  fontFamily: 'newgilroysemibold',
                }}
              >
                {category.name}
              </span>
              {category.items.map((item) => {
                return (
                  <ListItem
                    key={item.route}
                    onClick={() =>
                      item.route.startsWith('http')
                        ? window.open(item.route, '_blank')
                        : router.push(item.route)
                    }
                    sx={{
                      cursor: 'pointer',
                      ...item.style,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30, pr: 0.5 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontFamily: 'newgilroymedium',
                        paddingTop: 0.25,
                      }}
                    />
                  </ListItem>
                );
              })}
            </Box>
          );
        })}
        <Divider sx={{ mb: 2 }} />
        <MobileKey />
        <Divider sx={{ mb: 2 }} />
        <Preferences />
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
          }}
        >
          Status
          <WarningButton />
        </Box>
        {/* <Divider sx={{ my: 2 }} /> */}
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*    alignItems: 'center',*/}
        {/*    fontSize: 16,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Change theme*/}
        {/*  <ThemeButton />*/}
        {/*</Box>*/}
        {/*<Divider sx={{ my: 2 }} />*/}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <JungleLogo width={150} height={125} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            fontSize: 14,
            mt: 1,
          }}
        >
          {state.stats?.totalCollections?.toLocaleString()} Collections
          <Divider
            sx={{ my: 'auto', height: 10, mx: 0.25 }}
            orientation="vertical"
          />
          {state.stats?.totalAssets?.toLocaleString()} Assets
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            fontSize: 14,
          }}
        >
          {state.stats?.totalListings?.toLocaleString()} Listings
          <Divider
            sx={{ my: 'auto', height: 10, mx: 0.25 }}
            orientation="vertical"
          />
          {state.stats?.totalTrades?.toLocaleString()} Trades
        </Box>
      </List>
    </Box>
  );
};

export default MenuList;
