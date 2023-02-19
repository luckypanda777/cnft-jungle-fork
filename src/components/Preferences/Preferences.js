import { CircularProgress, Switch } from '@mui/material';
import { Box } from '@mui/system';
import { editWalletNotifications, getWalletMe } from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { Context as FeedbackContext } from '../../context/FeedbackContext';
import OneSignal from 'react-onesignal';
import { useOnesignalNotifications } from 'hooks/useOnesignalNotifications';
import { Context as AuthContext } from 'context/AuthContext';

const Preferences = () => {
  const { initializeOnesignal } = useOnesignalNotifications();
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { user },
    setAuth,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState({
    enabled: false,
    watchlistNotifications: false,
    eventNotifications: false,
    snipeNotifications: false,
    messageNotifications: false,
    mintNotifications: false,
    loanNotifications: false,
    marketingNotifications: false,
  });

  const enableNotifications = async () => {
    await initializeOnesignal();
    return await onChange({ target: { name: 'enabled', checked: true } });
  };

  const onChange = (e) => {
    if (e.target.name === 'enabled') {
      OneSignal.isPushNotificationsEnabled();
    }

    setLoading({
      ...loading,
      [e.target.name]: true,
    });

    editWalletNotifications({
      notifications: {
        ...user.notifications,
        [e.target.name]: e.target.checked,
      },
    }).then(({ user }) => {
      setAuth({ user });
      setLoading({
        ...loading,
        [e.target.name]: false,
      });
      showFeedback({
        kind: 'success',
        message: 'Settings saved!',
        duration: 1000,
      });
    });
  };

  return (
    <Box>
      <span style={{ fontSize: 18 }}>Notifications</span>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}>
          Enabled
          {loading.enabled ? (
            <CircularProgress
              size={16}
              color="primary"
              sx={{ mx: 1.5, my: 1 }}
            />
          ) : (
            <Switch
              size="small"
              color="primary"
              checked={user?.notifications?.enabled}
              onChange={
                user?.notifications?.enabled ? onChange : enableNotifications
              }
              name="enabled"
            />
          )}
        </Box>
        {user?.notifications?.enabled && (
          <>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Events
              {loading.eventNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.eventNotifications}
                  onChange={onChange}
                  name="eventNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Watchlist
              {loading.watchlistNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.watchlistNotifications}
                  onChange={onChange}
                  name="watchlistNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Snipes
              {loading.snipeNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.snipeNotifications}
                  onChange={onChange}
                  name="snipeNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Messages
              {loading.messageNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.messageNotifications}
                  onChange={onChange}
                  name="messageNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Mints
              {loading.mintNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.mintNotifications}
                  onChange={onChange}
                  name="mintNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Loans
              {loading.loanNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.loanNotifications}
                  onChange={onChange}
                  name="loanNotifications"
                />
              )}
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', my: 0.5, mx: 0.5 }}
            >
              Marketing
              {loading.marketingNotifications ? (
                <CircularProgress
                  size={16}
                  color="primary"
                  sx={{ mx: 1.5, my: 1 }}
                />
              ) : (
                <Switch
                  size="small"
                  color="primary"
                  checked={user?.notifications?.marketingNotifications}
                  onChange={onChange}
                  name="marketingNotifications"
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Preferences;
