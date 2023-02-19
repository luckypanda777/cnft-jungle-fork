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
import WarningButton from 'components/buttons/WarningButton/WarningButtonV2';
import categories from './items';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import logoUrl from 'assets/junglelogoplain.png';
import WalletButton from 'components/buttons/WalletButton';
import Preferences from 'components/Preferences/PreferencesV2';
import MobileKey from 'components/MobileKey/MobileKeyV2';
import JungleLogo from 'assets/icons/jungle.svg';
import styles from '../styles.module.scss';
import { Icon } from '@iconify/react';

const MenuList = () => {
  const { state } = useAppContext();
  const router = useRouter();

  const handleOpenSocial = ({ name, link }) => {
    window.open(link, '_blank');
    try {
      eventTrack('social', 'open', `${name}-${link}`);
    } catch (err) {}
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        padding: '30px',
      }}
    >
      <List
        sx={{
          rowGap: 0,
          overflowY: 'auto',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          rowGap: '10px',
        }}
      >
        {state.isMobile && (
          <Box>
            <span style={{ fontSize: 18, padding: 0 }}>Connect Wallet</span>
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
              <div
                style={{
                  fontSize: 16,
                  lineHeight: '19px',
                  fontWeight: 700,
                  letterSpacing: '-0.327485px',
                  fontFamily: 'newgilroysemibold',
                  marginBottom: '5px',
                }}
              >
                {category.name}
              </div>
              {category.items.map((item) => {
                return (
                  <ListItem
                    key={item.route}
                    onClick={() =>
                      item.route.startsWith('http')
                        ? window.open(item.route, '_blank')
                        : router.push(item.route)
                    }
                    className={styles.menuItem}
                    sx={{
                      cursor: 'pointer',
                      padding: 0,
                      ...item.style,
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: 'newgilroymedium',
                        color: 'var(--cartSellTitleValue)',
                        lineHeight: '24px',
                      }}
                    />
                  </ListItem>
                );
              })}
            </Box>
          );
        })}
        <MobileKey />
        <Preferences />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            marginTop: '20px',
          }}
        >
          Status
          <WarningButton />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Box>
            <JungleLogo width={80} height={20} />
          </Box>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <Icon
              icon="akar-icons:twitter-fill"
              width={17}
              className={styles.socialsIcon}
              onClick={() => {
                window.open('https://twitter.com/CNFTJungle', '_blank');
              }}
            />
            <Icon
              icon="simple-icons:discord"
              width={17}
              className={styles.socialsIcon}
              onClick={() => {
                window.open('https://discord.gg/T9Ktk9j5vN', '_blank');
              }}
            />
          </Box>
        </Box>
      </List>
    </Box>
  );
};

export default MenuList;
